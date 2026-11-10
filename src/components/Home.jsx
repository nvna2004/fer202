import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllCategories, getAllFoods, getAllReviews } from '../config/api';
import { useCart } from '../context/CartContext';

function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, foodRes, revRes] = await Promise.all([
          getAllCategories(),
          getAllFoods(),
          getAllReviews()
        ]);
        setCategories(catRes.data);
        const featured = foodRes.data.filter(item => item.isFeatured);
        setFeaturedFoods(featured.length > 0 ? featured : foodRes.data.slice(0, 6));
        setReviews(revRes.data ? revRes.data.slice(0, 4) : []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        setError("Không thể kết nối đến máy chủ. Hãy đảm bảo JSON Server đang chạy tại port 9999.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food, 1);
    alert(`Đã thêm "${food.name}" vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="warning" role="status" />
        <p className="mt-3 text-muted">Đang tải dữ liệu thực đơn FastFood...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Hero Banner Section */}
      <div 
        className="p-5 mb-5 rounded-4 text-white text-center shadow-lg position-relative overflow-hidden" 
        style={{ 
          background: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)',
          boxShadow: '0 10px 30px rgba(221, 36, 118, 0.3)'
        }}
      >
        <div className="py-4 position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-4 fw-bolder mb-3">🍔 Hương Vị Đồ Ăn Nhanh Đỉnh Cao</h1>
          <p className="lead fs-5 mb-4 max-w-75 mx-auto" style={{ maxWidth: '650px' }}>
            Thưởng thức burger hảo hạng, pizza thơm lừng, gà rán giòn rụm và đồ uống mát lạnh. 
            Giao siêu tốc chỉ từ 25 phút!
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/foods" className="btn btn-warning btn-lg fw-bold px-4 shadow">
              Khám Phá Thực Đơn
            </Link>
            <a href="#featured" className="btn btn-outline-light btn-lg fw-bold px-4">
              Món Ăn Nổi Bật
            </a>
          </div>
        </div>
      </div>

      {/* Danh mục nhanh */}
      <div className="mb-5">
        <h4 className="fw-bold mb-3 border-start border-4 border-warning ps-2">
          Danh Mục Món Ăn
        </h4>
        <Row className="g-3">
          {categories.map((cat) => (
            <Col key={cat.id} xs={6} sm={4} md={3} lg={true}>
              <Link to={`/foods?category=${cat.id}`} className="text-decoration-none">
                <Card className="h-100 text-center shadow-sm border-0 bg-light hover-shadow transition" style={{ cursor: 'pointer' }}>
                  <Card.Body className="py-3">
                    <h6 className="fw-bold mb-1 text-dark">{cat.name}</h6>
                    <small className="text-muted d-block text-truncate">{cat.description}</small>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Banner Khuyến Mãi Hot */}
      <div className="p-4 mb-5 rounded-3 bg-warning bg-opacity-25 border border-warning d-flex flex-wrap align-items-center justify-content-between">
        <div>
          <h5 className="fw-bold text-dark mb-1">🎉 Ưu Đãi Đặt Hàng Hôm Nay!</h5>
          <p className="mb-0 text-secondary">
            Nhập mã <strong className="text-danger">WELCOME10</strong> giảm 10% hoặc <strong className="text-danger">FASTFOOD20</strong> giảm ngay 20.000đ khi đặt món!
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/foods" className="btn btn-dark fw-bold">
            Đặt Món Ngay
          </Link>
        </div>
      </div>

      {/* Món ăn nổi bật */}
      <div id="featured" className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0 border-start border-4 border-danger ps-2">
            ⭐ Món Ăn Nổi Bật Bán Chạy Nhất
          </h4>
          <Link to="/foods" className="text-decoration-none fw-bold text-danger">
            Xem tất cả món &rarr;
          </Link>
        </div>

        <Row className="g-4">
          {featuredFoods.map((food) => (
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
                      Chi tiết món
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Đánh giá từ khách hàng */}
      {reviews.length > 0 && (
        <div className="mb-5">
          <h4 className="fw-bold mb-4 border-start border-4 border-success ps-2">
            💬 Đánh Giá Của Khách Hàng
          </h4>
          <Row className="g-3">
            {reviews.map((rev) => (
              <Col key={rev.id} md={6}>
                <Card className="h-100 border-0 bg-light shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-primary">{rev.userName}</span>
                      <span className="text-warning">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <Card.Text className="fst-italic text-secondary small">
                      "{rev.comment}"
                    </Card.Text>
                    <small className="text-muted">
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Cam kết dịch vụ */}
      <div className="py-4 my-4 bg-light rounded-3 text-center border">
        <Row className="g-4">
          <Col md={4}>
            <div className="fs-1">🚀</div>
            <h6 className="fw-bold mt-2">Giao Hàng Siêu Tốc</h6>
            <p className="text-muted small mb-0">Cam kết giao đồ ăn nóng hổi trong 25 - 45 phút.</p>
          </Col>
          <Col md={4}>
            <div className="fs-1">🥗</div>
            <h6 className="fw-bold mt-2">Nguyên Liệu Tươi Ngon</h6>
            <p className="text-muted small mb-0">Đảm bảo vệ sinh an toàn thực phẩm chuẩn quy trình.</p>
          </Col>
          <Col md={4}>
            <div className="fs-1">🎁</div>
            <h6 className="fw-bold mt-2">Nhiều Khuyến Mãi</h6>
            <p className="text-muted small mb-0">Nhiều coupon giảm giá và miễn phí ship cho đơn từ 150k.</p>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
