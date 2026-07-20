import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import RoleRoute from './components/RoleRoute';
import Home from './pages/Home';
import Search from './pages/Search';
import ProductDetail from './pages/ProductDetail';
import ShopProfile from './pages/ShopProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderResult from './pages/OrderResult';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SellerShop from './pages/seller/SellerShop';
import SellerProducts from './pages/seller/SellerProducts';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerOrders from './pages/seller/SellerOrders';
import AdminShops from './pages/admin/AdminShops';
import AdminOrders from './pages/admin/AdminOrders';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/category/:categoryId" element={<Search />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/shop/:id" element={<ShopProfile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/order-result" element={<OrderResult />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route
                path="/seller"
                element={
                  <RoleRoute allow="Seller">
                    <SellerShop />
                  </RoleRoute>
                }
              />
              <Route
                path="/seller/products"
                element={
                  <RoleRoute allow="Seller">
                    <SellerProducts />
                  </RoleRoute>
                }
              />
              <Route
                path="/seller/products/new"
                element={
                  <RoleRoute allow="Seller">
                    <SellerProductForm />
                  </RoleRoute>
                }
              />
              <Route
                path="/seller/products/:id/edit"
                element={
                  <RoleRoute allow="Seller">
                    <SellerProductForm />
                  </RoleRoute>
                }
              />
              <Route
                path="/seller/orders"
                element={
                  <RoleRoute allow="Seller">
                    <SellerOrders />
                  </RoleRoute>
                }
              />

              <Route
                path="/admin/shops"
                element={
                  <RoleRoute allow="Admin">
                    <AdminShops />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <RoleRoute allow="Admin">
                    <AdminOrders />
                  </RoleRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
