import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          FastFood
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/foods">
              Món ăn
            </Nav.Link>
            <Nav.Link as={NavLink} to="/orders">
              Đơn hàng
            </Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link as={Link} to="/cart">
              Giỏ hàng
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
