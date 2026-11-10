import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-bootstrap';

function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    alert('Vui lòng đăng nhập với tài khoản Quản trị viên (Admin) để tiếp tục!');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="py-5 text-center">
        <Alert variant="danger" className="d-inline-block text-start p-4">
          <h4>⛔ Truy cập bị từ chối</h4>
          <p className="mb-0">
            Tài khoản <strong>{user.email}</strong> không có quyền truy cập vào khu vực quản trị!
          </p>
        </Alert>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;

