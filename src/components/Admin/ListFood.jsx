import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Badge, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllFoods, getAllCategories, deleteFood } from '../../config/api';

function ListFood() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fRes, cRes] = await Promise.all([
        getAllFoods(),
        getAllCategories()
      ]);
      setFoods(fRes.data);
      setCategories(cRes.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu món ăn:', err);
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa món "${name}" (ID: ${id}) không?`)) {
      try {
        await deleteFood(id);
        alert('Xóa món ăn thành công!');
        loadData();
      } catch (err) {
        console.error('Lỗi xóa món:', err);
        alert('Xóa món ăn thất bại!');
      }
    }
  };

  const getCategoryName = (catId) => {
    const found = categories.find(c => c.id === catId);
    return found ? found.name : catId;
  };

  const filteredFoods = foods.filter((food) => {
    if (selectedCategory && food.categoryId !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const matchName = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = food.id?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0 border-start border-4 border-warning ps-2">
          Quản Lý Món Ăn
        </h3>
        <Link to="/admin/foods/add">
          <Button variant="success" className="fw-bold">
            + Thêm món ăn mới
          </Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0 bg-light mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={7}>
              <Form.Label className="small fw-bold">Tìm kiếm món ăn</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tìm theo tên món hoặc mã món..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={5}>
              <Form.Label className="small fw-bold">Lọc theo danh mục</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Table responsive striped bordered hover className="align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Ảnh</th>
            <th>Mã món</th>
            <th>Tên món ăn</th>
            <th>Danh mục</th>
            <th>Giá bán</th>
            <th>Số lượng</th>
            <th>Nổi bật</th>
            <th>Trạng thái</th>
            <th style={{ width: '150px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredFoods.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center py-4">
                Không tìm thấy món ăn nào
              </td>
            </tr>
          ) : (
            filteredFoods.map((food, index) => (
              <tr key={food.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={food.image}
                    alt={food.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    className="rounded"
                  />
                </td>
                <td><strong>{food.id}</strong></td>
                <td>{food.name}</td>
                <td>{getCategoryName(food.categoryId)}</td>
                <td className="fw-bold text-danger">
                  {food.price?.toLocaleString('vi-VN')}đ
                </td>
                <td>{food.quantity}</td>
                <td>
                  {food.isFeatured ? (
                    <Badge bg="danger">Hot</Badge>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  {food.isAvailable ? (
                    <Badge bg="success">Còn hàng</Badge>
                  ) : (
                    <Badge bg="secondary">Hết hàng</Badge>
                  )}
                </td>
                <td>
                  <Link to={`/admin/foods/edit/${food.id}`}>
                    <Button variant="warning" size="sm" className="me-2">
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(food.id, food.name)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ListFood;

