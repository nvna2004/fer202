import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllOrders, getAllFoods, getAllCategories } from '../../config/api';
import axios from 'axios';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordRes, foodRes, catRes, userRes] = await Promise.all([
          getAllOrders(),
          getAllFoods(),
          getAllCategories(),
          axios.get('http://localhost:9999/users').catch(() => ({ data: [] }))
        ]);
        setOrders(ordRes.data);
        setFoods(foodRes.data);
        setCategories(catRes.data);
        setUsers(userRes.data || []);
      } catch (err) {
        console.error('Lỗi tải dữ liệu dashboard:', err);
        setError('Không thể kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Đang phân tích số liệu hệ thống...</p>
      </div>
    );
  }

  // Tính toán số liệu thống kê
  const totalRevenue = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;
  const deliveringCount = orders.filter(o => o.status === 'DELIVERING').length;
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const cancelledCount = orders.filter(o => o.status === 'CANCELLED').length;
  const totalOrders = orders.length || 1;

  const deliveredPercent = Math.round((deliveredCount / totalOrders) * 100);
  const deliveringPercent = Math.round((deliveringCount / totalOrders) * 100);
  const cancelledPercent = Math.round((cancelledCount / totalOrders) * 100);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0 border-start border-4 border-warning ps-2">
          📊 Bảng Điều Khiển Quản Trị (Admin Dashboard)
        </h3>
        <span className="text-muted small">Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}</span>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* 4 Cards tóm tắt KPI */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-white-50 text-uppercase fw-bold">Doanh Thu Đã Giao</small>
                  <h4 className="fw-bold mt-1 mb-0">{totalRevenue.toLocaleString('vi-VN')}đ</h4>
                </div>
                <div className="fs-1 opacity-75">💰</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-white-50 text-uppercase fw-bold">Tổng Đơn Hàng</small>
                  <h4 className="fw-bold mt-1 mb-0">{orders.length} đơn</h4>
                </div>
                <div className="fs-1 opacity-75">📦</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm bg-warning text-dark">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-dark-50 text-uppercase fw-bold">Món Ăn / Danh Mục</small>
                  <h4 className="fw-bold mt-1 mb-0">{foods.length} / {categories.length}</h4>
                </div>
                <div className="fs-1 opacity-75">🍔</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-white-50 text-uppercase fw-bold">Thành Viên</small>
                  <h4 className="fw-bold mt-1 mb-0">{users.length} người</h4>
                </div>
                <div className="fs-1 opacity-75">👥</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tiến độ trạng thái đơn */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-3">Tỷ Lệ Xử Lý Đơn Hàng</h5>
          <ProgressBar className="mb-3" style={{ height: '24px' }}>
            <ProgressBar striped variant="success" now={deliveredPercent} key={1} label={`Đã giao ${deliveredPercent}%`} />
            <ProgressBar variant="primary" now={deliveringPercent} key={2} label={`Đang giao ${deliveringPercent}%`} />
            <ProgressBar variant="danger" now={cancelledPercent} key={3} label={`Đã hủy ${cancelledPercent}%`} />
          </ProgressBar>
          <div className="d-flex flex-wrap gap-4 small">
            <div><Badge bg="success">■</Badge> Đã giao: <strong>{deliveredCount}</strong></div>
            <div><Badge bg="primary">■</Badge> Đang giao: <strong>{deliveringCount}</strong></div>
            <div><Badge bg="warning" text="dark">■</Badge> Chờ xác nhận: <strong>{pendingCount}</strong></div>
            <div><Badge bg="danger">■</Badge> Đã hủy: <strong>{cancelledCount}</strong></div>
          </div>
        </Card.Body>
      </Card>

      {/* Đơn hàng mới nhất */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Đơn Hàng Gần Đây</h5>
          <Link to="/admin/orders" className="btn btn-outline-primary btn-sm">
            Xem toàn bộ đơn hàng &rarr;
          </Link>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.customerInfo?.name || 'Khách vãng lai'}</td>
                  <td>{order.customerInfo?.phone}</td>
                  <td className="fw-bold text-danger">{order.total?.toLocaleString('vi-VN')}đ</td>
                  <td>
                    <Badge bg={order.paymentStatus === 'PAID' ? 'success' : 'secondary'}>
                      {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Badge>
                  </td>
                  <td>
                    {order.status === 'DELIVERED' && <Badge bg="success">Đã giao</Badge>}
                    {order.status === 'DELIVERING' && <Badge bg="primary">Đang giao</Badge>}
                    {order.status === 'PENDING' && <Badge bg="warning" text="dark">Chờ xác nhận</Badge>}
                    {order.status === 'CANCELLED' && <Badge bg="danger">Đã hủy</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;

