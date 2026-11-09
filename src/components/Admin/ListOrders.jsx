import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Badge, Card, Alert } from 'react-bootstrap';
import { getAllOrders, updateOrder, deleteOrder } from '../../config/api';

function ListOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn hàng:', err);
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    try {
      const updated = { ...order, status: newStatus };
      await updateOrder(order.id, updated);
      setOrders(prev => prev.map(o => o.id === order.id ? updated : o));
    } catch (err) {
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  const handlePaymentStatusChange = async (order, newPaymentStatus) => {
    try {
      const updated = { ...order, paymentStatus: newPaymentStatus };
      await updateOrder(order.id, updated);
      setOrders(prev => prev.map(o => o.id === order.id ? updated : o));
    } catch (err) {
      alert('Cập nhật trạng thái thanh toán thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${id} không?`)) {
      try {
        await deleteOrder(id);
        alert('Xóa đơn hàng thành công!');
        loadData();
      } catch (err) {
        alert('Xóa đơn hàng thất bại!');
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'ALL' && order.status !== statusFilter) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchId = order.id?.toLowerCase().includes(term);
      const matchName = order.customerInfo?.name?.toLowerCase().includes(term);
      const matchPhone = order.customerInfo?.phone?.includes(term);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div>
      <h3 className="fw-bold mb-4 border-start border-4 border-warning ps-2">
        Quản Lý Đơn Hàng (Admin)
      </h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0 bg-light mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={7}>
              <Form.Label className="small fw-bold">Tìm kiếm đơn hàng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tìm theo mã đơn (ORD...), tên khách, hoặc SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={5}>
              <Form.Label className="small fw-bold">Lọc theo trạng thái</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="DELIVERING">Đang giao hàng</option>
                <option value="DELIVERED">Đã giao thành công</option>
                <option value="CANCELLED">Đã hủy</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Table responsive striped bordered hover className="align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Mã đơn</th>
            <th>Thời gian</th>
            <th>Khách hàng</th>
            <th>Chi tiết món</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Trạng thái đơn</th>
            <th style={{ width: '80px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4">
                Không tìm thấy đơn hàng nào
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </small>
                </td>
                <td>
                  <strong>{order.customerInfo?.name || 'Khách vãng lai'}</strong>
                  <div className="small text-muted">{order.customerInfo?.phone}</div>
                  <div className="small text-secondary text-truncate" style={{ maxWidth: '180px' }}>
                    {order.customerInfo?.address}
                  </div>
                </td>
                <td>
                  <ul className="list-unstyled mb-0 small">
                    {order.items?.map((item, idx) => (
                      <li key={idx}>
                        • {item.foodName || item.foodId} x <strong>{item.quantity}</strong>
                      </li>
                    ))}
                  </ul>
                  {order.note && (
                    <small className="text-info d-block mt-1">Note: {order.note}</small>
                  )}
                </td>
                <td className="fw-bold text-danger">
                  {order.total?.toLocaleString('vi-VN')}đ
                  <div className="small text-muted fw-normal">{order.paymentMethod}</div>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusChange(order, e.target.value)}
                    className={order.paymentStatus === 'PAID' ? 'text-success fw-bold' : 'text-danger fw-bold'}
                  >
                    <option value="UNPAID">Chưa thanh toán</option>
                    <option value="PAID">Đã thanh toán</option>
                  </Form.Select>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="fw-bold"
                  >
                    <option value="PENDING">Chờ xác nhận</option>
                    <option value="DELIVERING">Đang giao hàng</option>
                    <option value="DELIVERED">Đã giao</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </Form.Select>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
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

export default ListOrders;

