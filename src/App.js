import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import FoodList from "./components/FoodList";
import FoodDetail from "./components/FoodDetail";
import Cart from "./components/Cart";
import Orders from "./components/Orders";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import Dashboard from "./components/Admin/Dashboard";
import ListCategory from "./components/Admin/ListCategory";
import AddCategory from "./components/Admin/AddCategory";
import EditCategory from "./components/Admin/EditCategory";

import ListFood from "./components/Admin/ListFood";
import AddFood from "./components/Admin/AddFood";
import EditFood from "./components/Admin/EditFood";
import ListOrders from "./components/Admin/ListOrders";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <div className="d-flex flex-column min-vh-100">
                        <Header />
                        <Container className="flex-grow-1 mb-5">
                            <Routes>
                                {/* Khách hàng & Người dùng */}
                                <Route path="/" element={<Home />} />
                                <Route path="/foods" element={<FoodList />} />
                                <Route path="/foods/:id" element={<FoodDetail />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/orders" element={<Orders />} />

                                {/* Xác thực tài khoản */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Khu vực Quản trị Admin (Có bảo vệ quyền) */}
                                <Route path="/admin" element={
                                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                                } />
                                <Route path="/admin/dashboard" element={
                                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                                } />
                                <Route path="/admin/categories" element={
                                    <ProtectedRoute><ListCategory /></ProtectedRoute>
                                } />
                                <Route path="/admin/categories/add" element={
                                    <ProtectedRoute><AddCategory /></ProtectedRoute>
                                } />
                                <Route path="/admin/categories/edit/:id" element={
                                    <ProtectedRoute><EditCategory /></ProtectedRoute>
                                } />

                                <Route path="/admin/foods" element={
                                    <ProtectedRoute><ListFood /></ProtectedRoute>
                                } />
                                <Route path="/admin/foods/add" element={
                                    <ProtectedRoute><AddFood /></ProtectedRoute>
                                } />
                                <Route path="/admin/foods/edit/:id" element={
                                    <ProtectedRoute><EditFood /></ProtectedRoute>
                                } />

                                <Route path="/admin/orders" element={
                                    <ProtectedRoute><ListOrders /></ProtectedRoute>
                                } />
                            </Routes>
                        </Container>
                        <Footer />
                    </div>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
