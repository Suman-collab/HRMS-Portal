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

    const styles = {
        container: {
            maxWidth: '400px',
            margin: '2rem auto',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            borderRadius: '8px',
            fontFamily: 'system-ui, sans-serif',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#1f2937',
            textAlign: 'center',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '1rem',
        },
        label: {
            marginBottom: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
        },
        input: {
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
        },
        errorText: {
            color: '#ef4444',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
        },
        button: {
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            color: '#fff',
            backgroundColor: '#2563eb',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem',
        },
        buttonDisabled: {
            backgroundColor: '#93c5fd',
            cursor: 'not-allowed',
        },
        alert: (type) => ({
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2',
            color: type === 'success' ? '#166534' : '#991b1b',
            fontSize: '0.875rem',
        })
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Create Account</h2>

            {serverStatus && (
                <div style={styles.alert(serverStatus.type)}>
                    {serverStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="employeeId">Employee ID</label>
                    <input
                        id="employeeId"
                        name="employeeId"
                        type="text"
                        value={formData.employeeId}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    {errors.employeeId && <span style={styles.errorText}>{errors.employeeId}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="role">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={styles.input}
                    >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        ...(isLoading ? styles.buttonDisabled : {})
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default Signup;