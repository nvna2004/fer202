import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import FoodList from "./components/FoodList";
import FoodDetail from "./components/FoodDetail";
import Cart from "./components/Cart";
import Orders from "./components/Orders";

import ListCategory from "./components/Admin/ListCategory";
import AddCategory from "./components/Admin/AddCategory";
import EditCategory from "./components/Admin/EditCategory";

import ListFood from "./components/Admin/ListFood";
import AddFood from "./components/Admin/AddFood";
import EditFood from "./components/Admin/EditFood";
import ListOrders from "./components/Admin/ListOrders";

import { CartProvider } from "./context/CartContext";

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <div className="d-flex flex-column min-vh-100">
                    <Header />
                    <Container className="flex-grow-1 mb-5">
                        <Routes>
                            {/* Khách hàng */}
                            <Route path="/" element={<Home />} />
                            <Route path="/foods" element={<FoodList />} />
                            <Route path="/foods/:id" element={<FoodDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/orders" element={<Orders />} />

                            {/* Quản trị danh mục */}
                            <Route path="/admin/categories" element={<ListCategory />} />
                            <Route path="/admin/categories/add" element={<AddCategory />} />
                            <Route path="/admin/categories/edit/:id" element={<EditCategory />} />

                            {/* Quản trị món ăn */}
                            <Route path="/admin/foods" element={<ListFood />} />
                            <Route path="/admin/foods/add" element={<AddFood />} />
                            <Route path="/admin/foods/edit/:id" element={<EditFood />} />

                            {/* Quản trị đơn hàng */}
                            <Route path="/admin/orders" element={<ListOrders />} />
                        </Routes>
                    </Container>
                    <Footer />
                </div>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;
