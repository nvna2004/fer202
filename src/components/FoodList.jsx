import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllCategories, getAllFoods } from '../config/api';
import { useCart } from '../context/CartContext';

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const { addToCart } = useCart();

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, foodRes] = await Promise.all([
          getAllCategories(),
          getAllFoods()
        ]);
        setCategories(catRes.data);
        setFoods(foodRes.data);
      } catch (err) {
        console.error("Lỗi khi tải thực đơn:", err);
        setError("Không thể tải danh sách món ăn từ máy chủ.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = (food) => {
    addToCart(food, 1);
    alert(`Đã thêm "${food.name}" vào giỏ hàng!`);
  };

  // Filter logic
  let filtered = foods.filter((food) => {
    // Category
    if (selectedCategory && food.categoryId !== selectedCategory) {
      return false;
    }
    // Search
    if (searchTerm.trim() !== '') {
      const matchName = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDesc = food.description?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchName && !matchDesc) return false;
    }
    // Price
    if (priceFilter === 'under50') {
      if (food.price >= 50000) return false;
    } else if (priceFilter === '50to100') {
      if (food.price < 50000 || food.price > 100000) return false;
    } else if (priceFilter === 'over100') {
      if (food.price <= 100000) return false;
    }
    return true;
  });

  // Sort logic
  if (sortBy === 'priceAsc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceDesc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'nameAsc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Đang tải thực đơn FastFood...</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="fw-bold mb-4 border-start border-4 border-warning ps-2">
        🍽️ Thực Đơn Món Ăn
      </h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filter and Search Bar */}
      <Card className="mb-4 shadow-sm border-0 bg-light">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label className="small fw-bold">Tìm kiếm món ăn</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên món ăn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                    ✕
                  </Button>
                )}
              </InputGroup>
            </Col>

            <Col md={3}>
              <Form.Label className="small fw-bold">Lọc theo danh mục</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Label className="small fw-bold">Mức giá</Form.Label>
              <Form.Select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">Tất cả mức giá</option>
                <option value="under50">Dưới 50.000đ</option>
                <option value="50to100">50.000đ - 100.000đ</option>
                <option value="over100">Trên 100.000đ</option>
              </Form.Select>
            </Col>

            <Col md={2}>
              <Form.Label className="small fw-bold">Sắp xếp</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Mặc định</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
                <option value="nameAsc">Tên (A - Z)</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Categories quick filter pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedCategory === '' ? 'warning' : 'outline-secondary'}
          size="sm"
          className="rounded-pill px-3"
          onClick={() => handleCategoryChange('')}
        >
          Tất cả ({foods.length})
        </Button>
        {categories.map((cat) => {
          const count = foods.filter(f => f.categoryId === cat.id).length;
          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'warning' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name} ({count})
            </Button>
          );
        })}
      </div>

      {/* Foods Grid */}
      {filtered.length === 0 ? (
        <Alert variant="info" className="text-center py-4">
          Không tìm thấy món ăn nào phù hợp với bộ lọc hiện tại.
        </Alert>
      ) : (
        <Row className="g-4">
          {filtered.map((food) => (
            <Col key={food.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm border-0 d-flex flex-column">
                <div className="position-relative overflow-hidden" style={{ height: '180px' }}>
                  <Card.Img
                    variant="top"
                    src={food.image}
                    alt={food.name}
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                  {food.isFeatured && (
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                      Hot
                    </Badge>
                  )}
                  {!food.isAvailable && (
                    <div className="position-absolute w-100 h-100 top-0 start-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center text-white fw-bold">
                      Hết hàng
                    </div>
                  )}
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6 fw-bold mb-1 text-truncate">
                    <Link to={`/foods/${food.id}`} className="text-dark text-decoration-none">
                      {food.name}
                    </Link>
                  </Card.Title>
                  <Card.Text className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {food.description}
                  </Card.Text>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold fs-5 text-danger">
                      {food.price ? food.price.toLocaleString('vi-VN') : 0}đ
                    </span>
                    <small className="text-muted">Còn: {food.quantity || 0}</small>
                  </div>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="warning" 
                      className="fw-bold"
                      disabled={!food.isAvailable || food.quantity <= 0}
                      onClick={() => handleAddToCart(food)}
                    >
                      {food.isAvailable && food.quantity > 0 ? "🛒 Thêm Giỏ Hàng" : "Tạm hết"}
                    </Button>
                    <Link to={`/foods/${food.id}`} className="btn btn-outline-secondary btn-sm">
                      Xem chi tiết
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default FoodList;

