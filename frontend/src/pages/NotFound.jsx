import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '1.5rem' }}>Page not found</p>
      <Link to="/" style={{ padding: '0.625rem 1.25rem', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '6px' }}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
