import { useState, useEffect } from "react";
import { getFoods, getCategories } from "../config/api";
import { Badge, Button, Card, Col, Form, Modal, Row } from "react-bootstrap";

function Home() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [cart, setCart] = useState({});
    const [selectedFood, setSelectedFood] = useState(null);
    const [showCart, setShowCart] = useState(false);

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
        .filter((food) => (food.name ?? "").toLowerCase().includes(searchTerm.trim().toLowerCase()))
        .sort((firstFood, secondFood) => {
            if (sortOption === "") return 0;
            if (sortOption === "category-a-z" || sortOption === "category-z-a") {
                const firstCategory = categories.find((category) => category.id === firstFood.categoryId)?.name ?? "Unknown";
                const secondCategory = categories.find((category) => category.id === secondFood.categoryId)?.name ?? "Unknown";
                const categoryOrder = firstCategory.localeCompare(secondCategory);
                return sortOption === "category-a-z" ? categoryOrder : -categoryOrder;
            }

            const firstPrice = Number(firstFood.price);
            const secondPrice = Number(secondFood.price);
            if (!Number.isFinite(firstPrice)) return 1;
            if (!Number.isFinite(secondPrice)) return -1;
            return sortOption === "low-to-high" ? firstPrice - secondPrice : secondPrice - firstPrice;
        });

    const cartItems = foods.filter((food) => cart[food.id] > 0);
    const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    const cartTotal = cartItems.reduce((total, food) => total + Number(food.price) * cart[food.id], 0);

    const addToCart = (food) => {
        setCart((currentCart) => ({
            ...currentCart,
            [food.id]: (currentCart[food.id] ?? 0) + 1,
        }));
    };

    const changeCartQuantity = (foodId, amount) => {
        setCart((currentCart) => {
            const nextQuantity = (currentCart[foodId] ?? 0) + amount;
            if (nextQuantity <= 0) {
                const { [foodId]: removedFood, ...remainingCart } = currentCart;
                return remainingCart;
            }
            return { ...currentCart, [foodId]: nextQuantity };
        });
    };

  return (
            <div className="d-flex flex-column min-vh-100">
                <header className="d-flex flex-wrap align-items-center justify-content-between gap-3 bg-dark text-white px-3 px-md-4 py-3 rounded-bottom">
                    <a href="#top" className="text-decoration-none text-white fw-bold fs-4" aria-label="FastFood - trang chủ">
                        FAST<span className="text-warning">FOOD</span>
                    </a>
                    <nav className="d-flex align-items-center gap-3" aria-label="Điều hướng chính">
                        <a href="#menu" className="text-decoration-none text-white">Thực đơn</a>
                        <a href="#contact" className="text-decoration-none text-white">Liên hệ</a>
                        <Button variant="outline-light" onClick={() => setShowCart(true)} aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}>
                            Giỏ hàng <Badge bg="warning" text="dark">{cartCount}</Badge>
                        </Button>
                    </nav>
                </header>

                <main className="flex-grow-1">
                <div id="top" className="d-flex align-items-center justify-content-between mt-4 mb-4">
                <div>
                    <h1 className="h2 mb-1">FastFood</h1>
                    <p className="text-muted mb-0">Chọn món ngon cho bữa ăn của bạn</p>
                </div>
            </div>

                <div id="menu" className="d-flex flex-column flex-md-row gap-2 mb-4">
                <Form.Control
                    type="search"
                    placeholder="Tìm món ăn"
                    aria-label="Tìm món ăn"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <Form.Select
                    aria-label="Sắp xếp sản phẩm"
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                >
                    <option value="">Thứ tự mặc định</option>
                    <option value="low-to-high">Giá: thấp đến cao</option>
                    <option value="high-to-low">Giá: cao đến thấp</option>
                    <option value="category-a-z">Danh mục: A đến Z</option>
                    <option value="category-z-a">Danh mục: Z đến A</option>
                </Form.Select>
            </div>

            <Row className="g-4 mb-5">
                {visibleFoods.map((food) => (
                    <Col key={food.id} xs={12} sm={6} lg={4} xl={3}>
                        <Card className="h-100 shadow-sm">
                            {food.image ? (
                                <Card.Img
                                    variant="top"
                                    src={food.image}
                                    alt={food.name}
                                    style={{ height: 190, objectFit: "cover" }}
                                />
                            ) : (
                                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 190 }}>
                                    Không có hình ảnh
                                </div>
                            )}
                            <Card.Body className="d-flex flex-column">
                                <div className="small text-muted mb-2">
                                    {categories.find((category) => category.id === food.categoryId)?.name ?? "Chưa phân loại"}
                                </div>
                                <Card.Title>{food.name}</Card.Title>
                                <Card.Text className="text-muted flex-grow-1">{food.description}</Card.Text>
                                <div className="fw-bold fs-5 mb-3">
                                    {Number.isFinite(Number(food.price)) ? Number(food.price).toLocaleString("vi-VN") : "Liên hệ"} đ
                                </div>
                                <div className="d-flex gap-2">
                                    <Button variant="outline-dark" className="flex-grow-1" onClick={() => setSelectedFood(food)}>
                                        Xem chi tiết
                                    </Button>
                                    <Button variant="danger" className="flex-grow-1" onClick={() => addToCart(food)}>
                                        Thêm vào giỏ
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                {visibleFoods.length === 0 && (
                    <Col><p className="text-center text-muted py-5">Không tìm thấy sản phẩm phù hợp.</p></Col>
                )}
            </Row>

            <Modal show={Boolean(selectedFood)} onHide={() => setSelectedFood(null)} centered>
                {selectedFood && (
                    <>
                        {selectedFood.image && <Modal.Header className="p-0 border-0">
                            <img src={selectedFood.image} alt={selectedFood.name} className="w-100 rounded-top" style={{ height: 240, objectFit: "cover" }} />
                        </Modal.Header>}
                        <Modal.Body>
                            <div className="small text-muted mb-2">
                                {categories.find((category) => category.id === selectedFood.categoryId)?.name ?? "Chưa phân loại"}
                            </div>
                            <h2 className="h4">{selectedFood.name}</h2>
                            <p>{selectedFood.description}</p>
                            <div className="fw-bold fs-5">
                                {Number.isFinite(Number(selectedFood.price)) ? Number(selectedFood.price).toLocaleString("vi-VN") : "Liên hệ"} đ
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={() => setSelectedFood(null)}>Đóng</Button>
                            <Button variant="danger" onClick={() => addToCart(selectedFood)}>Thêm vào giỏ</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>

            <Modal show={showCart} onHide={() => setShowCart(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Giỏ hàng ({cartCount})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cartItems.length === 0 ? (
                        <p className="text-muted mb-0">Giỏ hàng chưa có sản phẩm.</p>
                    ) : (
                        <>
                            {cartItems.map((food) => (
                                <div key={food.id} className="d-flex align-items-center justify-content-between gap-3 py-3 border-bottom">
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">{food.name}</div>
                                        <div className="small text-muted">{Number(food.price).toLocaleString("vi-VN")} đ / món</div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button size="sm" variant="outline-secondary" onClick={() => changeCartQuantity(food.id, -1)} aria-label={`Giảm số lượng ${food.name}`}>-</Button>
                                        <span>{cart[food.id]}</span>
                                        <Button size="sm" variant="outline-secondary" onClick={() => changeCartQuantity(food.id, 1)} aria-label={`Tăng số lượng ${food.name}`}>+</Button>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between fw-bold mt-3">
                                <span>Tổng cộng</span>
                                <span>{cartTotal.toLocaleString("vi-VN")} đ</span>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCart(false)}>Tiếp tục chọn món</Button>
                </Modal.Footer>
            </Modal>

            </main>

            <footer id="contact" className="mt-4 border-top bg-light px-3 px-md-4 py-4">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                    <div>
                        <div className="fw-bold">FASTFOOD</div>
                        <div className="small text-muted">Món ngon mỗi ngày, giao tận nơi.</div>
                    </div>
                    <div className="small text-md-end">
                        <div className="fw-semibold">Liên hệ đặt món</div>
                        <a className="text-decoration-none text-dark" href="tel:19001234">1900 1234</a>
                    </div>
                </div>
                <div className="small text-muted mt-3">© {new Date().getFullYear()} FastFood</div>
            </footer>
        </div>
    );
}

export default Home