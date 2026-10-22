import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllCategories, deleteCategory } from '../../config/api';

function ListCategory() {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const loadData = async () => {
        const res = await getAllCategories();
        setCategories(res.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
            try {
                await deleteCategory(id);
                alert("Xóa danh mục thành công!");
                loadData();
            } catch (error) {
                alert("Xóa danh mục thất bại!");
            }
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Quản lý danh mục</h3>
                <Link to="/admin/categories/add">
                    <Button variant="success">
                        Thêm danh mục
                    </Button>
                </Link>
            </div>

            <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mã danh mục</th>
                        <th>Tên danh mục</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Không tìm thấy danh mục nào
                            </td>
                        </tr>
                    ) : (
                        filteredCategories.map((cat, index) => (
                            <tr key={cat.id}>
                                <td>{index + 1}</td>
                                <td>{cat.id}</td>
                                <td>{cat.name}</td>
                                <td>{cat.description}</td>
                                <td>
                                    <Link to={`/admin/categories/edit/${cat.id}`}>
                                        <Button variant="warning" size="sm" className="me-2">
                                            Sửa
                                        </Button>
                                    </Link>
                                    <Link to="#" onClick={() => handleDelete(cat.id)}>
                                        <Button variant="danger" size="sm">
                                            Xóa
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
}


export default ListCategory;