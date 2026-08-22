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

    const styles = {
        container: {
            maxWidth: '400px',
            margin: '4rem auto',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            borderRadius: '8px',
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#fff',
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
            marginBottom: '1.25rem',
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
            marginTop: '0.5rem',
        },
        buttonDisabled: {
            backgroundColor: '#93c5fd',
            cursor: 'not-allowed',
        },
        alertError: {
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            fontSize: '0.875rem',
        }
    };

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '1px' }}>
            <div style={styles.container}>
                <h2 style={styles.title}>Sign In to Dayflow</h2>

                {serverError && (
                    <div style={styles.alertError}>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
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

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isLoading ? styles.buttonDisabled : {})
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;