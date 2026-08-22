import React from 'react';

const Profile = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
        My Profile
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Manage your personal details, job roles, and uploaded documents.</p>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '700px' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Personal & Job Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><strong>Employee ID:</strong> <span style={{ color: '#475569' }}>EMP001</span></div>
          <div><strong>Role:</strong> <span style={{ color: '#475569' }}>Software Engineer</span></div>
          <div><strong>Department:</strong> <span style={{ color: '#475569' }}>Engineering</span></div>
          <div><strong>Joining Date:</strong> <span style={{ color: '#475569' }}>2025-01-15</span></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
