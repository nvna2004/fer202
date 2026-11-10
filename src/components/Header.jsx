import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert('Đã đăng xuất tài khoản thành công!');
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-4 shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-warning d-flex align-items-center">
          <span className="me-2">🍔</span> FastFood
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Trang chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/foods">
              Thực đơn
            </Nav.Link>
            <Nav.Link as={NavLink} to="/orders">
              Tra cứu đơn hàng
            </Nav.Link>

            {/* Menu Quản trị chỉ hiển thị khi có quyền ADMIN */}
            {isAdmin && (
              <NavDropdown title="⚙️ Quản trị (Admin)" id="admin-nav-dropdown">
                <NavDropdown.Item as={Link} to="/admin/dashboard">
                  📊 Thống kê (Dashboard)
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/admin/foods">
                  🍔 Quản lý món ăn
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/categories">
                  📁 Quản lý danh mục
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/admin/orders">
                  📦 Quản lý tất cả đơn hàng
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Nav className="align-items-center gap-2">
            {/* Giỏ hàng */}
            <Nav.Link as={Link} to="/cart" className="position-relative btn btn-outline-warning text-white px-3 py-1 border-0">
              <span className="me-1">🛒</span> Giỏ hàng
              {totalItems > 0 && (
                <Badge pill bg="danger" className="ms-2">
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>

            {/* Tài khoản Người dùng / Đăng nhập */}
            {user ? (
              <NavDropdown 
                title={
                  <span>
                    👤 <strong>{user.name}</strong>
                    {isAdmin ? (
                      <Badge bg="danger" className="ms-2">Admin</Badge>
                    ) : (
                      <Badge bg="info" className="ms-2">{user.points || 0} điểm</Badge>
                    )}
                  </span>
                } 
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.ItemText className="small text-muted">
                  ✉️ {user.email}
                </NavDropdown.ItemText>
                {!isAdmin && (
                  <NavDropdown.ItemText className="small text-success">
                    ⭐ Điểm tích lũy: <strong>{user.points || 0} xu</strong>
                  </NavDropdown.ItemText>
                )}
                <NavDropdown.Divider />
                
                {/* Phân biệt rõ menu cho Admin và Khách hàng */}
                {isAdmin ? (
                  <>
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      📊 Bảng điều khiển (Dashboard)
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">
                      📦 Quản lý tất cả đơn hàng (Admin)
                    </NavDropdown.Item>
                  </>
                ) : (
                  <NavDropdown.Item as={Link} to="/orders">
                    📦 Đơn hàng của tôi
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger fw-bold">
                  🚪 Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-warning btn-sm fw-bold px-3">
                  Đăng ký
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
