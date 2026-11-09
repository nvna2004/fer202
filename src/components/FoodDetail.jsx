import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFoodById, getCategoryById, getReviewsByFoodId, addReview, getFoodsByCategoryId } from '../config/api';
import { useCart } from '../context/CartContext';

function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form review
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const foodRes = await getFoodById(id);
        setFood(foodRes.data);

        // Fetch category
        if (foodRes.data.categoryId) {
          const [catRes, relatedRes] = await Promise.all([
            getCategoryById(foodRes.data.categoryId),
            getFoodsByCategoryId(foodRes.data.categoryId)
          ]);
          setCategory(catRes.data);
          setRelatedFoods(relatedRes.data.filter(item => item.id !== id).slice(0, 4));
        }

        // Fetch reviews
        const revRes = await getReviewsByFoodId(id);
        setReviews(revRes.data || []);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết món ăn:", err);
        setError("Không tìm thấy món ăn hoặc có lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    setQuantity(1);
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity);
    alert(`Đã thêm ${quantity} phần "${food.name}" vào giỏ hàng!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      alert("Vui lòng điền tên và cảm nhận của bạn!");
      return;
    }
    const newRev = {
      foodId: id,
      userId: "GUEST_" + Date.now(),
      userName: userName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    try {
      setReviewSubmitting(true);
      const res = await addReview(newRev);
      setReviews(prev => [res.data, ...prev]);
      setUserName('');
      setComment('');
      setRating(5);
      alert("Cảm ơn bạn đã gửi đánh giá món ăn!");
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      alert("Không thể gửi đánh giá, vui lòng thử lại.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Đang tải thông tin món ăn...</p>
      </div>
    );
  }

  if (error || !food) {
    return (
      <Alert variant="danger" className="text-center my-5">
        {error || "Không tìm thấy món ăn."}
        <div className="mt-3">
          <Button variant="secondary" onClick={() => navigate('/foods')}>
            Quay lại thực đơn
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      {/* Breadcrumb quay lại */}
      <div className="mb-3">
        <Link to="/foods" className="text-decoration-none text-muted">
          &larr; Quay lại danh sách thực đơn
        </Link>
      </div>

      <Row className="g-4 mb-5">
        {/* Ảnh món ăn */}
        <Col md={6}>
          <div className="position-relative rounded-4 overflow-hidden shadow-sm" style={{ height: '380px' }}>
            <img
              src={food.image}
              alt={food.name}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
            {food.isFeatured && (
              <Badge bg="danger" className="position-absolute top-0 end-0 m-3 px-3 py-2 fs-6">
                Món Nổi Bật
              </Badge>
            )}
          </div>
        </Col>

        {/* Thông tin món ăn */}
        <Col md={6} className="d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              {category && (
                <Badge bg="secondary" className="px-3 py-2">
                  {category.name}
                </Badge>
              )}
              {food.isAvailable ? (
                <Badge bg="success" className="px-3 py-2">Còn hàng</Badge>
              ) : (
                <Badge bg="danger" className="px-3 py-2">Hết hàng</Badge>
              )}
            </div>

            <h2 className="fw-bolder mb-3">{food.name}</h2>
            
            <h3 className="text-danger fw-bold mb-3">
              {food.price ? food.price.toLocaleString('vi-VN') : 0}đ
            </h3>

            <p className="text-secondary mb-4 fs-6">
              {food.description}
            </p>

            <div className="mb-4 text-muted small">
              <p className="mb-1">✔️ Số lượng sẵn có trong bếp: <strong>{food.quantity || 0}</strong> phần</p>
              <p className="mb-1">✔️ Thời gian chuẩn bị dự kiến: <strong>10 - 15 phút</strong></p>
              <p className="mb-0">✔️ Đảm bảo vệ sinh an toàn thực phẩm, bao gói kỹ càng</p>
            </div>
          </div>

          <div>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="fw-bold">Số lượng:</span>
              <div className="d-flex align-items-center border rounded">
                <Button 
                  variant="light" 
                  size="sm" 
                  className="px-3 py-1"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <span className="px-4 fw-bold">{quantity}</span>
                <Button 
                  variant="light" 
                  size="sm" 
                  className="px-3 py-1"
                  disabled={food.quantity && quantity >= food.quantity}
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="d-flex gap-3">
              <Button
                variant="warning"
                size="lg"
                className="fw-bold px-4 flex-grow-1"
                disabled={!food.isAvailable || food.quantity <= 0}
                onClick={handleAddToCart}
              >
                🛒 Thêm Vào Giỏ Hàng
              </Button>
              <Button
                variant="dark"
                size="lg"
                className="fw-bold px-4"
                disabled={!food.isAvailable || food.quantity <= 0}
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
              >
                Mua Ngay
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Đánh giá và bình luận */}
      <Row className="g-4 mb-5">
        <Col md={7}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3">💬 Đánh giá từ khách hàng ({reviews.length})</h5>
              {reviews.length === 0 ? (
                <p className="text-muted fst-italic">Chưa có đánh giá nào cho món này. Hãy là người đầu tiên thưởng thức và chia sẻ cảm nhận!</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-bottom pb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-primary">{rev.userName}</strong>
                        <span className="text-warning">
                          {'★'.repeat(rev.rating)}
                          {'☆'.repeat(5 - rev.rating)}
                        </span>
                      </div>
                      <p className="mb-1 text-dark small">{rev.comment}</p>
                      <small className="text-muted">
                        {new Date(rev.createdAt).toLocaleString('vi-VN')}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm border-0 bg-light">
            <Card.Body>
              <h5 className="fw-bold mb-3">✍️ Viết đánh giá của bạn</h5>
              <Form onSubmit={handleReviewSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Họ và tên của bạn</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VD: Nguyễn Văn A"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Đánh giá chất lượng món</Form.Label>
                  <Form.Select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 sao - Rất ngon, tuyệt vời</option>
                    <option value="4">⭐⭐⭐⭐ 4 sao - Ngon miệng</option>
                    <option value="3">⭐⭐⭐ 3 sao - Ổn</option>
                    <option value="2">⭐⭐ 2 sao - Chưa hài lòng</option>
                    <option value="1">⭐ 1 sao - Kém</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Nội dung nhận xét</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Hãy chia sẻ cảm nhận về hương vị, độ nóng giòn, bao gói..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="dark" 
                  className="w-100 fw-bold"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Món liên quan */}
      {relatedFoods.length > 0 && (
        <div className="mb-5">
          <h5 className="fw-bold mb-3 border-start border-4 border-warning ps-2">
            Có thể bạn cũng thích
          </h5>
          <Row className="g-3">
            {relatedFoods.map((item) => (
              <Col key={item.id} xs={6} md={3}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={item.image}
                    alt={item.name}
                    style={{ height: '140px', objectFit: 'cover' }}
                  />
                  <Card.Body className="p-2 d-flex flex-column justify-content-between">
                    <h6 className="fw-bold mb-1 text-truncate">
                      <Link to={`/foods/${item.id}`} className="text-dark text-decoration-none">
                        {item.name}
                      </Link>
                    </h6>
                    <div className="text-danger fw-bold small">
                      {item.price ? item.price.toLocaleString('vi-VN') : 0}đ
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default FoodDetail;

