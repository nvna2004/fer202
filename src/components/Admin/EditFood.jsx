import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getFoodById, updateFood, getAllCategories } from '../../config/api';

function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFood = async () => {
      try {
        setLoading(true);
        const [cRes, fRes] = await Promise.all([
          getAllCategories(),
          getFoodById(id)
        ]);
        setCategories(cRes.data);
        const food = fRes.data;
        setName(food.name || '');
        setCategoryId(food.categoryId || '');
        setPrice(food.price || '');
        setQuantity(food.quantity || 0);
        setImage(food.image || '');
        setDescription(food.description || '');
        setIsAvailable(food.isAvailable ?? true);
        setIsFeatured(food.isFeatured ?? false);
      } catch (err) {
        console.error('Lỗi khi tải thông tin món ăn:', err);
        setError('Không tìm thấy món ăn hoặc lỗi kết nối.');
      } finally {
        setLoading(false);
      }
    };
    loadFood();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !categoryId) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    const updatedFood = {
      id,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      categoryId,
      quantity: Number(quantity) || 0,
      isAvailable,
      isFeatured
    };

    try {
      await updateFood(id, updatedFood);
      alert('Cập nhật món ăn thành công!');
      navigate('/admin/foods');
    } catch (err) {
      console.error('Lỗi cập nhật món ăn:', err);
      alert('Cập nhật món ăn thất bại!');
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 className="fw-bold mb-4 border-start border-4 border-warning ps-2">
        Chỉnh Sửa Món Ăn
      </h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Mã món ăn</Form.Label>
                  <Form.Control type="text" value={id} disabled />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Danh mục *</Form.Label>
                  <Form.Select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Tên món ăn *</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Giá bán (VNĐ) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Số lượng trong kho</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Đường dẫn hình ảnh (URL)</Form.Label>
                  <Form.Control
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  {image && (
                    <div className="mt-2 text-center">
                      <img
                        src={image}
                        alt="Preview"
                        style={{ height: '120px', objectFit: 'cover' }}
                        className="rounded border"
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Mô tả món ăn</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  id="isAvailable"
                  label="Món đang sẵn sàng phục vụ (Còn hàng)"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
              </Col>

              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  id="isFeatured"
                  label="Đánh dấu là món nổi bật (HOT)"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
              </Col>
            </Row>

            <hr className="my-4" />

            <div className="d-flex gap-2">
              <Button variant="warning" type="submit" className="fw-bold px-4">
                Lưu thay đổi
              </Button>
              <Link to="/admin/foods" className="btn btn-secondary">
                Quay lại
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default EditFood;

