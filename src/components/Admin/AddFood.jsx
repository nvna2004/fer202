import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { addFood, getAllCategories } from '../../config/api';

function AddFood() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategoryId(res.data[0].id);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id.trim() || !name.trim() || !price || !categoryId) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }

    const newFood = {
      id: id.trim(),
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
      await addFood(newFood);
      alert('Thêm món ăn mới thành công!');
      navigate('/admin/foods');
    } catch (err) {
      console.error('Lỗi thêm món ăn:', err);
      alert('Thêm món ăn thất bại! Vui lòng kiểm tra mã món ăn có bị trùng không.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 className="fw-bold mb-4 border-start border-4 border-success ps-2">
        Thêm Món Ăn Mới
      </h3>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Mã món ăn *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VD: F014"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
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
                    placeholder="VD: Burger Gà Cay Phô Mai"
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
                    placeholder="VD: 55000"
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
                    placeholder="VD: 50"
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
                    placeholder="https://images.unsplash.com/..."
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
                    placeholder="Mô tả hương vị, nguyên liệu chế biến..."
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
              <Button variant="success" type="submit" className="fw-bold px-4">
                Lưu món ăn
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

export default AddFood;

