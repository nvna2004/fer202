import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Home from "./components/Home";
import ListCategory from "./components/Admin/ListCategory";
import AddCategory from "./components/Admin/AddCategory";
import EditCategory from "./components/Admin/EditCategory";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Container>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin/categories" element={<ListCategory />} />
                    <Route path="/admin/categories/add" element={<AddCategory />} />
                    <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
}




export default App;