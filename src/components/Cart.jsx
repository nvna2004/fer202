import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Alert, InputGroup, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getAllCoupons, createOrder } from '../config/api';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerAddress(user.address || '');
    }
  }, [user]);

  const deliveryFee = subtotal >= 150000 || subtotal === 0 ? 0 : 15000;

  // Calculate discount from coupon
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  // Apply Coupon handler
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponInput.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá.');
      return;
    }

    try {
      const res = await getAllCoupons();
      const code = couponInput.trim().toUpperCase();
      const found = res.data.find(c => c.code.toUpperCase() === code && c.isActive);

      if (!found) {
        setCouponError('Mã giảm giá không tồn tại hoặc đã hết hạn.');
        return;
      }

      if (subtotal < found.minOrderValue) {
        setCouponError(`Mã này chỉ áp dụng cho đơn hàng từ ${found.minOrderValue.toLocaleString('vi-VN')}đ.`);
        return;
      }

      setAppliedCoupon(found);
      setCouponSuccess(`Áp dụng mã ${found.code} thành công: ${found.description}`);
    } catch (err) {
      console.error('Lỗi kiểm tra coupon:', err);
      setCouponError('Không thể kiểm tra mã giảm giá lúc này.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Submit Order handler
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Vui lòng điền đầy đủ tên, số điện thoại và địa chỉ giao hàng!');
      return;
    }

    const orderId = 'ORD' + Date.now().toString().slice(-6);

    const orderData = {
      id: orderId,
      orderType: 'ONLINE',
      customerType: user ? 'REGISTERED' : 'GUEST',
      userId: user ? user.id : null,
      fulfillmentType: 'DELIVERY',
      customerInfo: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim()
      },
      items: cartItems.map(item => ({
        foodId: item.id,
        foodName: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      deliveryFee,
      discount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      total: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH' ? 'UNPAID' : 'PAID',
      status: 'DELIVERING',
      note: customerNote.trim() || null,
      createdAt: new Date().toISOString()
    };

    try {
      setIsSubmitting(true);
      await createOrder(orderData);

      alert(`🎉 Đặt hàng thành công! Mã đơn: ${orderId}`);
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Lỗi khi đặt hàng:', err);
      alert('Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h4 className="fw-bold mt-3">Giỏ hàng của bạn đang trống</h4>
        <p className="text-muted">Hãy chọn những món ăn ngon miệng từ thực đơn của FastFood nhé!</p>
        <Link to="/foods" className="btn btn-warning fw-bold px-4 py-2 mt-2">
          Xem Thực Đơn Ngay
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="fw-bold mb-4 border-start border-4 border-warning ps-2">
        🛒 Giỏ Hàng Của Bạn
      </h3>

      <Row className="g-4">
        {/* Bảng sản phẩm */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-0">
              <Table responsive className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>Ảnh</th>
                    <th>Món ăn</th>
                    <th>Đơn giá</th>
                    <th style={{ width: '130px' }}>Số lượng</th>
                    <th>Thành tiền</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <Link to={`/foods/${item.id}`} className="fw-bold text-dark text-decoration-none">
                          {item.name}
                        </Link>
                      </td>
                      <td className="text-muted">
                        {item.price.toLocaleString('vi-VN')}đ
                      </td>
                      <td>
                        <div className="d-flex align-items-center border rounded" style={{ maxWidth: '100px' }}>
                          <Button
                            variant="light"
                            size="sm"
                            className="px-2 py-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="px-2 fw-bold text-center flex-grow-1">
                            {item.quantity}
                          </span>
                          <Button
                            variant="light"
                            size="sm"
                            className="px-2 py-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="fw-bold text-danger">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="border-0"
                          title="Xóa món"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ✕
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Link to="/foods" className="btn btn-outline-secondary">
              &larr; Tiếp tục chọn món
            </Link>
            <Button variant="outline-danger" onClick={clearCart}>
              Xoá toàn bộ giỏ hàng
            </Button>
          </div>

          {/* Form thông tin giao hàng */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white fw-bold py-3 d-flex justify-content-between align-items-center">
              <span>📍 Thông tin giao hàng & người nhận</span>
              {!user && (
                <small className="text-muted">
                  Đã có tài khoản? <Link to="/login" className="text-primary fw-bold">Đăng nhập ngay</Link>
                </small>
              )}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleCheckout}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Họ và tên người nhận *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="VD: Nguyễn Văn A"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Số điện thoại *</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="VD: 0901234567"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Địa chỉ nhận hàng chi tiết *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">Ghi chú cho shipper / nhà hàng</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="VD: Giao trước 12h, gọi điện trước khi đến..."
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Label className="small fw-bold">Phương thức thanh toán</Form.Label>
                    <div className="d-flex flex-column gap-2">
                      <Form.Check
                        type="radio"
                        id="pay-cash"
                        name="paymentMethod"
                        label="💵 Tiền mặt khi nhận hàng (COD)"
                        checked={paymentMethod === 'CASH'}
                        onChange={() => setPaymentMethod('CASH')}
                      />
                      <Form.Check
                        type="radio"
                        id="pay-transfer"
                        name="paymentMethod"
                        label="🏦 Chuyển khoản ngân hàng (QR Code / Mobile Banking)"
                        checked={paymentMethod === 'BANK_TRANSFER'}
                        onChange={() => setPaymentMethod('BANK_TRANSFER')}
                      />
                      <Form.Check
                        type="radio"
                        id="pay-momo"
                        name="paymentMethod"
                        label="📱 Ví điện tử MoMo"
                        checked={paymentMethod === 'MOMO'}
                        onChange={() => setPaymentMethod('MOMO')}
                      />
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Tổng tiền & Mã giảm giá */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4 sticky-top" style={{ top: '80px' }}>
            <Card.Header className="bg-white fw-bold py-3">
              Tóm tắt đơn hàng
            </Card.Header>
            <Card.Body>
              {/* Áp dụng coupon */}
              <div className="mb-3">
                <Form.Label className="small fw-bold">Mã giảm giá</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="VD: WELCOME10, FASTFOOD20"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <Button variant="outline-danger" onClick={handleRemoveCoupon}>
                      Hủy
                    </Button>
                  ) : (
                    <Button variant="dark" onClick={handleApplyCoupon}>
                      Áp dụng
                    </Button>
                  )}
                </InputGroup>
                {couponError && <small className="text-danger d-block mt-1">{couponError}</small>}
                {couponSuccess && <small className="text-success d-block mt-1">{couponSuccess}</small>}
              </div>

              <hr />

              {/* Chi tiết tiền */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tạm tính:</span>
                <span className="fw-bold">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Phí giao hàng:</span>
                <span>
                  {deliveryFee === 0 ? (
                    <Badge bg="success">Miễn phí</Badge>
                  ) : (
                    `${deliveryFee.toLocaleString('vi-VN')}đ`
                  )}
                </span>
              </div>
              {subtotal < 150000 && (
                <div className="small text-muted mb-2 fst-italic">
                  (Mua thêm {(150000 - subtotal).toLocaleString('vi-VN')}đ để được miễn phí ship)
                </div>
              )}

              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Giảm giá mã ({appliedCoupon?.code}):</span>
                  <span className="fw-bold">-{discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold">Tổng thanh toán:</span>
                <span className="fs-4 fw-bold text-danger">
                  {finalTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <Button
                variant="warning"
                size="lg"
                className="w-100 fw-bold shadow-sm"
                disabled={isSubmitting}
                onClick={handleCheckout}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Cart;
