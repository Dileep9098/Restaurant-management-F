import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLoyout from './Pages/Admin/Layout/Loyout'
import Dashboard from './Pages/Admin/Dashboard/Dashboard'
import ThemeSetting from './Componants/Admin/Loyout/ThemeSetting'
import Page404 from './Pages/Error-404/Page404'
import Login from './Pages/User/Login/Login'
import { Toaster } from 'sonner'
import ProtectedRoute from './Componants/ProtectedRoute/ProtectedRoute'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe } from './Store/feature/Auth/authslice'
import PermissionManage from './Componants/Admin/UserManagement/PermissionManage'
import RoleManagement from './Componants/Admin/UserManagement/RoleManagement'
import CreateUser from './Componants/Admin/UserManagement/CreateUser'
import { fetchSidebar } from './Store/feature/sidebar/sidebarSlice'
import Restaurent from './Pages/SuperAdmin/Restaurent/Restaurent'
import CreateRestaurentUser from './Pages/SuperAdmin/RestaurentUser/CreateRestaurentUser'
import CreateRole from './Pages/Admin/Usermanagement/createRole'
import CreateCategory from './Pages/Admin/Category/CreateCategory'
import Item from './Pages/Admin/MenuItem/Item'
import Tax from './Pages/Admin/Tax/Tax'
import VariantsDetails from './Pages/Admin/MenuManagement/VariantsDetails'
import AddOnDetails from './Pages/Admin/MenuManagement/AddOnDetails'
import TableManagement from './Pages/Admin/MenuManagement/TableManagement'
import CustomerMenu from './Pages/Customer/CustomerMenu'
import Banner from './Pages/Admin/Banner/Banner'
import VariantDrawer from "./Componants/Items/VariantModel";
import { closeVariantModal } from "./Store/feature/Items/menuModalSlice";
import { addToCart } from './Store/feature/Items/cartSlice'
import Cart from './Pages/Customer/Cart'
import CustomerOrderHistory from './Pages/Customer/CustomerOrderHistory'
import InvoiceFormateTemplate from './Pages/Admin/InvoiceFormateTemplate/InvoiceFormateTemplate'
import KitchenDisplay from './Pages/Admin/KOT(kitchen_display)/KitchenDisplay'
export default function Routing() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { isOpen, item } = useSelector(
    (state) => state.menuModal
  );
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMe());
      dispatch(fetchSidebar());
    }
  }, [isAuthenticated, dispatch]);


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path='/dashboard' element={<Dashboard />} /> */}

          {/* <Route
            path="/"
            element={
              <ProtectedRoute >
                <AdminLoyout />
              </ProtectedRoute>
            }
          > */}
          <Route
            path="/"
            element={

              <ProtectedRoute >

                <AdminLoyout />
              </ProtectedRoute>
            }
          >
            <Route path='dashboard' element={<Dashboard />} />
            <Route path="permission" element={<PermissionManage />} />
            <Route path="role" element={<RoleManagement />} />
            <Route path="user" element={<CreateUser />} />
            <Route path="create-role" element={<CreateRole />} />
            <Route path="categories" element={<CreateCategory />} />
            <Route path="categories" element={<CreateCategory />} />
            <Route path="items" element={<Item />} />
            <Route path="restaurants" element={<Restaurent />} />
            <Route path="restaurant-admin" element={<CreateRestaurentUser />} />
            <Route path="tax_GST" element={<Tax />} />
            <Route path="variants" element={<VariantsDetails />} />
            <Route path="add-ons_modifiers" element={<AddOnDetails />} />
            <Route path="tables" element={<TableManagement />} />
            <Route path="banner" element={<Banner />} />
            <Route path="bill_formate" element={<InvoiceFormateTemplate />} />
            <Route path="live_orders" element={<KitchenDisplay />} />
            {/* <Route path="/users" element={<ProtectedRoute permission="users.view"><Creace/></ProtectedRoute>} /> */}
            {/* <Route path="/roles" element={<ProtectedRoute permission="roles.view"><Roles /></ProtectedRoute>} /> */}
          </Route>
          <Route path="*" element={<Page404 />} />

          <Route path="/menu" element={<CustomerMenu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/customer-order-history" element={<CustomerOrderHistory />} />

        </Routes>
      </BrowserRouter>
      {isAuthenticated &&
        <ThemeSetting />
      }

      {isOpen && item && (
        <VariantDrawer
          open={isOpen}
          item={item}
          onClose={() => dispatch(closeVariantModal())}
          onAdd={addToCart}
        />
      )}

      <Toaster position='top-center' richColors />

    </>
  )
}
