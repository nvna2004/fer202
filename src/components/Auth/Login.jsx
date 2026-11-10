import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      alert(`Xin chào ${result.user.name}!`);
      if (result.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto' }}>
      <Card className="shadow border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <span className="fs-1">🍔</span>
            <h3 className="fw-bold mt-2">Đăng Nhập FastFood</h3>
            <p className="text-muted small">Thưởng thức món ngon cùng nhiều ưu đãi hấp dẫn</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Địa chỉ Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="warning"
              type="submit"
              className="w-100 fw-bold py-2 shadow-sm mb-3"
              disabled={loading}
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            </Button>
          </Form>

          <div className="text-center small mt-3">
            <span>Chưa có tài khoản? </span>
            <Link to="/register" className="fw-bold text-decoration-none text-danger">
              Đăng ký ngay
            </Link>
          </div>

          <div className="mt-4 p-3 bg-light rounded small text-secondary">
            <strong>Tài khoản mẫu:</strong><br />
            • Admin: <code>admin@fastfood.com</code> (pass bất kỳ)<br />
            • Khách: <code>an@example.com</code> hoặc <code>bich@example.com</code>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;

