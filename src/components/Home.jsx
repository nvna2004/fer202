import { useState, useEffect } from "react";
import { getFoods, getCategories } from "../config/api";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceSort, setPriceSort] = useState("");

  const loadData = async () => {
        const resFoods = await getFoods();
        setFoods(resFoods.data);
        const resCategories = await getCategories();
        setCategories(resCategories.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const visibleFoods = foods
        .filter((food) => {
            return (food.name ?? "").toLowerCase().includes(searchTerm.trim().toLowerCase());
        })
        .sort((firstFood, secondFood) => {
            if (priceSort === "") return 0;
            const firstPrice = Number(firstFood.price);
            const secondPrice = Number(secondFood.price);
            if (!Number.isFinite(firstPrice)) return 1;
            if (!Number.isFinite(secondPrice)) return -1;
            return priceSort === "low-to-high" ? firstPrice - secondPrice : secondPrice - firstPrice;
        });



  return (
     <>
            <h2 className="mt-4">FastFood</h2>
            
                {/* <Col className="text-md-end">
                    <Link to="/add">
                        <Button variant="success">
                            Add New Food
                        </Button>
                    </Link>
                </Col> */}
            

            <div className="d-flex gap-2 mb-3">
                <Form.Control
                    type="search"
                    placeholder="Search by food name"
                    aria-label="Search by food name"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <Form.Select
                    aria-label="Sort by price"
                    value={priceSort}
                    onChange={(event) => setPriceSort(event.target.value)}
                >
                    <option value="">Default order</option>
                    <option value="low-to-high">Price: low to high</option>
                    <option value="high-to-low">Price: high to low</option>
                </Form.Select>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Food</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleFoods.map((food) => (
                        <tr key={food.id}>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    {food.image ? (
                                        <img
                                            src={food.image}
                                            alt={food.name}
                                            style={{ width: 80, height: 60, objectFit: "cover" }}
                                        />
                                    ) : <span>No image</span>}
                                    <span>{food.name}</span>
                                </div>
                            </td>
                            <td>{food.description}</td>
                            <td>{food.price !== undefined && food.price !== null && Number.isFinite(Number(food.price))
                                ? Number(food.price)
                                : "N/A"} VND</td>
                            <td>{categories.find((category) => category.id === food.categoryId)?.name ?? "Unknown"}</td>
                            <td>{food.status}</td>
                            <td>
                                <Link className="me-2" to={`/foods/${food.id}`}>
                                    <Button variant="primary">Show Details</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default Home