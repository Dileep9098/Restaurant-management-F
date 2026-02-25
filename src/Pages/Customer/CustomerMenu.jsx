// import React, { useEffect, useState } from "react";
// import "./customerMenu.css";
// import axiosInstance from "../../apiHandler/axiosInstance";

// export default function CustomerMenu() {
//   const [menu, setMenu] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const params = new URLSearchParams(window.location.search);
//   const restaurant = params.get("restaurant");
//   const table = params.get("table");

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   const fetchMenu = async () => {
//     try {
//       const res = await axiosInstance.get(
//         `/api/v1/menu?restaurant=${restaurant}&table=${table}`
//       );
//       setMenu(res.data.data);
//       setActiveCategory(res.data.data.categories?.[0]?._id);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="loader">Loading delicious food 😋</div>;
//   if (!menu) return <div className="loader">Menu not available</div>;

//   return (
//     <div className="zomato-menu">
//       {/* HEADER */}
//       <div className="z-header">
//         <h2>{menu.restaurant?.name}</h2>
//         <p>Table {menu.table?.tableNumber}</p>
//       </div>

//       {/* CATEGORY TABS */}
//       <div className="category-tabs">
//         {menu.categories.map((cat) => (
//           <button
//             key={cat._id}
//             className={activeCategory === cat._id ? "active" : ""}
//             onClick={() => setActiveCategory(cat._id)}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* ITEMS */}
//       <div className="item-list">
//         {menu.items
//           .filter((i) => i.category === activeCategory)
//           .map((item) => {
//             const hasVariant = menu.variantGroups.some(
//               (vg) => vg.menuItem === item._id
//             );

//             return (
//               <div key={item._id} className="food-card">
//                 <div className="food-info">
//                   <h4>{item.name}</h4>
//                   <p>{item.description || "Chef’s special 🔥"}</p>
//                   <span className="price">₹{item.basePrice}</span>
//                 </div>

//                 <div className="food-image">
//                   <img
//                     src={
//                       item.image?.[0]
//                         ? `/assets/images/menu/${item.image[0]}`
//                         : "https://via.placeholder.com/120"
//                     }
//                     alt={item.name}
//                   />

//                   <button
//                     className={`add-btn ${hasVariant ? "customize" : ""}`}
//                     onClick={() =>
//                       hasVariant
//                         ? setSelectedItem(item)
//                         : alert("Added to cart")
//                     }
//                   >
//                     {hasVariant ? "CUSTOMISE" : "ADD"}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       {/* VARIANT MODAL */}
//       {selectedItem && (
//         <VariantModal
//           item={selectedItem}
//           menu={menu}
//           onClose={() => setSelectedItem(null)}
//         />
//       )}
//     </div>
//   );
// }

// function VariantModal({ item, menu, onClose }) {
//   const groups = menu.variantGroups.filter(
//     (g) => g.menuItem === item._id
//   );

//   const [selected, setSelected] = useState({});

//   const handleSelect = (group, variant) => {
//     setSelected((prev) => {
//       const prevGroup = prev[group._id] || [];

//       if (group.isMultiple) {
//         return {
//           ...prev,
//           [group._id]: prevGroup.some((v) => v._id === variant._id)
//             ? prevGroup.filter((v) => v._id !== variant._id)
//             : [...prevGroup, variant],
//         };
//       } else {
//         return { ...prev, [group._id]: [variant] };
//       }
//     });
//   };

//   const isValid = groups.every(
//     (g) => !g.isRequired || (selected[g._id]?.length > 0)
//   );

//   const totalPrice =
//     item.basePrice +
//     Object.values(selected)
//       .flat()
//       .reduce((sum, v) => sum + v.price, 0);

//   return (
//     <div className="variant-overlay">
//       <div className="variant-sheet">
//         <div className="variant-header">
//           <h3>{item.name}</h3>
//           <button onClick={onClose}>✕</button>
//         </div>

//         {groups.map((group) => (
//           <div key={group._id} className="variant-group">
//             <h4>
//               {group.name}
//               {group.isRequired && <span className="required"> Required</span>}
//             </h4>

//             {menu.variants
//               .filter((v) => v.variantGroup === group._id)
//               .map((variant) => {
//                 const checked =
//                   selected[group._id]?.some(
//                     (v) => v._id === variant._id
//                   ) || false;

//                 return (
//                   <label key={variant._id} className="variant-option">
//                     <input
//                       type={group.isMultiple ? "checkbox" : "radio"}
//                       checked={checked}
//                       onChange={() => handleSelect(group, variant)}
//                     />
//                     <span>{variant.name}</span>
//                     <span className="price">+₹{variant.price}</span>
//                   </label>
//                 );
//               })}
//           </div>
//         ))}

//         <button
//           disabled={!isValid}
//           className="add-cart-btn"
//           onClick={() => {
//             console.log("ITEM:", item);
//             console.log("VARIANTS:", selected);
//             console.log("TOTAL:", totalPrice);
//             onClose();
//           }}
//         >
//           ADD ₹{totalPrice}
//         </button>
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import "./customerMenu.css";
// import axiosInstance from "../../apiHandler/axiosInstance";

// export default function CustomerMenu() {
//   const [menu, setMenu] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [cart, setCart] = useState([]);

//   const params = new URLSearchParams(window.location.search);
//   const restaurant = params.get("restaurant");
//   const table = params.get("table");

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   const fetchMenu = async () => {
//     try {
//       const res = await axiosInstance.get(
//         `/api/v1/menu?restaurant=${restaurant}&table=${table}`
//       );
//       setMenu(res.data.data);
//       setActiveCategory(res.data.data.categories?.[0]?._id);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = (item, variants = [], totalPrice) => {
//     setCart((prev) => [...prev, { item, variants, totalPrice }]);
//   };

//   if (loading) return <div className="loader">Loading delicious food 😋</div>;
//   if (!menu) return <div className="loader">Menu not available</div>;

//   const cartTotal = cart.reduce((s, c) => s + c.totalPrice, 0);

//   return (
//     <div className="zomato-menu">
//       {/* HEADER */}
//       <div className="z-header">
//         <h2>{menu.restaurant?.name || "Restaurant"}</h2>
//         <p>Table {menu.table?.tableNumber}</p>
//       </div>

//       {/* CATEGORY TABS */}
//       <div className="category-tabs">
//         {menu.categories.map((cat) => (
//           <button
//             key={cat._id}
//             className={activeCategory === cat._id ? "active" : ""}
//             onClick={() => setActiveCategory(cat._id)}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* ITEMS */}
//       <div className="item-list">
//         {menu.items
//           .filter((i) => i.category === activeCategory)
//           .map((item) => {
//             const hasVariant = menu.variantGroups.some(
//               (vg) => vg.menuItem === item._id
//             );

//             return (
//               <div key={item._id} className="food-card">
//                 <div className="food-info">
//                   <span className={`dot ${item.isVeg ? "veg" : "nonveg"}`} />
//                   <h4>{item.name}</h4>
//                   <p>{item.description || "Bestseller 🔥"}</p>
//                   <span className="price">₹{item.basePrice}</span>
//                 </div>

//                 <div className="food-image">
//                   <img
//                     src={
//                       item.image?.[0]
//                         ? `/assets/images/menu/${item.image[0]}`
//                         : "https://via.placeholder.com/120"
//                     }
//                     alt={item.name}
//                   />
//                   <button
//                     className={`add-btn ${hasVariant ? "customize" : ""}`}
//                     onClick={() =>
//                       hasVariant
//                         ? setSelectedItem(item)
//                         : addToCart(item, [], item.basePrice)
//                     }
//                   >
//                     {hasVariant ? "CUSTOMISE" : "ADD"}
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       {/* VARIANT MODAL */}
//       {selectedItem && (
//         <VariantModal
//           item={selectedItem}
//           menu={menu}
//           onClose={() => setSelectedItem(null)}
//           onAdd={addToCart}
//         />
//       )}

//       {/* CART BAR */}
//       {cart.length > 0 && (
//         <div className="cart-bar">
//           <div>
//             <strong>{cart.length} Items</strong>
//             <p>₹{cartTotal}</p>
//           </div>
//           <button>VIEW CART</button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------------- VARIANT MODAL ---------------- */

// function VariantModal({ item, menu, onClose, onAdd }) {
//     const groups = menu.variantGroups.filter(
//         (g) => g.menuItem === item._id
//     );

//     const [selected, setSelected] = useState({});

//     const handleSelect = (group, variant) => {
//         setSelected((prev) => {
//             const prevGroup = prev[group._id] || [];

//             if (group.isMultiple) {
//                 return {
//                     ...prev,
//                     [group._id]: prevGroup.some((v) => v._id === variant._id)
//                         ? prevGroup.filter((v) => v._id !== variant._id)
//                         : [...prevGroup, variant],
//                 };
//             } else {
//                 return { ...prev, [group._id]: [variant] };
//             }
//         });
//     };

//     const isValid = groups.every(
//         (g) => !g.isRequired || selected[g._id]?.length > 0
//     );

//     const selectedVariants = Object.values(selected).flat();

//     const totalPrice =
//         item.basePrice +
//         selectedVariants.reduce((s, v) => s + v.price, 0);

//     return (
//         <div className="variant-overlay">
//             <div className="variant-sheet">
//                 <div className="variant-header">
//                     <h3>{item.name}</h3>
//                     <button onClick={onClose}>✕</button>
//                 </div>

//                 {groups.map((group) => (
//                     <div key={group._id} className="variant-group">
//                         <h4>
//                             {group.name}
//                             {group.isRequired && <span className="required"> Required</span>}
//                         </h4>

//                         {menu.variants
//                             .filter((v) => v.variantGroup === group._id)
//                             .map((variant) => {
//                                 const checked =
//                                     selected[group._id]?.some(
//                                         (v) => v._id === variant._id
//                                     ) || false;

//                                 return (
//                                     <label key={variant._id} className="variant-option">
//                                         <input
//                                             type={group.isMultiple ? "checkbox" : "radio"}
//                                             checked={checked}
//                                             onChange={() => handleSelect(group, variant)}
//                                         />
//                                         <span>{variant.name}</span>
//                                         <span className="price">+₹{variant.price}</span>
//                                     </label>
//                                 );
//                             })}
//                     </div>
//                 ))}

//                 <button
//                     disabled={!isValid}
//                     className="add-cart-btn"
//                     onClick={() => {
//                         onAdd(item, selectedVariants, totalPrice);
//                         onClose();
//                     }}
//                 >
//                     ADD ₹{totalPrice}
//                 </button>
//             </div>
//         </div>
//     );
// }



// import React, { useEffect, useState } from "react";
// import "./customerMenu.css";
// import axiosInstance from "../../apiHandler/axiosInstance";

// export default function CustomerMenu() {
//     const [menu, setMenu] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeCategory, setActiveCategory] = useState(null);
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [cart, setCart] = useState([]);
//     const [filter, setFilter] = useState("all");

//     const params = new URLSearchParams(window.location.search);
//     const restaurant = params.get("restaurant");
//     const table = params.get("table");

//     useEffect(() => {
//         fetchMenu();
//     }, []);

//     const fetchMenu = async () => {
//         try {
//             const res = await axiosInstance.get(
//                 `/api/v1/menu?restaurant=${restaurant}&table=${table}`
//             );
//             setMenu(res.data.data);
//             setActiveCategory(res.data.data.categories?.[0]?._id);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addToCart = (item, variants = [], totalPrice) => {
//         setCart((prev) => [...prev, { item, variants, totalPrice }]);
//     };

//     if (loading) return <div className="loader">Loading delicious food 😋</div>;
//     if (!menu) return <div className="loader">Menu not available</div>;

//     const cartTotal = cart.reduce((s, c) => s + c.totalPrice, 0);

//     const filteredItems = menu.items
//         .filter((i) => i.category === activeCategory)
//         .filter((i) => {
//             if (filter === "veg") return i.isVeg;
//             if (filter === "nonveg") return !i.isVeg;
//             return true;
//         });

//     return (
//         <div className="zomato-menu">
//             {/* HEADER */}
//             <div className="z-header">
//                 <h2>{menu.restaurant?.name}</h2>
//                 <p>Table {menu.table?.tableNumber}</p>
//             </div>

//             {/* SLIDER */}
//             <div className="slider">
//                 {(menu.banners || [1, 2, 3]).map((b, i) => (
//                     <img
//                         key={i}
//                         src={b?.image || "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}
//                         alt="banner"
//                     />
//                 ))}
//             </div>

//             {/* CATEGORY WITH IMAGE */}
//             <div className="category-scroll">
//                 {menu.categories.map((cat) => (
//                     <div
//                         key={cat._id}
//                         className={`category-card ${activeCategory === cat._id ? "active" : ""}`}
//                         onClick={() => setActiveCategory(cat._id)}
//                     >
//                         <img
//                             src={`/assets/images/categories/${cat.image}` || "https://via.placeholder.com/80"}
//                             alt={cat.name}
//                         />
//                         <span>{cat.name}</span>
//                     </div>
//                 ))}
//             </div>

//             {/* FILTER */}
//             <div className="filters">
//                 <button
//                     className={filter === "all" ? "active" : ""}
//                     onClick={() => setFilter("all")}
//                 >
//                     All
//                 </button>
//                 <button
//                     className={filter === "veg" ? "active veg" : "veg"}
//                     onClick={() => setFilter("veg")}
//                 >
//                     Veg
//                 </button>
//                 <button
//                     className={filter === "nonveg" ? "active nonveg" : "nonveg"}
//                     onClick={() => setFilter("nonveg")}
//                 >
//                     Non-Veg
//                 </button>
//             </div>

//             <div className="clean-menu-grid">
//                 {filteredItems.map((item) => (
//                     <div
//                         key={item._id}
//                         className="clean-card"
//                         onClick={() => setSelectedItem(item)}
//                     >
//                         <div className="clean-img-wrap">
//                             <img
//                                 src={
//                                     item.image?.[0]
//                                         ? `/assets/images/menu/${item.image[0]}`
//                                         : "https://via.placeholder.com/300"
//                                 }
//                                 alt={item.name}
//                             />

//                             <span className={`clean-dot ${item.isVeg ? "veg" : "nonveg"}`} />
//                         </div>

//                         <div className="clean-info">
//                             <h4>{item.name}</h4>
//                         </div>
//                     </div>
//                 ))}
//             </div>





//             {/* VARIANT MODAL */}
//             {selectedItem && (
//                 <VariantModal
//                     item={selectedItem}
//                     menu={menu}
//                     onClose={() => setSelectedItem(null)}
//                     onAdd={addToCart}
//                 />
//             )}

//             {/* CART BAR */}
//             {cart.length > 0 && (
//                 <div className="cart-bar">
//                     <div>
//                         <strong>{cart.length} Items</strong>
//                         <p>₹{cartTotal}</p>
//                     </div>
//                     <button>VIEW CART</button>
//                 </div>
//             )}
//         </div>
//     );
// }



// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import axiosInstance from "../../apiHandler/axiosInstance";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import VariantDrawer from "../../Componants/Items/VariantModel";
// import Config from "../../Config/Config";
// import "./customerMenu.css";

// export default function CustomerMenu() {
//   const [menu, setMenu] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [allBanners, setAllBanners] = useState([]);

//   const params = new URLSearchParams(window.location.search);
//   const restaurant = params.get("restaurant");
//   const table = params.get("table");

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   const fetchMenu = async () => {
//     try {
//       const res = await axiosInstance.get(
//         `/api/v1/menu?restaurant=${restaurant}&table=${table}`
//       );
//       const resBanner = await axiosInstance.get(
//         Config.END_POINT_LIST["GET_ALL_BANNERS"] || "/api/v1/banners",
//         { withCredentials: true }
//       );
//       if (resBanner.data.success) {

//         setAllBanners(resBanner.data.banners || []);
//       }
//       // debugger
//       setMenu(res.data.data);
//       // setActiveCategory(res.data.data.categories?.[0]?._id);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("Bhai mere sun to", allBanners)

//   const addToCart = (item, variants = [], totalPrice) => {
//     setCart((prev) => [...prev, { item, variants, totalPrice }]);
//     // toast-like animation
//     const toast = document.createElement("div");
//     toast.className =
//       "fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl animate-bounce text-sm font-semibold";
//     toast.textContent = "✓ Added to Cart!";
//     document.body.appendChild(toast);
//     setTimeout(() => document.body.removeChild(toast), 1000);
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin border-4 border-green-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
//           <h2 className="text-xl font-semibold">Loading delicious food 😋</h2>
//           <p className="text-gray-500 mt-2">Preparing amazing dishes for you...</p>
//         </div>
//       </div>
//     );

//   if (!menu)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🍽️</div>
//           <h2 className="text-2xl font-bold">Menu not available</h2>
//           <p className="text-gray-500 mt-2 mb-4">
//             Sorry, we couldn't load the menu. Please try again.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );

//   const cartTotal = cart.reduce((s, c) => s + c.totalPrice, 0);

//   // const filteredItems = menu.items
//   //   .filter((i) => i.category === activeCategory)
//   //   .filter((i) => {
//   //     if (filter === "veg") return i.isVeg;
//   //     if (filter === "nonveg") return !i.isVeg;
//   //     return true;
//   //   })
//   //   .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));


//   const filteredItems = menu.items
//     .filter((i) =>
//       activeCategory === "all" ? true : i.category === activeCategory
//     )
//     .filter((i) => {
//       if (filter === "veg") return i.isVeg;
//       if (filter === "nonveg") return !i.isVeg;
//       return true;
//     })
//     .filter((i) =>
//       i.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );


//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: false,
//   };


//   return (
//     <>
//       <div className="mb-1 flex items-center gap-2 shadow-lg rounded-2xl p-2">
//         {/* Logo */}
//         <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow-md flex-shrink-0">
//           <img
//             src={`/assets/images/categories/${menu.categories[0]?.restaurant?.logo}`}
//             alt={menu.categories[0]?.restaurant?.name || "Restaurant"}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Name + Rating */}
//         <div className="flex flex-col justify-center">
//           <h4 className="text-2xl md:text-3xl " style={{ color: "#00103e" }}>
//             {menu.categories[0]?.restaurant?.name || "Restaurant"}
//           </h4>

//           <div className="flex items-center  gap-2">
//             <span className="bg-gray-400 text-shadow-blue-300  px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm" style={{ color: "#00103e" }}>
//               <i class="fa-solid fa-star text-amber-400" ></i> {menu.categories[0]?.restaurant?.rating || 4.4}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-2 md:p-6">

//         <div className="mb-6 rounded-xl overflow-visible">
//           <Slider {...sliderSettings}>
//             {(allBanners && allBanners.length > 0 ? allBanners : []).map((banner, i) => (
//               <div key={i} className="relative h-52 rounded-xl overflow-hidden">
//                 <img
//                   src={`/assets/images/banner/${banner.file}`}
//                   alt={banner.mainHead || banner.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/30"></div>
//                 <div className="absolute bottom-4 left-4 z-10 text-white">
//                   <h2 className="text-2xl font-bold">{banner.mainHead || banner.title}</h2>
//                   <p className="mt-1">{banner.subHead || banner.subtitle}</p>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>


//         {/* Search */}
//         <div className="mb-3 mt-2">
//           <div className="relative group">
//             <input
//               type="text"
//               placeholder="Search for dishes..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className=" w-full  rounded-full  border border-gray-300  bg-white  shadow-md  focus:border-green-500  focus:ring-2 focus:ring-green-200  transition  duration-300  ease-in-out  pl-4 pr-12 py-3  text-gray-700  placeholder-gray-400  outline-none"
//             />
//             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus:text-green-500 transition">
//               <i class="fa-solid fa-magnifying-glass"></i>
//             </span>
//           </div>
//         </div>



//         {/* Categories */}
//         <div className="mb-3 overflow-x-auto " style={{ textAlign: "center", margin: "auto" }} >
//           <div className="flex gap-3">
//             {menu.categories.map((cat) => (


//               <div className="customerMenucategory flex flex-col items-center gap-2">
//                 <div
//                   className={`relative rounded-full overflow-hidden cursor-pointer transform transition-all duration-300 
//       ${activeCategory === cat._id
//                       ? "border-2 border-green-500 shadow-lg"
//                       : "border border-gray-300 hover:border-green-500 hover:shadow-md"
//                     }`}
//                   onClick={() => setActiveCategory(cat._id)}
//                 >
//                   <div className="w-18 h-18 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
//                     <img
//                       src={`/assets/images/categories/${cat.image}`}
//                       alt={cat.name}
//                       className="w-18 h-18 rounded-full object-cover transition-transform duration-300"
//                     />
//                   </div>

//                 </div>
//                 <span
//                   className={`${activeCategory === cat._id
//                     ? "text-green-600"
//                     : "text-gray-900 hover:text-green-500"
//                     }`}
//                   style={{ fontSize: "10px", fontWeight: "600", textAlign: "center" }}
//                   onClick={() => setActiveCategory(cat._id)}
//                 >
//                   {cat.name}
//                 </span>
//               </div>


//             ))}
//           </div>
//         </div>

//         <div className="filter-wrapper">
//           {["all", "veg", "nonveg"].map((f) => {
//             const active = filter === f;

//             return (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`filter-btn ${active ? "active" : ""}`}
//               >
//                 {f === "all" && "All"}

//                 {f === "veg" && (
//                   <span className="filter-label">
//                     <span className="dot veg" />
//                     Veg
//                   </span>
//                 )}

//                 {f === "nonveg" && (
//                   <span className="filter-label">
//                     <span className="dot nonveg" />
//                     Non-Veg
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>


//         {/* Items Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
//           {filteredItems.map(item => {
//             const hasVariant = menu.variantGroups.some(vg => vg.menuItem === item._id);
//             const itemPrice = hasVariant ? `From ₹${item.basePrice}` : `₹${item.basePrice}`;

//             return (
//               <div
//                 key={item._id}
//                 className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
//               >
//                 {/* Image Section */}
//                 <div className="relative">
//                   <img
//                     src={
//                       item.image?.[0]
//                         ? `/assets/images/menu/${item.image[0]}`
//                         : `https://source.unsplash.com/600x400/?${item.name.replace(/\s+/g, "")}`
//                     }
//                     alt={item.name}
//                     className="w-full h-40 md:h-48 lg:h-52 xl:h-56 object-cover group-hover:scale-105 transition duration-300"
//                   />

//                   {/* Bestseller */}
//                   {item.isBestseller && (
//                     <span className="absolute top-3 left-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
//                       Bestseller
//                     </span>
//                   )}

//                   {/* Rating Badge */}
//                   <span className="absolute top-3 right-3 backdrop-blur px-2 py-1 rounded-full text-xs text-white shadow">
//                     <i class="fa-solid fa-star text-amber-400"></i> {item.rating || 4.5}
//                   </span>

//                   {/* Discount Badge */}
//                   {item.discount && (
//                     <span className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow">
//                       {item.discount}% OFF
//                     </span>
//                   )}

//                   {/* Add / Customize Button */}
//                   <button
//                     className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-green-700 transition"
//                     onClick={() =>
//                       hasVariant
//                         ? setSelectedItem(item)
//                         : addToCart(item, [], item.basePrice)
//                     }
//                   >
//                     {hasVariant ? "Customize" : "Add"}
//                   </button>
//                 </div>

//                 {/* Content Section */}
//                 <div className="p-2 space-y-1">
//                   <div className="flex justify-between items-center">
//                     <span
//                       className={`w-3 h-3 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"
//                         }`}
//                     ></span>
//                     <span className="font-semibold text-gray-800">{itemPrice}</span>
//                   </div>
//                   <p className="font-semibold text-gray-900 line-clamp-1">
//                     {item.name}
//                   </p>

//                   {/* Description */}
//                   {/* {item.description && (
//                     <p className="text-sm text-gray-500 line-clamp-2">
//                       {item.description}
//                     </p>
//                   )} */}
//                 </div>
//               </div>
//             );
//           })}
//         </div>



//         {/* Variant Drawer */}
//         {selectedItem && <VariantDrawer
//           open={!!selectedItem}
//           item={selectedItem}
//           menu={menu}
//           onClose={() => setSelectedItem(null)}
//           onAdd={addToCart}
//         />}

//         {/* Cart Floating Button */}

//         {cart.length > 0 && (
//           <div className="fixed bottom-2 right-3 bg-white rounded-full shadow-xl flex items-center overflow-hidden ViewCartPrice">
//             <div className="p-1 text-right px-3">
//               <div className=" ">{cart.length} items</div>
//               <div className="Price">₹{cartTotal}</div>
//             </div>
//             <button
//               className="bg-green-700 px-4 py-3 text-white font-semibold hover:bg-green-700 transition"
//               onClick={() => console.log("View Cart clicked")}
//             >
//               View Cart
//             </button>
//           </div>
//         )}

//       </div>

//     </>
//   );
// }



// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import axiosInstance from "../../apiHandler/axiosInstance";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import VariantDrawer from "../../Componants/Items/VariantModel";
// import Config from "../../Config/Config";
// import "./customerMenu.css";
// import useDebounce from "../../hooks/useDebounce";
// import SearchBar from "../../Componants/Items/SearchBar";
// import { Link } from "react-router-dom";
// import { showInfoMsg } from "../../utils/ShowMessages";
// import { useSelector, useDispatch } from "react-redux";
// import { closeVariantModal, openVariantModal } from "../../Store/feature/Items/menuModalSlice";
// import { addToCart } from "../../Store/feature/Items/cartSlice";
// import { setMenu, appendMenuItems } from "../../Store/feature/Items/menuSlice";
// import { setContext } from "../../Store/feature/context/contextSlice";

// export default function CustomerMenu() {
//   // const [menu, setMenu] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   // const [activeCategory, setActiveCategory] = useState('all');
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [cart, setCart] = useState(() => {
//     const storedCart = localStorage.getItem("cart");
//     return storedCart ? JSON.parse(storedCart) : [];
//   });
//   // const [filter, setFilter] = useState("all");
//   // const [searchQuery, setSearchQuery] = useState("");
//   const [allBanners, setAllBanners] = useState([]);
//   const [quantity, setQuantity] = useState(1);
//   // const [menu, setMenu] = useState(null);
//   // const [items, setItems] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const [activeCategory, setActiveCategory] = useState("all");
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const debouncedSearch = useDebounce(searchQuery, 400);

//   const params = new URLSearchParams(window.location.search);
//   const restaurant = params.get("restaurant");
//   const table = params.get("table");

//   const { isOpen, item } = useSelector(state => state.menuModal);
//   const { data: menu, items } = useSelector(state => state.menu);

//   const dispatch = useDispatch();



//   useEffect(() => {
//     setPage(1);
//     setHasMore(true);
//     dispatch(setContext({
//       restaurant,
//       table
//     }));

//     fetchMenu(true);
//   }, [debouncedSearch, activeCategory, filter]);


//   useEffect(() => {
//     const fetchBanner = async () => {
//       try {

//         const resBanner = await axiosInstance.get(
//           Config.END_POINT_LIST["GET_ALL_BANNERS"] || "/api/v1/banners",
//           { withCredentials: true }
//         );
//         if (resBanner.data.success) {

//           setAllBanners(resBanner.data.banners || []);
//         }

//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBanner()
//   }, [])



//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//         document.body.offsetHeight - 200 &&
//         hasMore &&
//         !loading
//       ) {
//         fetchMenu();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [hasMore, loading]);


//   // const fetchMenu = async () => {
//   //   try {
//   //     const res = await axiosInstance.get(
//   //       `/api/v1/menu?restaurant=${restaurant}&table=${table}`
//   //     );
//   //     const resBanner = await axiosInstance.get(
//   //       Config.END_POINT_LIST["GET_ALL_BANNERS"] || "/api/v1/banners",
//   //       { withCredentials: true }
//   //     );
//   //     if (resBanner.data.success) {

//   //       setAllBanners(resBanner.data.banners || []);
//   //     }
//   //     // debugger
//   //     setMenu(res.data.data);
//   //     // setActiveCategory(res.data.data.categories?.[0]?._id);
//   //   } catch (err) {
//   //     console.error(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const fetchMenu = async (reset = false) => {
//     if (loading) return;

//     try {
//       setLoading(true);
//       const currentPage = reset ? 1 : page;

//       const res = await axiosInstance.get("/api/v1/menu", {
//         params: {
//           restaurant,
//           table,
//           page: currentPage,
//           limit: 4,
//           search: debouncedSearch || undefined,
//           category: activeCategory !== "all" ? activeCategory : undefined,
//           type: filter !== "all" ? filter : undefined
//         }
//       });

//       if (reset) {
//         dispatch(setMenu(res.data.data));
//       } else {
//         dispatch(appendMenuItems(res.data.data.items));
//       }

//       setHasMore(res.data.pagination.hasMore);
//       setPage(currentPage + 1);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };



//   console.log("Bhai mere sun to", allBanners)

//   // const addToCart = (item, variants = [], totalPrice) => {
//   //   // debugger

//   //   setCart((prev) => {
//   //     const cartPayload = {
//   //       restaurant,
//   //       table,
//   //       items: [...prev, { item, variants, totalPrice,quantity }]
//   //     };

//   //     // 🔥 localStorage me full context save
//   //     localStorage.setItem("cart", JSON.stringify(cartPayload));

//   //     return cartPayload.items;
//   //   });

//   //   // toast
//   //   const toast = document.createElement("div");
//   //   toast.className =
//   //     "fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl animate-bounce text-sm font-semibold";
//   //   toast.textContent = "✓ Added to Cart!";
//   //   document.body.appendChild(toast);
//   //   setTimeout(() => document.body.removeChild(toast), 1000);
//   // };

//   const calculateCartItemTotal = (item, variants = []) => {
//     // ✅ variants exist
//     if (variants.length > 0) {
//       const totalQty = variants.reduce(
//         (sum, v) => sum + (v.quantity || 1),
//         0
//       );

//       const totalPrice = variants.reduce((sum, v) => {
//         const price = item.basePrice + (v.price || 0);
//         const qty = v.quantity || 1;
//         return sum + price * qty;
//       }, 0);

//       return { quantity: totalQty, totalPrice };
//     }

//     // ✅ no variants
//     const quantity = item.quantity || 1;
//     const totalPrice = item.basePrice * quantity;

//     return { quantity, totalPrice };
//   };

//   // const addToCart = (item, variants = []) => {
//   //   const { quantity, totalPrice } = calculateCartItemTotal(item, variants);

//   //   setCart(prev => {
//   //     const payload = {
//   //       restaurant,
//   //       table,
//   //       items: [
//   //         ...prev,
//   //         {
//   //           item,
//   //           variants,
//   //           quantity,
//   //           totalPrice
//   //         }
//   //       ]
//   //     };

//   //     localStorage.setItem("cart", JSON.stringify(payload));
//   //     return payload.items;
//   //   });
//   // };

//   const areVariantsSame = (v1 = [], v2 = []) => {
//     if (v1.length !== v2.length) return false;

//     const ids1 = v1.map(v => v._id).sort();
//     const ids2 = v2.map(v => v._id).sort();

//     return ids1.every((id, i) => id === ids2[i]);
//   };

//   const addToCart = (item, variants = []) => {
//     const { quantity, totalPrice } = calculateCartItemTotal(item, variants);

//     setCart(prev => {

//       // 🔥 CHECK: already exists?
//       const alreadyExists = prev.some(cartItem =>
//         cartItem.item._id === item._id &&
//         areVariantsSame(cartItem.variants, variants)
//       );

//       if (alreadyExists) {
//         showInfoMsg("Item already in cart");
//         return prev;
//       }

//       const payload = {
//         restaurant,
//         table,
//         items: [
//           ...prev,
//           {
//             item,
//             variants,
//             quantity,
//             totalPrice
//           }
//         ]
//       };

//       localStorage.setItem("cart", JSON.stringify(payload));
//       showInfoMsg("✅ Added to cart");
//       return payload.items;
//     });
//   };


//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");

//     if (storedCart) {
//       const parsed = JSON.parse(storedCart);

//       // safety check
//       if (
//         parsed.restaurant === restaurant &&
//         parsed.table === table
//       ) {
//         setCart(parsed.items || []);
//       } else {
//         // different table / restaurant → reset
//         localStorage.removeItem("cart");
//         setCart([]);
//       }
//     }
//   }, [restaurant, table]);


//   // if (loading)
//   //   return (
//   //     <div className="flex items-center justify-center h-screen">
//   //       <div className="text-center">
//   //         <div className="animate-spin border-4 border-green-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
//   //         <h2 className="text-xl font-semibold">Loading delicious food 😋</h2>
//   //         <p className="text-gray-500 mt-2">Preparing amazing dishes for you...</p>
//   //       </div>
//   //     </div>
//   //   );

//   if (!menu)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🍽️</div>
//           <h2 className="text-2xl font-bold">Menu not available</h2>
//           <p className="text-gray-500 mt-2 mb-4">
//             Sorry, we couldn't load the menu. Please try again.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );

//   const cartTotal = cart.reduce((s, c) => s + c.totalPrice, 0);

//   // const filteredItems = menu.items
//   //   .filter((i) => i.category === activeCategory)
//   //   .filter((i) => {
//   //     if (filter === "veg") return i.isVeg;
//   //     if (filter === "nonveg") return !i.isVeg;
//   //     return true;
//   //   })
//   //   .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));


//   const filteredItems = menu.items
//     .filter((i) =>
//       activeCategory === "all" ? true : i.category === activeCategory
//     )
//     .filter((i) => {
//       if (filter === "veg") return i.isVeg;
//       if (filter === "nonveg") return !i.isVeg;
//       return true;
//     })
//     .filter((i) =>
//       i.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );


//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: false,
//   };

//   console.log("jymghfhtf", items)

//   return (
//     <>
//       <div className="mb-1 flex items-center gap-2 shadow-lg rounded-2xl p-2">
//         {/* Logo */}
//         <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow-md flex-shrink-0">
//           <img
//             src={`/assets/images/categories/${menu.categories[0]?.restaurant?.logo}`}
//             alt={menu.categories[0]?.restaurant?.name || "Restaurant"}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Name + Rating */}
//         <div className="flex flex-col justify-center">
//           <h4 className="text-2xl md:text-3xl " style={{ color: "#00103e" }}>
//             {menu.categories[0]?.restaurant?.name || "Restaurant"}
//           </h4>

//           <div className="flex items-center  gap-2">
//             <span className="bg-gray-400 text-shadow-blue-300  px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm" style={{ color: "#00103e" }}>
//               <i class="fa-solid fa-star text-amber-400" ></i> {menu.categories[0]?.restaurant?.rating || 4.4}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-2 md:p-6">

//         <div className="mb-6 rounded-xl overflow-visible">
//           <Slider {...sliderSettings}>
//             {(allBanners && allBanners.length > 0 ? allBanners : []).map((banner, i) => (
//               <div key={i} className="relative h-52 rounded-xl overflow-hidden">
//                 <img
//                   src={`/assets/images/banner/${banner.file}`}
//                   alt={banner.mainHead || banner.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/30"></div>
//                 <div className="absolute bottom-4 left-4 z-10 text-white">
//                   <h2 className="text-2xl font-bold">{banner.mainHead || banner.title}</h2>
//                   <p className="mt-1">{banner.subHead || banner.subtitle}</p>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>


//         {/* Search */}
//         <div className="mb-3 mt-2">
//           <div className="relative group">
//             <SearchBar
//               value={searchQuery}
//               onChange={(val) => {
//                 setSearchQuery(val);
//                 setActiveCategory("all");
//                 setFilter("all");
//               }}
//             />


//             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//               <i className="fa-solid fa-magnifying-glass"></i>
//             </span>
//           </div>

//         </div>



//         {/* Categories */}
//         <div className="mb-3 overflow-x-auto " style={{ textAlign: "center", margin: "auto" }} >
//           <div className="flex gap-3">
//             {menu.categories.map((cat) => (


//               <div className="customerMenucategory flex flex-col items-center gap-2">
//                 <div
//                   className={`relative rounded-full overflow-hidden cursor-pointer transform transition-all duration-300 
//       ${activeCategory === cat._id
//                       ? "border-2 border-green-500 shadow-lg"
//                       : "border border-gray-300 hover:border-green-500 hover:shadow-md"
//                     }`}
//                   onClick={() => setActiveCategory(cat._id)}
//                 >
//                   <div className="w-18 h-18 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
//                     <img
//                       src={`/assets/images/categories/${cat.image}`}
//                       alt={cat.name}
//                       className="w-18 h-18 rounded-full object-cover transition-transform duration-300"
//                     />
//                   </div>

//                 </div>
//                 <span
//                   className={`${activeCategory === cat._id
//                     ? "text-green-600"
//                     : "text-gray-900 hover:text-green-500"
//                     }`}
//                   style={{ fontSize: "10px", fontWeight: "600", textAlign: "center" }}
//                   onClick={() => setActiveCategory(cat._id)}
//                 >
//                   {cat.name}
//                 </span>
//               </div>


//             ))}
//           </div>
//         </div>

//         <div className="filter-wrapper">
//           {["all", "veg", "nonveg"].map((f) => {
//             const active = filter === f;

//             return (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`filter-btn ${active ? "active" : ""}`}
//               >
//                 {f === "all" && "All"}

//                 {f === "veg" && (
//                   <span className="filter-label">
//                     <span className="dot veg" />
//                     Veg
//                   </span>
//                 )}

//                 {f === "nonveg" && (
//                   <span className="filter-label">
//                     <span className="dot nonveg" />
//                     Non-Veg
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>


//         {/* Items Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">

//           {!loading && items.length === 0 ? (
//             <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
//               <div className="text-6xl mb-4">😕</div>
//               <h3 className="text-xl font-semibold text-gray-700">
//                 No items found
//               </h3>
//               <p className="text-gray-500 mt-2">
//                 Try changing search or filters
//               </p>
//             </div>
//           ) : (
//             items.map(item => {
//               const hasVariant = menu.variantGroups.some(
//                 vg => vg.menuItem === item._id
//               );
//               const itemPrice = hasVariant
//                 ? `From ₹${item.basePrice}`
//                 : `₹${item.basePrice}`;

//               return (
//                 <div
//                   key={item._id}
//                   className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
//                 >
//                   {/* Image Section */}
//                   <div className="relative">
//                     <img
//                       src={
//                         item.image?.[0]
//                           ? `/assets/images/menu/${item.image[0]}`
//                           : `https://source.unsplash.com/600x400/?${item.name.replace(/\s+/g, "")}`
//                       }
//                       alt={item.name}
//                       className="w-full h-40 md:h-48 lg:h-52 xl:h-56 object-cover group-hover:scale-105 transition duration-300"
//                     />

//                     {item.isBestseller && (
//                       <span className="absolute top-3 left-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
//                         Bestseller
//                       </span>
//                     )}

//                     <span className="absolute top-3 right-3 backdrop-blur px-2 py-1 rounded-full text-xs text-white shadow">
//                       <i className="fa-solid fa-star text-amber-400"></i>{" "}
//                       {item.rating || 4.5}
//                     </span>

//                     {item.discount && (
//                       <span className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow">
//                         {item.discount}% OFF
//                       </span>
//                     )}

//                     <button
//                       className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-green-700 transition"
//                       onClick={() => {
//                         if (hasVariant) {
//                           dispatch(openVariantModal(item)); // modal open
//                         } else {
//                           dispatch(
//                             addToCart({
//                               item,
//                               variants: [],
//                               restaurant,
//                               table,
//                               showMsg: showInfoMsg
//                             })
//                           );
//                         }
//                       }}
//                     >
//                       {hasVariant ? "Customize" : "Add"}
//                     </button>

//                   </div>

//                   {/* Content */}
//                   <div className="p-2 space-y-1">
//                     <div className="flex justify-between items-center">
//                       <span
//                         className={`w-3 h-3 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"
//                           }`}
//                       ></span>
//                       <span className="font-semibold text-gray-800">
//                         {itemPrice}
//                       </span>
//                     </div>
//                     <p className="font-semibold text-gray-900 line-clamp-1">
//                       {item.name}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           )}

//         </div>



//         {/* Variant Drawer */}
//         {isOpen && selectedItem && (
//           <VariantDrawer
//             open={isOpen}
//             item={selectedItem}
//             onClose={() => dispatch(closeVariantModal())}
//           />
//         )}


//         {/* Cart Floating Button */}

//         {cart.length > 0 && (
//           <div className="fixed bottom-2 right-3 bg-white rounded-full shadow-xl flex items-center overflow-hidden ViewCartPrice">
//             <div className="p-1 text-right px-3">
//               <div className=" ">{cart.length} items</div>
//               <div className="Price">₹{cartTotal}</div>
//             </div>
//             <Link
//               className="bg-green-700 px-4 py-3 text-white font-semibold hover:bg-green-700 transition"
//               to="/cart"
//             >
//               View Cart
//             </Link>
//           </div>
//         )}

//       </div>

//     </>
//   );
// }




// Working Perfect  10-02-2026


// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import axiosInstance from "../../apiHandler/axiosInstance";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import VariantDrawer from "../../Componants/Items/VariantModel";
// import Config from "../../Config/Config";
// import "./customerMenu.css";
// import useDebounce from "../../hooks/useDebounce";
// import SearchBar from "../../Componants/Items/SearchBar";
// import { Link } from "react-router-dom";
// import { showInfoMsg } from "../../utils/ShowMessages";
// import { useSelector, useDispatch } from "react-redux";
// import { closeVariantModal, openVariantModal } from "../../Store/feature/Items/menuModalSlice";
// import { addToCart } from "../../Store/feature/Items/cartSlice";
// import { setMenu, appendMenuItems } from "../../Store/feature/Items/menuSlice";
// import { setContext } from "../../Store/feature/context/contextSlice";

// export default function CustomerMenu() {
//   const [allBanners, setAllBanners] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const [activeCategory, setActiveCategory] = useState("all");
//   const [filter, setFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const debouncedSearch = useDebounce(searchQuery, 400);

//   const params = new URLSearchParams(window.location.search);
//   const restaurant = params.get("restaurant");
//   const table = params.get("table");

//   const { isOpen, item } = useSelector(state => state.menuModal);
//   const { data: menu, items } = useSelector(state => state.menu);
//   const { items: cartItems } = useSelector(state => state.cart);

//   const dispatch = useDispatch();



//   useEffect(() => {
//     setPage(1);
//     setHasMore(true);
//     dispatch(setContext({
//       restaurant,
//       table
//     }));

//     fetchMenu(true);
//   }, [debouncedSearch, activeCategory, filter]);


//   useEffect(() => {
//     const fetchBanner = async () => {
//       try {

//         const resBanner = await axiosInstance.get(
//           Config.END_POINT_LIST["GET_ALL_BANNERS"] || "/api/v1/banners",
//           { withCredentials: true }
//         );
//         if (resBanner.data.success) {

//           setAllBanners(resBanner.data.banners || []);
//         }

//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBanner()
//   }, [])



//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//         document.body.offsetHeight - 200 &&
//         hasMore &&
//         !loading
//       ) {
//         fetchMenu();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [hasMore, loading]);


//   // const fetchMenu = async () => {
//   //   try {
//   //     const res = await axiosInstance.get(
//   //       `/api/v1/menu?restaurant=${restaurant}&table=${table}`
//   //     );
//   //     const resBanner = await axiosInstance.get(
//   //       Config.END_POINT_LIST["GET_ALL_BANNERS"] || "/api/v1/banners",
//   //       { withCredentials: true }
//   //     );
//   //     if (resBanner.data.success) {

//   //       setAllBanners(resBanner.data.banners || []);
//   //     }
//   //     // debugger
//   //     setMenu(res.data.data);
//   //     // setActiveCategory(res.data.data.categories?.[0]?._id);
//   //   } catch (err) {
//   //     console.error(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const fetchMenu = async (reset = false) => {
//     if (loading) return;

//     try {
//       setLoading(true);
//       const currentPage = reset ? 1 : page;

//       const res = await axiosInstance.get("/api/v1/menu", {
//         params: {
//           restaurant,
//           table,
//           page: currentPage,
//           limit: 4,
//           search: debouncedSearch || undefined,
//           category: activeCategory !== "all" ? activeCategory : undefined,
//           type: filter !== "all" ? filter : undefined
//         }
//       });

//       if (reset) {
//         dispatch(setMenu(res.data.data));
//       } else {
//         dispatch(appendMenuItems(res.data.data.items));
//       }

//       setHasMore(res.data.pagination.hasMore);
//       setPage(currentPage + 1);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };



//   console.log("Bhai mere sun to", allBanners)


//   // if (loading)
//   //   return (
//   //     <div className="flex items-center justify-center h-screen">
//   //       <div className="text-center">
//   //         <div className="animate-spin border-4 border-green-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
//   //         <h2 className="text-xl font-semibold">Loading delicious food 😋</h2>
//   //         <p className="text-gray-500 mt-2">Preparing amazing dishes for you...</p>
//   //       </div>
//   //     </div>
//   //   );

//   if (!menu)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🍽️</div>
//           <h2 className="text-2xl font-bold">Menu not available</h2>
//           <p className="text-gray-500 mt-2 mb-4">
//             Sorry, we couldn't load the menu. Please try again.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );

//   const cartTotal = cartItems.reduce((s, c) => s + c.totalPrice, 0);

//   // const filteredItems = menu.items
//   //   .filter((i) => i.category === activeCategory)
//   //   .filter((i) => {
//   //     if (filter === "veg") return i.isVeg;
//   //     if (filter === "nonveg") return !i.isVeg;
//   //     return true;
//   //   })
//   //   .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));


//   const filteredItems = menu.items
//     .filter((i) =>
//       activeCategory === "all" ? true : i.category === activeCategory
//     )
//     .filter((i) => {
//       if (filter === "veg") return i.isVeg;
//       if (filter === "nonveg") return !i.isVeg;
//       return true;
//     })
//     .filter((i) =>
//       i.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );


//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: false,
//   };

//   console.log("jymghfhtf", items)

//   return (
//     <>
//       <div className="mb-1 flex items-center gap-2 shadow-lg rounded-2xl p-2">
//         {/* Logo */}
//         <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow-md flex-shrink-0">
//           <img
//             src={`/assets/images/categories/${menu.categories[0]?.restaurant?.logo}`}
//             alt={menu.categories[0]?.restaurant?.name || "Restaurant"}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Name + Rating */}
//         <div className="flex flex-col justify-center">
//           <h4 className="text-2xl md:text-3xl " style={{ color: "#00103e" }}>
//             {menu.categories[0]?.restaurant?.name || "Restaurant"}
//           </h4>

//           <div className="flex items-center  gap-2">
//             <span className="bg-gray-400 text-shadow-blue-300  px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm" style={{ color: "#00103e" }}>
//               <i class="fa-solid fa-star text-amber-400" ></i> {menu.categories[0]?.restaurant?.rating || 4.4}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-2 md:p-6">

//         <div className="mb-6 rounded-xl overflow-visible">
//           <Slider {...sliderSettings}>
//             {(allBanners && allBanners.length > 0 ? allBanners : []).map((banner, i) => (
//               <div key={i} className="relative h-52 rounded-xl overflow-hidden">
//                 <img
//                   src={`/assets/images/banner/${banner.file}`}
//                   alt={banner.mainHead || banner.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/30"></div>
//                 <div className="absolute bottom-4 left-4 z-10 text-white">
//                   <h2 className="text-2xl font-bold">{banner.mainHead || banner.title}</h2>
//                   <p className="mt-1">{banner.subHead || banner.subtitle}</p>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>


//         {/* Search */}
//         <div className="mb-3 mt-2">
//           <div className="relative group">
//             <SearchBar
//               value={searchQuery}
//               onChange={(val) => {
//                 setSearchQuery(val);
//                 setActiveCategory("all");
//                 setFilter("all");
//               }}
//             />


//             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//               <i className="fa-solid fa-magnifying-glass"></i>
//             </span>
//           </div>

//         </div>



//         {/* Categories */}
//         <div className="mb-3 overflow-x-auto " style={{ textAlign: "center", margin: "auto" }} >
//           <div className="flex gap-3">
//             {menu.categories.map((cat) => (


//               <div className="customerMenucategory flex flex-col items-center gap-2">
//                 <div
//                   className={`relative rounded-full overflow-hidden cursor-pointer transform transition-all duration-300 
//       ${activeCategory === cat._id
//                       ? "border-2 border-green-500 shadow-lg"
//                       : "border border-gray-300 hover:border-green-500 hover:shadow-md"
//                     }`}
//                   onClick={() => setActiveCategory(cat._id)}
//                 >
//                   <div className="w-18 h-18 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
//                     <img
//                       src={`/assets/images/categories/${cat.image}`}
//                       alt={cat.name}
//                       className="w-18 h-18 rounded-full object-cover transition-transform duration-300"
//                     />
//                   </div>

//                 </div>
//                 <span
//                   className={`${activeCategory === cat._id
//                     ? "text-green-600"
//                     : "text-gray-900 hover:text-green-500"
//                     }`}
//                   style={{ fontSize: "10px", fontWeight: "600", textAlign: "center" }}
//                   onClick={() => setActiveCategory(cat._id)}
//                 >
//                   {cat.name}
//                 </span>
//               </div>


//             ))}
//           </div>
//         </div>

//         <div className="filter-wrapper">
//           {["all", "veg", "nonveg"].map((f) => {
//             const active = filter === f;

//             return (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`filter-btn ${active ? "active" : ""}`}
//               >
//                 {f === "all" && "All"}

//                 {f === "veg" && (
//                   <span className="filter-label">
//                     <span className="dot veg" />
//                     Veg
//                   </span>
//                 )}

//                 {f === "nonveg" && (
//                   <span className="filter-label">
//                     <span className="dot nonveg" />
//                     Non-Veg
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>


//         {/* Items Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">

//           {!loading && items.length === 0 ? (
//             <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
//               <div className="text-6xl mb-4">😕</div>
//               <h3 className="text-xl font-semibold text-gray-700">
//                 No items found
//               </h3>
//               <p className="text-gray-500 mt-2">
//                 Try changing search or filters
//               </p>
//             </div>
//           ) : (
//             items.map(item => {
//               const hasVariant = menu.variantGroups.some(
//                 vg => vg.menuItem === item._id
//               );
//               const itemPrice = hasVariant
//                 ? `From ₹${item.basePrice}`
//                 : `₹${item.basePrice}`;

//               return (
//                 <div
//                   key={item._id}
//                   className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
//                 >
//                   {/* Image Section */}
//                   <div className="relative">
//                     <img
//                       src={
//                         item.image?.[0]
//                           ? `/assets/images/menu/${item.image[0]}`
//                           : `https://source.unsplash.com/600x400/?${item.name.replace(/\s+/g, "")}`
//                       }
//                       alt={item.name}
//                       className="w-full h-40 md:h-48 lg:h-52 xl:h-56 object-cover group-hover:scale-105 transition duration-300"
//                     />

//                     {item.isBestseller && (
//                       <span className="absolute top-3 left-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
//                         Bestseller
//                       </span>
//                     )}

//                     <span className="absolute top-3 right-3 backdrop-blur px-2 py-1 rounded-full text-xs text-white shadow">
//                       <i className="fa-solid fa-star text-amber-400"></i>{" "}
//                       {item.rating || 4.5}
//                     </span>

//                     {item.discount && (
//                       <span className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow">
//                         {item.discount}% OFF
//                       </span>
//                     )}

//                     <button
//                       className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-green-700 transition"
//                       onClick={() => {
//                         if (hasVariant) {
//                           dispatch(openVariantModal(item)); // modal open
//                         } else {
//                           dispatch(
//                             addToCart({
//                               item,
//                               variants: [],
//                               restaurant,
//                               table,
//                               showMsg: showInfoMsg
//                             })
//                           );
//                         }
//                       }}
//                     >
//                       {hasVariant ? "Customize" : "Add"}
//                     </button>

//                   </div>

//                   {/* Content */}
//                   <div className="p-2 space-y-1">
//                     <div className="flex justify-between items-center">
//                       <span
//                         className={`w-3 h-3 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"
//                           }`}
//                       ></span>
//                       <span className="font-semibold text-gray-800">
//                         {itemPrice}
//                       </span>
//                     </div>
//                     <p className="font-semibold text-gray-900 line-clamp-1">
//                       {item.name}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           )}

//         </div>



//         {/* Variant Drawer */}
//         {isOpen && (
//           <VariantDrawer
//             open={isOpen}
//             item={item}
//             onClose={() => dispatch(closeVariantModal())}
//           />
//         )}


//         {/* Cart Floating Button */}

//         {cartItems.length > 0 && (
//           <div className="fixed bottom-2 right-3 bg-white rounded-full shadow-xl flex items-center overflow-hidden ViewCartPrice">
//             <div className="p-1 text-right px-3">
//               <div className=" ">{cartItems.length} items</div>
//               <div className="Price">₹{cartTotal}</div>
//             </div>
//             <Link
//               className="bg-green-700 px-4 py-3 text-white font-semibold hover:bg-green-700 transition"
//               to="/cart"
//             >
//               View Cart
//             </Link>
//           </div>
//         )}

//       </div>

//     </>
//   );
// }




import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axiosInstance from "../../apiHandler/axiosInstance";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VariantDrawer from "../../Componants/Items/VariantModel";
import Config from "../../Config/Config";
import useDebounce from "../../hooks/useDebounce";
import SearchBar from "../../Componants/Items/SearchBar";
import { Link } from "react-router-dom";
import { showInfoMsg } from "../../utils/ShowMessages";
import { useSelector, useDispatch } from "react-redux";
import { closeVariantModal, openVariantModal } from "../../Store/feature/Items/menuModalSlice";
import { addToCart } from "../../Store/feature/Items/cartSlice";
import { setMenu, appendMenuItems, clearMenu, appendVariantGroups, appendVariants } from "../../Store/feature/Items/menuSlice";
import { setContext } from "../../Store/feature/context/contextSlice";
import { useRef } from "react";
import "./customerMenu.css";

export default function CustomerMenu() {
  const [allBanners, setAllBanners] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [activeCategory, setActiveCategory] = useState("all");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 400);

  const params = new URLSearchParams(window.location.search);
  const restaurant = params.get("restaurant");
  const table = params.get("table");

  const { isOpen, item } = useSelector(state => state.menuModal);
  const { data, items, pagination } = useSelector(state => state.menu);
  const menu = data;
  const { items: cartItems } = useSelector(state => state.cart);

  const dispatch = useDispatch();

  const isFetchingRef = useRef(false);
  const pageRef = useRef(1);


  useEffect(() => {
    pageRef.current = 1;
    setHasMore(true);

    dispatch(setContext({ restaurant, table }));
    dispatch(clearMenu());

    fetchMenu(true);

  }, [debouncedSearch, activeCategory, filter]);




  useEffect(() => {
    const fetchBanner = async () => {
      try {

        const resBanner = await axiosInstance.get(
          Config.END_POINT_LIST["GET_ALL_BANNERS"] || "/api/v1/banners",
          { withCredentials: true }
        );
        if (resBanner.data.success) {

          setAllBanners(resBanner.data.banners || []);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner()
  }, [])



  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        fetchMenu();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);



  // const fetchMenu = async (reset = false) => {
  //   if (loading || isFetchingRef.current) return;

  //   try {
  //     isFetchingRef.current = true;
  //     setLoading(true);

  //     const currentPage = reset ? 1 : pageRef.current;

  //     const res = await axiosInstance.get("/api/v1/menu", {
  //       params: {
  //         restaurant,
  //         table,
  //         page: currentPage,
  //         limit: 4,
  //         search: debouncedSearch || undefined,
  //         category: activeCategory !== "all" ? activeCategory : undefined,
  //         type: filter !== "all" ? filter : undefined
  //       }
  //     });

  //     if (reset) {
  //       dispatch(setMenu(res.data));
  //       pageRef.current = 2;
  //     } else {
  //       dispatch(appendMenuItems(res.data.data.items));
  //       pageRef.current += 1;
  //     }

  //     setHasMore(res.data.pagination.hasMore);

  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //     isFetchingRef.current = false;
  //   }
  // };



  const fetchMenu = async (reset = false) => {
    if (loading || isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);

      const currentPage = reset ? 1 : pageRef.current;

      const res = await axiosInstance.get("/api/v1/menu", {
        params: {
          restaurant,
          table,
          page: currentPage,
          limit: 4,
          search: debouncedSearch || undefined,
          category: activeCategory !== "all" ? activeCategory : undefined,
          type: filter !== "all" ? filter : undefined
        }
      });

      const data = res.data.data;

      if (reset) {
        dispatch(setMenu(res.data));
        pageRef.current = 2;
      } else {
        dispatch(appendMenuItems(data.items));
        dispatch(appendVariantGroups(data.variantGroups));
        dispatch(appendVariants(data.variants));

        pageRef.current += 1;
      }

      setHasMore(res.data.pagination.hasMore);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };


  console.log("Bhai mere sun to", allBanners)


  if (!menu)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold">Menu not available</h2>
          <p className="text-gray-500 mt-2 mb-4">
            Sorry, we couldn't load the menu. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const cartTotal = cartItems.reduce((s, c) => s + c.totalPrice, 0);



  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  console.log("jymghfhtf", items)

  return (
    <>
      <div className="mb-1 flex items-center gap-2 shadow-lg rounded-2xl p-2">
        {/* Logo */}
        <div className="w-15 h-15 rounded-full overflow-hidden border-2 border-gray-200 shadow-md flex-shrink-0">
          <img
            src={`/assets/images/categories/${menu.categories[0]?.restaurant?.logo}`}
            alt={menu.categories[0]?.restaurant?.name || "Restaurant"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name + Rating */}
        <div className="flex flex-col justify-center">
          <h5 className="text-2xl md:text-3xl " style={{ color: "#00103e" }}>
            {menu.categories[0]?.restaurant?.name || "Restaurant"}
          </h5>

          <div className="flex items-center  gap-2">
            <span className="bg-gray-400 text-shadow-blue-300  px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm" style={{ color: "#00103e" }}>
              <i class="fa-solid fa-star text-amber-400" ></i> {menu.categories[0]?.restaurant?.rating || 4.4}
            </span>
          </div>
        </div>
        <div className="mx-auto" style={{ fontSize: "25px", right: "10px", justifyContent: "end" }}>
          <i class="fa-solid fa-cart-plus"></i>
        </div>

      </div>

      <div className="max-w-7xl mx-auto p-2 md:p-6">

        <div className="mb-6 rounded-xl overflow-visible">
          <Slider {...sliderSettings}>
            {(allBanners && allBanners.length > 0 ? allBanners : []).map((banner, i) => (
              <div key={i} className="relative h-52 rounded-xl overflow-hidden">
                <img
                  src={`/assets/images/banner/${banner.file}`}
                  alt={banner.mainHead || banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute bottom-4 left-4 z-10 text-white">
                  <h2 className="text-2xl font-bold">{banner.mainHead || banner.title}</h2>
                  <p className="mt-1">{banner.subHead || banner.subtitle}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>


        {/* Search */}
        <div className="mb-3 mt-2">
          <div className="relative group">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setActiveCategory("all");
                setFilter("all");
              }}
            />


            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>

        </div>



        {/* Categories */}
        <div className="mb-3 overflow-x-auto " style={{ textAlign: "center", margin: "auto" }} >
          <div className="flex gap-3">
            {menu?.categories?.map((cat) => (


              <div className="customerMenucategory flex flex-col items-center gap-2">
                <div
                  className={`relative rounded-full overflow-hidden cursor-pointer transform transition-all duration-300 
      ${activeCategory === cat._id
                      ? "border-2 border-green-500 shadow-lg"
                      : "border border-gray-300 hover:border-green-500 hover:shadow-md"
                    }`}
                  onClick={() => setActiveCategory(cat._id)}
                >
                  <div className="w-18 h-18 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                    <img
                      src={`/assets/images/categories/${cat.image}`}
                      alt={cat.name}
                      className="w-18 h-18 rounded-full object-cover transition-transform duration-300"
                    />
                  </div>

                </div>
                <span
                  className={`${activeCategory === cat._id
                    ? "text-green-600"
                    : "text-gray-900 hover:text-green-500"
                    }`}
                  style={{ fontSize: "10px", fontWeight: "600", textAlign: "center" }}
                  onClick={() => setActiveCategory(cat._id)}
                >
                  {cat.name}
                </span>
              </div>


            ))}
          </div>
        </div>

        <div className="filter-wrapper">
          {["all", "veg", "nonveg"].map((f) => {
            const active = filter === f;

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-btn ${active ? "active" : ""}`}
              >
                {f === "all" && "All"}

                {f === "veg" && (
                  <span className="filter-label">
                    <span className="dot veg" />
                    Veg
                  </span>
                )}

                {f === "nonveg" && (
                  <span className="filter-label">
                    <span className="dot nonveg" />
                    Non-Veg
                  </span>
                )}
              </button>
            );
          })}
        </div>


        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">

          {!loading && items.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-xl font-semibold text-gray-700">
                No items found
              </h3>
              <p className="text-gray-500 mt-2">
                Try changing search or filters
              </p>
            </div>
          ) : (
            items.map(item => {
              const hasVariant = menu.variantGroups.some(
                vg => vg.menuItem === item._id
              );
              const itemPrice = hasVariant
                ? `From ₹${item.basePrice}`
                : `₹${item.basePrice}`;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                >
                  {/* Image Section */}
                  <div className="relative">
                    <img
                      src={
                        item.image?.[0]
                          ? `/assets/images/menu/${item.image[0]}`
                          : `https://source.unsplash.com/600x400/?${item.name.replace(/\s+/g, "")}`
                      }
                      alt={item.name}
                      className="w-full h-40 md:h-48 lg:h-52 xl:h-56 object-cover group-hover:scale-105 transition duration-300"
                    />

                    {item.isBestseller && (
                      <span className="absolute top-3 left-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                        Bestseller
                      </span>
                    )}

                    <span className="absolute top-3 right-3 backdrop-blur px-2 py-1 rounded-full text-xs text-white shadow">
                      <i className="fa-solid fa-star text-amber-400"></i>{" "}
                      {item.rating || 4.5}
                    </span>

                    {item.discount && (
                      <span className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow">
                        {item.discount}% OFF
                      </span>
                    )}

                    <button
                      className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-green-700 transition"
                      onClick={() => {
                        if (hasVariant) {
                          dispatch(openVariantModal(item)); // modal open
                        } else {
                          dispatch(
                            addToCart({
                              item,
                              variants: [],
                              restaurant,
                              table,
                              showMsg: showInfoMsg
                            })
                          );
                        }
                      }}
                    >
                      {hasVariant ? "Customize" : "Add"}
                    </button>

                  </div>

                  {/* Content */}
                  <div className="p-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span
                        className={`w-3 h-3 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"
                          }`}
                      ></span>
                      <span className="font-semibold text-gray-800">
                        {itemPrice}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </p>
                  </div>
                </div>
              );
            })
          )}

        </div>



        {/* Variant Drawer */}
        {isOpen && (
          <VariantDrawer
            open={isOpen}
            item={item}
            onClose={() => dispatch(closeVariantModal())}
          />
        )}



        {cartItems.length > 0 && (
          <div className="fixed bottom-2 right-3 bg-white rounded-full shadow-xl flex items-center overflow-hidden ViewCartPrice">
            <div className="p-1 text-right px-3">
              <div className=" ">{cartItems.length} items</div>
              <div className="Price">₹{cartTotal}</div>
            </div>
            <Link
              className="bg-green-700 px-4 py-3 text-white font-semibold hover:bg-green-700 transition"
              to="/cart"
            >
              View Cart
            </Link>
          </div>
        )}

      </div>

    </>
  );
}
