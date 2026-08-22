import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../shared/api/axios';

const Dashboard = () => {
    const navigate = useNavigate();

    // Read stored auth state
    const employeeId = localStorage.getItem('employeeId') || 'Employee';
    const email = localStorage.getItem('email') || '';
    const role = localStorage.getItem('role') || 'employee';

    const handleLogout = () => {
        // Clear auth state
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('employeeId');
        localStorage.removeItem('email');

        // Clear axios default header
        delete api.defaults.headers.common['Authorization'];

        // Redirect to login
        navigate('/login', { replace: true });
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
        subtitle: {
            fontSize: '1rem',
            color: '#4b5563',
            margin: 0,
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
        },
        card: {
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
            cursor: 'pointer',
        },
        cardTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#111827',
        },
        cardDesc: {
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem',
            flex: 1,
        },
        logoutCard: {
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
        },
        logoutTitle: {
            color: '#b91c1c',
        },
        recentSection: {
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
        },
        recentTitle: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1.25rem',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '0.5rem',
        },
        activityList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        activityItem: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderBottom: '1px solid #f3f4f6',
            fontSize: '0.95rem',
        },
        activityItemLast: {
            borderBottom: 'none',
        },
        activityTime: {
            color: '#6b7280',
            fontSize: '0.85rem',
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Welcome, {employeeId}</h1>
                <p style={styles.subtitle}>{email} &bull; {role.charAt(0).toUpperCase() + role.slice(1)}</p>
            </header>

            <div style={styles.grid}>
                <Link to="/profile" style={styles.card}>
                    <div style={styles.cardTitle}>Profile</div>
                    <div style={styles.cardDesc}>View and update your personal information and details.</div>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500' }}>Manage Profile &rarr;</div>
                </Link>

                <Link to="/attendance" style={styles.card}>
                    <div style={styles.cardTitle}>Attendance</div>
                    <div style={styles.cardDesc}>Check-in, check-out, and view your daily logs.</div>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500' }}>View Logs &rarr;</div>
                </Link>

                <Link to="/leave" style={styles.card}>
                    <div style={styles.cardTitle}>Leave Requests</div>
                    <div style={styles.cardDesc}>Apply for leaves and check your request status.</div>
                    <div style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500' }}>Apply Leave &rarr;</div>
                </Link>

                <div style={{ ...styles.card, ...styles.logoutCard }} onClick={handleLogout}>
                    <div style={{ ...styles.cardTitle, ...styles.logoutTitle }}>Logout</div>
                    <div style={styles.cardDesc}>Securely sign out of your account right now.</div>
                    <div style={{ color: '#b91c1c', fontSize: '0.875rem', fontWeight: '500' }}>Sign Out &rarr;</div>
                </div>
            </div>

            <section style={styles.recentSection}>
                <h2 style={styles.recentTitle}>Recent Activity</h2>
                <ul style={styles.activityList}>
                    <li style={styles.activityItem}>
                        <span>Checked in successfully</span>
                        <span style={styles.activityTime}>Today at 9:02 AM</span>
                    </li>
                    <li style={styles.activityItem}>
                        <span>Leave request approved</span>
                        <span style={styles.activityTime}>Yesterday</span>
                    </li>
                    <li style={styles.activityItem}>
                        <span>Checked out</span>
                        <span style={styles.activityTime}>Aug 20 at 5:15 PM</span>
                    </li>
                    <li style={{ ...styles.activityItem, ...styles.activityItemLast }}>
                        <span>Profile information updated</span>
                        <span style={styles.activityTime}>Aug 15</span>
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;