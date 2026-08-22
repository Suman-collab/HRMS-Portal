import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../shared/api/axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const newErrors = {};

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));


        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validate()) return;

        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/login', formData);
            const { token, role, user } = response.data; // Assuming backend returns token, role, user

            let employeeId = '';
            let email = '';

            // Attempt to get employeeId/email from user object
            if (user) {
                employeeId = user.employeeId;
                email = user.email;
            } else if (token) {
                // Fallback to decode JWT payload safely
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    employeeId = payload.employeeId || '';
                    email = payload.email || '';
                } catch (e) { }
            }

            // Store in localStorage for this stage
            if (token) localStorage.setItem('token', token);
            if (role) localStorage.setItem('role', role);
            if (employeeId) localStorage.setItem('employeeId', employeeId);
            if (email) localStorage.setItem('email', email);

            // Add to axios default headers for future requests
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            // Redirect based on role
            if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || 'An error occurred during sign in. Please try again.';
            setServerError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-61px)] bg-background w-full px-4 text-gray-900 mt-10">
            <div className="w-full max-w-md bg-surface border border-gray-200 rounded-xl shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-sm text-gray-500">Sign in to your Dayflow account</p>
                </div>

                {serverError && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary focus:border-primary'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                            placeholder="name@company.com"
                        />
                        {errors.email && <span className="text-xs text-red-500 mt-1 block font-medium">{errors.email}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 pr-12 bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary focus:border-primary'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <span className="text-xs text-red-500 mt-1 block font-medium">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2.5 px-4 rounded-lg text-white font-medium shadow-sm transition-all ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;