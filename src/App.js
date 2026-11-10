import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

import Home from "./components/Home";
import { CartProvider } from "./context/CartContext";



function App() {
    return (
        <div>
            <Container>
                <CartProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />


                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </Container>
        </div>
    )
}

export default App;