import React, { useState } from 'react';
import api from '../../shared/api/axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        employeeId: '',
        email: '',
        password: '',
        role: 'employee',
    });

    const [errors, setErrors] = useState({});
    const [serverStatus, setServerStatus] = useState(null); // { type: 'success' | 'error', message: '' }
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!formData.employeeId.trim()) {
            newErrors.employeeId = 'Employee ID is required';
        }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        const password = formData.password;
        if (!password) {
            newErrors.password = 'Password is required';
        } else {
            if (password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters long';
            } else if (!/[A-Z]/.test(password)) {
                newErrors.password = 'Password must contain at least one uppercase letter';
            } else if (!/[0-9]/.test(password)) {
                newErrors.password = 'Password must contain at least one number';
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                newErrors.password = 'Password must contain at least one special character';
            }
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

        // Clear field-level error upon change
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerStatus(null);

        if (!validate()) return;

        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/signup', formData);
            setServerStatus({
                type: 'success',
                message: response.data.message || 'Signup successful! Please check your email to verify your account.',
            });
            setFormData({
                employeeId: '',
                email: '',
                password: '',
                role: 'employee',
            });
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || 'An error occurred during signup';
            setServerStatus({
                type: 'error',
                message: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-61px)] bg-background w-full px-4 text-gray-900 mt-10">
            <div className="w-full max-w-md bg-surface border border-gray-200 rounded-xl shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Create Account</h2>
                    <p className="text-sm text-gray-500">Join Dayflow to manage your workspace</p>
                </div>

                {serverStatus && (
                    <div className={`mb-6 p-4 rounded-lg border text-sm font-medium ${serverStatus.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        {serverStatus.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="employeeId">Employee ID</label>
                        <input
                            id="employeeId"
                            name="employeeId"
                            type="text"
                            value={formData.employeeId}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 bg-gray-50 border ${errors.employeeId ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-primary focus:border-primary'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                            placeholder="EMP-001"
                        />
                        {errors.employeeId && <span className="text-xs text-red-500 mt-1 block font-medium">{errors.employeeId}</span>}
                    </div>

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

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 focus:ring-primary focus:border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2.5 px-4 rounded-lg text-white font-medium shadow-sm transition-all mt-4 ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing Up...
                            </span>
                        ) : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;