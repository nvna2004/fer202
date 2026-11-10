import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Form, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrder } from '../config/api';
import { useAuth } from '../context/AuthContext';

function Orders() {
  const { user, isAdmin } = useAuth();

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      // Sắp xếp đơn mới nhất lên đầu
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng:', err);
      setError('Không thể tải danh sách đơn hàng từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (order) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${order.id} không?`)) {
      try {
        const updated = { ...order, status: 'CANCELLED' };
        await updateOrder(order.id, updated);
        alert('Hủy đơn hàng thành công!');
        fetchOrders();
      } catch (err) {
        alert('Không thể hủy đơn hàng. Vui lòng thử lại!');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge bg="success">Đã giao thành công</Badge>;
      case 'DELIVERING':
        return <Badge bg="primary">Đang giao hàng</Badge>;
      case 'PENDING':
        return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
      case 'CANCELLED':
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Hàm kiểm tra xem đơn có phải của chính người đang đăng nhập hay không
  const isMyOrder = (order) => {
    if (!user) return false;
    return order.userId === user.id || (user.phone && order.customerInfo?.phone === user.phone);
  };

  const cleanTerm = searchTerm.trim().toUpperCase();
  // Kiểm tra người dùng có đang gõ mã đơn hàng (bắt đầu bằng ORD) hay không
  const isSearchingByOrderCode = cleanTerm.startsWith('ORD');

  let displayedOrders = [];

  if (isSearchingByOrderCode) {
    // KHI SEARCH CÓ MÃ ORD: Cho phép tìm ra đơn hàng (kể cả của người khác) theo mã đơn
    displayedOrders = orders.filter((order) =>
      order.id?.toUpperCase().includes(cleanTerm)
    );
  } else {
    // MẶC ĐỊNH (HOẶC SEARCH THÔNG THƯỜNG): CHỈ HIỂN THỊ ĐƠN HÀNG CỦA BẢN THÂN
    if (user) {
      displayedOrders = orders.filter(isMyOrder);

      // Nếu có tìm kiếm từ khóa thông thường (tên món, SĐT bản thân, ghi chú...)
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        displayedOrders = displayedOrders.filter((order) => {
          const matchId = order.id?.toLowerCase().includes(term);
          const matchName = order.customerInfo?.name?.toLowerCase().includes(term);
          const matchItem = order.items?.some(item =>
            (item.foodName || item.foodId)?.toLowerCase().includes(term)
          );
          return matchId || matchName || matchItem;
        });
      }
    } else {
      // Chưa đăng nhập và chưa gõ mã ORD -> Không hiển thị
      displayedOrders = [];
    }
  }

  // Lọc thêm theo trạng thái (status)
  if (statusFilter !== 'ALL') {
    displayedOrders = displayedOrders.filter((order) => order.status === statusFilter);
  }

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0 border-start border-4 border-warning ps-2">
          {user ? '📦 Đơn Hàng Của Tôi' : '🔍 Tra Cứu Đơn Hàng'}
        </h3>
        {isAdmin && (
          <Link to="/admin/orders" className="btn btn-dark btn-sm fw-bold">
            ⚙️ Chuyển sang Quản Lý Toàn Bộ Đơn Hàng Cửa Hàng
          </Link>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Thanh tìm kiếm và bộ lọc */}
      <Card className="shadow-sm border-0 bg-light mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Label className="small fw-bold">
                Tìm kiếm đơn hàng
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã đơn (bắt đầu bằng ORD...) để tra cứu đơn bất kỳ, hoặc tìm món ăn trong đơn của bạn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Form.Text className="text-muted small">
                {isSearchingByOrderCode
                  ? '🔎 Đang tra cứu đơn hàng theo mã ORD trên toàn hệ thống.'
                  : user
                  ? '🔒 Mặc định chỉ hiển thị đơn hàng của bạn. Nhập mã có "ORD" để tìm đơn của người khác.'
                  : '💡 Vui lòng nhập mã đơn (ví dụ: ORD001) để xem chi tiết.'}
              </Form.Text>
            </Col>

            <Col md={4}>
              <Form.Label className="small fw-bold">Lọc theo trạng thái</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="DELIVERING">Đang giao hàng</option>
                <option value="DELIVERED">Đã giao thành công</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CANCELLED">Đã hủy</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Hiển thị danh sách đơn hàng */}
      {!user && !isSearchingByOrderCode ? (
        <Alert variant="warning" className="text-center py-5">
          <h5>🔍 Bạn chưa đăng nhập</h5>
          <p className="text-muted mb-3">
            Vui lòng nhập <strong>Mã đơn hàng</strong> (bắt đầu bằng <code>ORD...</code>, ví dụ: <code>ORD001</code>) để tra cứu đơn hàng của bạn.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/login" className="btn btn-outline-dark btn-sm">
              Đăng nhập tài khoản
            </Link>
          </div>
        </Alert>
      ) : displayedOrders.length === 0 ? (
        <Alert variant="info" className="text-center py-4">
          {isSearchingByOrderCode
            ? `Không tìm thấy đơn hàng nào có mã "${searchTerm.trim()}".`
            : 'Bạn chưa có đơn hàng nào.'}
        </Alert>
      ) : (
        <div className="d-flex flex-column gap-4">
          {displayedOrders.map((order) => (
            <Card key={order.id} className="shadow-sm border-0">
              <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center py-3">
                <div>
                  <span className="fw-bold fs-5 text-dark me-3">
                    Đơn #{order.id}
                  </span>
                  <small className="text-muted">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                  {getStatusBadge(order.status)}
                  <Badge bg={order.paymentStatus === 'PAID' ? 'info' : 'secondary'}>
                    {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </Badge>
                </div>
              </Card.Header>

              <Card.Body>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <p className="mb-1 text-muted small">Người nhận:</p>
                    <p className="mb-1 fw-bold">{order.customerInfo?.name || 'Khách vãng lai'}</p>
                    <p className="mb-1 text-secondary small">📞 SĐT: {order.customerInfo?.phone}</p>
                    <p className="mb-0 text-secondary small">📍 Địa chỉ: {order.customerInfo?.address}</p>
                    {order.note && (
                      <p className="mt-1 text-info small fst-italic">📝 Ghi chú: {order.note}</p>
                    )}
                  </Col>

                  <Col md={6} className="text-md-end">
                    <p className="mb-1 text-muted small">Hình thức thanh toán:</p>
                    <p className="mb-2 fw-bold text-dark">{order.paymentMethod}</p>
                    <p className="mb-1 small">Tạm tính: {order.subtotal?.toLocaleString('vi-VN')}đ</p>
                    <p className="mb-1 small">Phí vận chuyển: {order.deliveryFee ? `${order.deliveryFee.toLocaleString('vi-VN')}đ` : 'Miễn phí'}</p>
                    {order.discount > 0 && (
                      <p className="mb-1 small text-success">
                        Giảm giá ({order.couponCode}): -{order.discount.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                    <h5 className="fw-bold text-danger mt-2">
                      Tổng tiền: {order.total?.toLocaleString('vi-VN')}đ
                    </h5>
                  </Col>
                </Row>

                <div className="table-responsive">
                  <Table size="sm" className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Món ăn</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-end">Đơn giá</th>
                        <th className="text-end">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.foodName || item.foodId}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">{item.price?.toLocaleString('vi-VN')}đ</td>
                          <td className="text-end fw-bold">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>

              {(order.status === 'DELIVERING' || order.status === 'PENDING') && (
                <Card.Footer className="bg-white text-end py-2">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleCancelOrder(order)}
                  >
                    Hủy đơn hàng này
                  </Button>
                </Card.Footer>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
