import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../shared/api/axios';

export default function Profile() {
    const { id: routeId } = useParams();
    const navigate = useNavigate();

    // Auth details
    const token = localStorage.getItem('token') || '';
    const currentRole = localStorage.getItem('role') || 'employee';

    // Derive profile ID to fetch
    let profileId = routeId;
    if (!profileId && token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // The backend puts user._id into the token payload as 'id'
            profileId = payload.id || payload._id;
        } catch (e) {
            console.warn('Could not decode token for ID');
        }
    }

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    // Form state holding the editable values
    const [formData, setFormData] = useState({
        personalDetails: { name: '', DOB: '', address: '', phone: '' },
        jobDetails: { designation: '', department: '', joiningDate: '' },
        salaryStructure: { basic: 0, allowances: 0, deductions: 0 },
        profilePicture: '',
        documents: []
    });

    const fetchProfile = async () => {
        if (!profileId) {
            setError('Unable to determine user ID.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/api/profile/${profileId}`);
            const data = res.data.data;
            setProfileData(data);
            // Initialize form with backend data
            setFormData({
                personalDetails: {
                    name: data.personalDetails?.name || '',
                    DOB: data.personalDetails?.DOB ? new Date(data.personalDetails.DOB).toISOString().split('T')[0] : '',
                    address: data.personalDetails?.address || '',
                    phone: data.personalDetails?.phone || ''
                },
                jobDetails: {
                    designation: data.jobDetails?.designation || '',
                    department: data.jobDetails?.department || '',
                    joiningDate: data.jobDetails?.joiningDate ? new Date(data.jobDetails.joiningDate).toISOString().split('T')[0] : ''
                },
                salaryStructure: {
                    basic: data.salaryStructure?.basic || 0,
                    allowances: data.salaryStructure?.allowances || 0,
                    deductions: data.salaryStructure?.deductions || 0
                },
                profilePicture: data.profilePicture || '',
                documents: data.documents || [] // using plain text/URL for now
            });
        } catch (err) {
            if (err.response?.status === 404) {
                setError('No profile created yet for this user.');
            } else {
                setError(err.response?.data?.message || 'Failed to fetch profile.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line
    }, [profileId]);

    const handleChange = (section, field, value) => {
        if (section) {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');

        // Build payload conditionally based on role
        let payload = {};
        if (currentRole === 'admin') {
            payload = formData; // send all
        } else {
            // employee allowed fields only
            payload = {
                personalDetails: {
                    address: formData.personalDetails.address,
                    phone: formData.personalDetails.phone
                },
                profilePicture: formData.profilePicture
            };
        }

        try {
            const res = await api.put(`/api/profile/${profileId}`, payload);
            setProfileData(res.data.data);
            setSuccess('Profile updated successfully!');
            setIsEditMode(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Loading profile...</div>;
    }

    if (error && !profileData) {
        return <div style={{ padding: '2rem', color: '#b91c1c' }}>{error}</div>;
    }

    // Determine field disabling logic
    const isEmployee = currentRole !== 'admin';

    const styles = {
        container: { maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: '#1f2937' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
        title: { fontSize: '2rem', fontWeight: 'bold' },
        btnPrimary: { padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        btnSecondary: { padding: '0.5rem 1rem', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '1rem' },
        section: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', border: '1px solid #e5e7eb', marginBottom: '1.5rem' },
        sectionTitle: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
        fieldGroup: { display: 'flex', flexDirection: 'column' },
        label: { fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.25rem' },
        input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.95rem', backgroundColor: isEditMode ? '#fff' : '#f9fafb' },
        disabledInput: { backgroundColor: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' },
        alertSuccess: { padding: '0.75rem', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#166534', marginBottom: '1rem' },
        alertError: { padding: '0.75rem', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '1rem' },
        profilePic: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', display: 'block', marginBottom: '1rem', backgroundColor: '#e5e7eb' }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Employee Profile</h1>
                <div>
                    {!isEmployee && (
                        <button
                            style={{ ...styles.btnPrimary, backgroundColor: '#8b5cf6', marginRight: '1rem' }}
                            onClick={() => navigate(`/admin/payroll/${profileId}`)}
                        >
                            Manage Dedicated Payroll
                        </button>
                    )}
                    {isEditMode ? (
                        <>
                            <button style={styles.btnSecondary} onClick={() => setIsEditMode(false)}>Cancel</button>
                            <button style={styles.btnPrimary} onClick={handleSave}>Save Changes</button>
                        </>
                    ) : (
                        <button style={styles.btnPrimary} onClick={() => { setSuccess(''); setError(''); setIsEditMode(true); }}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </header>

            {success && <div style={styles.alertSuccess}>{success}</div>}
            {error && <div style={styles.alertError}>{error}</div>}

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Profile Picture</div>
                {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" style={styles.profilePic} />
                ) : (
                    <div style={styles.profilePic} />
                )}
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Image URL</label>
                    <input
                        type="text"
                        value={formData.profilePicture}
                        onChange={(e) => handleChange(null, 'profilePicture', e.target.value)}
                        disabled={!isEditMode}
                        style={{ ...styles.input, ...(!isEditMode ? styles.disabledInput : {}) }}
                    />
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Personal Details</div>
                <div style={styles.grid}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            value={formData.personalDetails.name}
                            onChange={(e) => handleChange('personalDetails', 'name', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Date of Birth</label>
                        <input
                            type="date"
                            value={formData.personalDetails.DOB}
                            onChange={(e) => handleChange('personalDetails', 'DOB', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <input
                            type="text"
                            value={formData.personalDetails.phone}
                            onChange={(e) => handleChange('personalDetails', 'phone', e.target.value)}
                            disabled={!isEditMode}
                            style={{ ...styles.input, ...(!isEditMode ? styles.disabledInput : {}) }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Address</label>
                        <input
                            type="text"
                            value={formData.personalDetails.address}
                            onChange={(e) => handleChange('personalDetails', 'address', e.target.value)}
                            disabled={!isEditMode}
                            style={{ ...styles.input, ...(!isEditMode ? styles.disabledInput : {}) }}
                        />
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Job Details</div>
                <div style={styles.grid}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Designation</label>
                        <input
                            type="text"
                            value={formData.jobDetails.designation}
                            onChange={(e) => handleChange('jobDetails', 'designation', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Department</label>
                        <input
                            type="text"
                            value={formData.jobDetails.department}
                            onChange={(e) => handleChange('jobDetails', 'department', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Joining Date</label>
                        <input
                            type="date"
                            value={formData.jobDetails.joiningDate}
                            onChange={(e) => handleChange('jobDetails', 'joiningDate', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Salary Structure</div>
                <div style={styles.grid}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Basic Salary</label>
                        <input
                            type="number"
                            value={formData.salaryStructure.basic}
                            onChange={(e) => handleChange('salaryStructure', 'basic', parseFloat(e.target.value))}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Allowances</label>
                        <input
                            type="number"
                            value={formData.salaryStructure.allowances}
                            onChange={(e) => handleChange('salaryStructure', 'allowances', parseFloat(e.target.value))}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Deductions</label>
                        <input
                            type="number"
                            value={formData.salaryStructure.deductions}
                            onChange={(e) => handleChange('salaryStructure', 'deductions', parseFloat(e.target.value))}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.sectionTitle}>Documents</div>
                <div style={styles.grid}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Document URLs (Comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. https://link-to.pdf"
                            value={formData.documents.map(d => d.fileUrl).join(', ')}
                            onChange={(e) => {
                                const docUrls = e.target.value.split(',').map(url => ({ name: 'Document', fileUrl: url.trim() }));
                                handleChange(null, 'documents', docUrls);
                            }}
                            disabled={!isEditMode || isEmployee}
                            style={{ ...styles.input, ...(!isEditMode || isEmployee ? styles.disabledInput : {}) }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
