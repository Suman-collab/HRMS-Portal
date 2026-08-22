import React from 'react';

const Payroll = () => {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
        Payroll & Salary Details
      </h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>View your salary structure, payslips, and payment history.</p>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Current Salary Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span>Basic Salary:</span>
            <strong>$4,500.00</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span>Allowances:</span>
            <strong>$500.00</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <span>Deductions:</span>
            <strong style={{ color: '#dc2626' }}>-$200.00</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', fontSize: '1.1rem', color: '#2563eb' }}>
            <span>Net Salary:</span>
            <strong>$4,800.00</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
