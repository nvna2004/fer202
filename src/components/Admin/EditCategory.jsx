import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, updateCategory } from '../../config/api';

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const loadData = async () => {
    try {
      const res = await getCategoryById(id);
      setName(res.data.name);
      setDescription(res.data.description || '');
    } catch (error) {
      alert('Không tìm thấy danh mục!');
      navigate('/admin/categories');
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }

    const updated = {
      id,
      name: name.trim(),
      description: description.trim(),
    };

    try {
      await updateCategory(id, updated);
      alert('Cập nhật danh mục thành công!');
      navigate('/admin/categories');
    } catch (error) {
      alert('Cập nhật danh mục thất bại!');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 className="mb-4">Chỉnh sửa danh mục</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Mã danh mục</Form.Label>
          <Form.Control type="text" value={id} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tên danh mục</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
          Lưu thay đổi
        </Button>

        <Link to="/admin/categories">
          <Button variant="secondary">
            Quay lại
          </Button>
        </Link>
      </Form>
    </div>
  );
}

export default EditCategory;
