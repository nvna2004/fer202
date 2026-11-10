import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('fastfood_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('fastfood_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('fastfood_user');
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            const res = await axios.get(`http://localhost:9999/users?email=${email.trim()}`);
            if (res.data.length === 0) {
                return { success: false, message: 'Email không tồn tại trong hệ thống!' };
            }
            const foundUser = res.data[0];
            if (foundUser.password && foundUser.password !== 'hashed_password' && foundUser.password !== password) {
                return { success: false, message: 'Mật khẩu không chính xác!' };
            }
            setUser(foundUser);
            return { success: true, user: foundUser };
        } catch (err) {
            return { success: false, message: 'Lỗi kết nối máy chủ khi đăng nhập!' };
        }
    };

    const register = async (userData) => {
        try {
            const checkRes = await axios.get(`http://localhost:9999/users?email=${userData.email.trim()}`);
            if (checkRes.data.length > 0) {
                return { success: false, message: 'Email này đã được sử dụng!' };
            }

            const newUser = {
                id: 'U' + Date.now().toString().slice(-4),
                name: userData.name.trim(),
                email: userData.email.trim(),
                phone: userData.phone.trim(),
                password: userData.password,
                address: userData.address.trim(),
                role: 'CUSTOMER',
                createdAt: new Date().toISOString()
            };

            const res = await axios.post('http://localhost:9999/users', newUser);
            setUser(res.data);
            return { success: true, user: res.data };
        } catch (err) {
            return { success: false, message: 'Lỗi máy chủ khi đăng ký tài khoản!' };
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAdmin: user?.role === 'ADMIN'
        }}>
            {children}
        </AuthContext.Provider>
    );
};
