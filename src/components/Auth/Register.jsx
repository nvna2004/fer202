import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    const result = await register({ name, email, phone, password, address });
    setLoading(false);

    if (result.success) {
      alert('Đăng ký tài khoản thành công! Bạn đã được tự động đăng nhập.');
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto' }}>
      <Card className="shadow border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <span className="fs-1">🍟</span>
            <h3 className="fw-bold mt-2">Đăng Ký Thành Viên</h3>
            <p className="text-muted small">Tích điểm thưởng và nhận nhiều ưu đãi độc quyền</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Họ và tên *</Form.Label>
              <Form.Control
                type="text"
                placeholder="VD: Trần Văn Nam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Địa chỉ Email *</Form.Label>
              <Form.Control
                type="email"
                placeholder="nam@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Số điện thoại *</Form.Label>
              <Form.Control
                type="tel"
                placeholder="0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Địa chỉ giao hàng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Số nhà, đường, quận/huyện..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Mật khẩu *</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ít nhất 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small">Xác nhận mật khẩu *</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="warning"
              type="submit"
              className="w-100 fw-bold py-2 shadow-sm mb-3"
              disabled={loading}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản'}
            </Button>
          </Form>

          <div className="text-center small">
            <span>Đã có tài khoản? </span>
            <Link to="/login" className="fw-bold text-decoration-none text-primary">
              Đăng nhập ngay
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;

