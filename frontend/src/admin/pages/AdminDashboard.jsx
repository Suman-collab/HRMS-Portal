import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../shared/api/axios';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchEmployees = async (page = 1) => {
        setLoading(true);
        setError('');

        // Fallback: Manually retrieve token if api interceptor fails for some reason
        const token = localStorage.getItem('token');
        try {
            const response = await api.get(`/api/admin/employees?page=${page}&limit=${pagination.limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEmployees(response.data.data || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Unauthorized access. Please login as an admin.');
            } else {
                setError('Failed to fetch the employee directory.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(pagination.page);
        // eslint-disable-next-line
    }, [pagination.page]);

    const handleRowClick = (employeeId) => {
        // Navigate to placeholder employee detail page
        // Using the logical employeeId or _id. We'll use the unique _id if available, otherwise employeeId
        navigate(`/admin/employees/${employeeId}`);
    };

    const handleNextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const styles = {
        container: {
            fontFamily: 'system-ui, sans-serif',
            color: '#1f2937',
        },
        header: {
            marginBottom: '2rem',
        },
        title: {
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 0 0.5rem 0',
        },
        widgetGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
        },
        widgetCard: {
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
        },
        widgetTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: '0.5rem',
        },
        tableContainer: {
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
            overflowX: 'auto',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
        },
        th: {
            padding: '0.75rem 1rem',
            backgroundColor: '#f9fafb',
            borderBottom: '2px solid #e5e7eb',
            color: '#4b5563',
            fontWeight: '600',
            fontSize: '0.875rem',
        },
        td: {
            padding: '1rem',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '0.875rem',
        },
        tr: {
            cursor: 'pointer',
            transition: 'background-color 0.1s',
        },
        paginationControls: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.5rem',
            fontSize: '0.875rem',
            color: '#4b5563',
        },
        btn: {
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        btnDisabled: {
            backgroundColor: '#93c5fd',
            cursor: 'not-allowed',
        },
        badge: (isVerified) => ({
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: isVerified ? '#dcfce7' : '#fef3c7',
            color: isVerified ? '#166534' : '#92400e',
        })
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <p style={{ color: '#4b5563' }}>System overview and employee management.</p>
            </header>

            <div style={styles.widgetGrid}>
                <div style={styles.widgetCard}>
                    <div style={styles.widgetTitle}>Attendance Summary</div>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Online Today:</strong> 42 / 50 Employees</p>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Late Arrivals:</strong> 3</p>
                        <p><strong>Absent:</strong> 5</p>
                    </div>
                </div>

                <div style={styles.widgetCard}>
                    <div style={styles.widgetTitle}>Pending Leave Approvals</div>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>John Doe (Sick Leave) - 2 days</li>
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>Sarah Connor (Vacation) - 5 days</li>
                            <li style={{ padding: '0.5rem 0' }}>Mike Smith (Personal) - 1 day</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div style={styles.tableContainer}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Employee Directory</h2>

                {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

                {loading ? (
                    <p>Loading employees...</p>
                ) : (
                    <>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Employee ID</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ ...styles.td, textAlign: 'center' }}>No employees found.</td>
                                    </tr>
                                ) : (
                                    employees.map((emp) => (
                                        <tr
                                            key={emp._id}
                                            style={styles.tr}
                                            onClick={() => handleRowClick(emp._id)}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={styles.td}><strong>{emp.employeeId}</strong></td>
                                            <td style={styles.td}>{emp.email}</td>
                                            <td style={{ ...styles.td, textTransform: 'capitalize' }}>{emp.role}</td>
                                            <td style={styles.td}>
                                                <span style={styles.badge(emp.isVerified)}>
                                                    {emp.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div style={styles.paginationControls}>
                            <span>Showing Page {pagination.page} of {pagination.totalPages || 1}</span>
                            <div>
                                <button
                                    onClick={handlePrevPage}
                                    disabled={pagination.page <= 1}
                                    style={{ ...styles.btn, marginRight: '0.5rem', ...(pagination.page <= 1 ? styles.btnDisabled : {}) }}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={pagination.page >= pagination.totalPages}
                                    style={{ ...styles.btn, ...(pagination.page >= pagination.totalPages ? styles.btnDisabled : {}) }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}