import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUtensils, FaSearch, FaWeight } from 'react-icons/fa';
import './Recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    menuItem: '',
    ingredients: []
  });

  useEffect(() => {
    fetchRecipes();
    fetchMenuItems();
    fetchRawMaterials();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/inventory/recipes');
      const data = await response.json();
      setRecipes(data.data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/v1/menu-items');
      const data = await response.json();
      setMenuItems(data.data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const response = await fetch('/api/v1/inventory/raw-materials');
      const data = await response.json();
      setRawMaterials(data.data || []);
    } catch (error) {
      console.error('Error fetching raw materials:', error);
    }
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, {
        rawMaterial: '',
        quantityRequired: 1
      }]
    });
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingRecipe 
        ? `/api/v1/inventory/recipes/${editingRecipe._id}`
        : '/api/v1/inventory/recipes';
      
      const method = editingRecipe ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingRecipe(null);
        setFormData({
          menuItem: '',
          ingredients: []
        });
        fetchRecipes();
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      menuItem: recipe.menuItem._id,
      ingredients: recipe.ingredients
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await fetch(`/api/v1/inventory/recipes/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchRecipes();
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.menuItem?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recipes">
      <div className="section-header">
        <h2>Recipes</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Recipe
        </button>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search recipes..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading recipes...</div>
      ) : filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <FaUtensils className="empty-state-icon" />
          <h3>No recipes found</h3>
          <p>Create recipes to manage your menu item ingredients</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <div className="recipe-header">
                <h3>{recipe.menuItem?.name}</h3>
                <div className="recipe-actions">
                  <button className="btn-secondary" onClick={() => handleEdit(recipe)}>
                    <FaEdit />
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(recipe._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="recipe-details">
                <div className="ingredients-list">
                  <h4>Ingredients:</h4>
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-item">
                      <span className="ingredient-name">
                        {ingredient.rawMaterial?.name}
                      </span>
                      <span className="ingredient-quantity">
                        <FaWeight />
                        {ingredient.quantityRequired} {ingredient.rawMaterial?.unit}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="recipe-meta">
                  <span className="created-date">
                    Created: {new Date(recipe.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingRecipe ? 'Edit Recipe' : 'Add Recipe'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Menu Item*</label>
                <select
                  value={formData.menuItem}
                  onChange={(e) => setFormData({...formData, menuItem: e.target.value})}
                  required
                >
                  <option value="">Select Menu Item</option>
                  {menuItems.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="recipe-ingredients">
                <div className="ingredients-header">
                  <h4>Ingredients</h4>
                  <button type="button" className="btn-secondary" onClick={handleAddIngredient}>
                    <FaPlus /> Add Ingredient
                  </button>
                </div>
                
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-row">
                    <div className="ingredient-inputs">
                      <div className="form-group">
                        <label>Raw Material*</label>
                        <select
                          value={ingredient.rawMaterial}
                          onChange={(e) => handleIngredientChange(index, 'rawMaterial', e.target.value)}
                          required
                        >
                          <option value="">Select Material</option>
                          {rawMaterials.map(material => (
                            <option key={material._id} value={material._id}>
                              {material.name} ({material.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Quantity Required*</label>
                        <input
                          type="number"
                          value={ingredient.quantityRequired}
                          onChange={(e) => handleIngredientChange(index, 'quantityRequired', Number(e.target.value))}
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        className="btn-danger remove-ingredient-btn"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingRecipe ? 'Update' : 'Add'} Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
