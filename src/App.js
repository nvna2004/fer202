import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

import Home from "./components/Home";



function App() {
    return (
        <div>
            <Container>
            <BrowserRouter>
                <Routes>
                      <Route path="/" element={<Home/>}/>


                </Routes>
            </BrowserRouter></Container>
        </div>
    )
}

export default App;