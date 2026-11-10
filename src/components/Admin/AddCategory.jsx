import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { addCategory } from '../../config/api';

function AddCategory() {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !name) {
      alert('Vui lòng nhập đầy đủ mã và tên danh mục!');
      return;
    }
    const newCategory = {
      id: id.trim(),
      name: name.trim(),
      description: description.trim(),
    };
    try {
      await addCategory(newCategory);
      alert('Thêm danh mục thành công!');
      navigate('/admin/categories');
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      alert('Thêm danh mục thất bại!');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 className="mb-4">Thêm danh mục mới</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Mã danh mục</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ví dụ: C08"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tên danh mục</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ví dụ: Salad & Khai vị"
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
            placeholder="Nhập mô tả danh mục..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
          Lưu danh mục
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

export default AddCategory;
