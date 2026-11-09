import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 pt-4 pb-3 border-top border-secondary">
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h5 className="text-warning fw-bold mb-3">🍔 FastFood Restaurant</h5>
            <p className="text-muted small">
              Thưởng thức hương vị đồ ăn nhanh tuyệt hảo, phục vụ nhanh chóng và tiện lợi. 
              Cam kết nguyên liệu tươi sạch, an toàn vệ sinh thực phẩm 100%.
            </p>
            <div className="small text-secondary">
              <p className="mb-1">📍 Địa chỉ: FastFood Headquarter, Hà Nội</p>
              <p className="mb-1">📞 Hotline: 1900 6868</p>
              <p className="mb-0">✉️ Email: contact@fastfood.com</p>
            </div>
          </Col>

          <Col md={4}>
            <h5 className="text-white fw-bold mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-secondary hover-warning">Trang chủ</Link>
              </li>
              <li className="mb-2">
                <Link to="/foods" className="text-decoration-none text-secondary hover-warning">Thực đơn phong phú</Link>
              </li>
              <li className="mb-2">
                <Link to="/orders" className="text-decoration-none text-secondary hover-warning">Kiểm tra đơn hàng</Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-decoration-none text-secondary hover-warning">Giỏ hàng của bạn</Link>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="text-white fw-bold mb-3">Chính sách giao hàng</h5>
            <p className="small text-muted mb-2">
              🚚 Giao nhanh trong vòng 25 - 45 phút.
            </p>
            <p className="small text-muted mb-2">
              🎁 Miễn phí giao hàng cho đơn từ <strong>150.000đ</strong>.
            </p>
            <p className="small text-muted mb-0">
              💳 Đa dạng thanh toán: Tiền mặt khi nhận (COD), MoMo, Chuyển khoản ngân hàng.
            </p>
          </Col>
        </Row>
        <hr className="my-3 border-secondary" />
        <div className="text-center small text-muted">
          &copy; {new Date().getFullYear()} FastFood Delivery System - FER202 Project. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

