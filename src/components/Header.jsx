import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { totalItems } = useCart();

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

            <NavDropdown title="Quản trị (Admin)" id="admin-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin/foods">
                Quản lý món ăn
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/categories">
                Quản lý danh mục
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/admin/orders">
                Quản lý đơn hàng
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/cart" className="position-relative btn btn-outline-warning text-white px-3 py-1 me-2 border-0">
              <span className="me-1">🛒</span> Giỏ hàng
              {totalItems > 0 && (
                <Badge pill bg="danger" className="ms-2">
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
