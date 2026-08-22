import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../shared/api/axios';
import { UserCircle, Briefcase, DollarSign, FileText } from 'lucide-react';

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentRole = localStorage.getItem('role') || 'employee';
    const loggedInEmployeeId = localStorage.getItem('employeeId');

    const profileId = id || loggedInEmployeeId;

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        personalDetails: { name: '', DOB: '', phone: '', address: '' },
        jobDetails: { designation: '', department: '', joiningDate: '' },
        salaryStructure: { basic: 0, allowances: 0, deductions: 0 },
        profilePicture: '',
        documents: []
    });

    useEffect(() => {
        if (!profileId) {
            setError('No profile ID found.');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get(`/api/profile/${profileId}`);
                if (response.data.success) {
                    setProfileData(response.data.data);

                    const data = response.data.data;
                    setFormData({
                        personalDetails: data.personalDetails || { name: '', DOB: '', phone: '', address: '' },
                        jobDetails: data.jobDetails || { designation: '', department: '', joiningDate: '' },
                        salaryStructure: data.salaryStructure || { basic: 0, allowances: 0, deductions: 0 },
                        profilePicture: data.profilePicture || '',
                        documents: data.documents || []
                    });
                } else {
                    setError('Failed to fetch profile.');
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('Profile not found.');
                } else {
                    setError('An error occurred while fetching profile.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileId]);

    const handleChange = (section, field, value) => {
        setFormData(prev => {
            if (section) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: value
                    }
                };
            }
            return {
                ...prev,
                [field]: value
            };
        });
    };

    const handleSave = async () => {
        setSuccess('');
        setError('');
        try {
            let url = `/api/profile/${profileId}`;
            // If the user is editing their own profile
            if (profileId === loggedInEmployeeId && currentRole === 'employee') {
                url = `/api/profile`;
            }

            const response = await api.put(url, formData);
            if (response.data.success) {
                setSuccess('Profile updated successfully!');
                setProfileData(response.data.data);
                setIsEditMode(false);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500 font-medium">Loading profile...</div>;
    }

    if (error && !profileData) {
        return <div className="p-8 text-red-600 font-medium">{error}</div>;
    }

    const isEmployee = currentRole !== 'admin';

    const inputClasses = (disabled) => `w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors text-sm ${disabled ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 shadow-sm'}`;

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-6">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employee Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage personal and professional information</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {!isEmployee && (
                        <button
                            className="bg-accent hover:bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                            onClick={() => navigate(`/admin/payroll/${profileId}`)}
                        >
                            Manage Payroll
                        </button>
                    )}
                    {isEditMode ? (
                        <>
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => setIsEditMode(false)}>Cancel</button>
                            <button className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm" onClick={handleSave}>Save Changes</button>
                        </>
                    ) : (
                        <button className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm" onClick={() => { setSuccess(''); setError(''); setIsEditMode(true); }}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </header>

            {success && <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">{success}</div>}
            {error && <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">{error}</div>}

            <section className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <UserCircle size={20} className="text-primary" /> Profile Picture
                </h3>
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {formData.profilePicture ? (
                            <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 font-medium text-xs">No Image</span>
                        )}
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            value={formData.profilePicture}
                            onChange={(e) => handleChange(null, 'profilePicture', e.target.value)}
                            disabled={!isEditMode}
                            className={inputClasses(!isEditMode)}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <UserCircle size={20} className="text-primary" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.personalDetails.name}
                            onChange={(e) => handleChange('personalDetails', 'name', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            className={inputClasses(!isEditMode || isEmployee)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            value={formData.personalDetails.DOB ? formData.personalDetails.DOB.substring(0, 10) : ''}
                            onChange={(e) => handleChange('personalDetails', 'DOB', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            className={inputClasses(!isEditMode || isEmployee)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            value={formData.personalDetails.phone}
                            onChange={(e) => handleChange('personalDetails', 'phone', e.target.value)}
                            disabled={!isEditMode}
                            className={inputClasses(!isEditMode)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            value={formData.personalDetails.address}
                            onChange={(e) => handleChange('personalDetails', 'address', e.target.value)}
                            disabled={!isEditMode}
                            className={inputClasses(!isEditMode)}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Briefcase size={20} className="text-primary" /> Job Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                        <input
                            type="text"
                            value={formData.jobDetails.designation}
                            onChange={(e) => handleChange('jobDetails', 'designation', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            className={inputClasses(!isEditMode || isEmployee)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                        <input
                            type="text"
                            value={formData.jobDetails.department}
                            onChange={(e) => handleChange('jobDetails', 'department', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            className={inputClasses(!isEditMode || isEmployee)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Joining Date</label>
                        <input
                            type="date"
                            value={formData.jobDetails.joiningDate ? formData.jobDetails.joiningDate.substring(0, 10) : ''}
                            onChange={(e) => handleChange('jobDetails', 'joiningDate', e.target.value)}
                            disabled={!isEditMode || isEmployee}
                            className={inputClasses(!isEditMode || isEmployee)}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <DollarSign size={20} className="text-primary" /> Salary Structure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Basic Salary</label>
                        <input
                            type="number"
                            value={formData.salaryStructure.basic}
                            onChange={(e) => handleChange('salaryStructure', 'basic', parseFloat(e.target.value) || 0)}
                            disabled={!isEditMode || isEmployee}
                            className={inputClasses(!isEditMode || isEmployee)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Allowances</label>
                        <input
                            type="number"
                            value={formData.salaryStructure.allowances}
                            onChange={(e) => handleChange('salaryStructure', 'allowances', parseFloat(e.target.value) || 0)}
                            disabled={!isEditMode || isEmployee}
                            className={inputClasses(!isEditMode || isEmployee)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Deductions</label>
                        <input
                            type="number"
                            value={formData.salaryStructure.deductions}
                            onChange={(e) => handleChange('salaryStructure', 'deductions', parseFloat(e.target.value) || 0)}
                            disabled={!isEditMode || isEmployee}
                            className={inputClasses(!isEditMode || isEmployee)}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-surface rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <FileText size={20} className="text-primary" /> Documents
                </h3>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Document URLs (Comma separated)</label>
                    <input
                        type="text"
                        placeholder="https://link-to.pdf, https://another-link"
                        value={formData.documents ? formData.documents.map(d => d.fileUrl).join(', ') : ''}
                        onChange={(e) => {
                            const docUrls = e.target.value.split(',').filter(u => u.trim() !== '').map(url => ({ name: 'Document', fileUrl: url.trim() }));
                            handleChange(null, 'documents', docUrls);
                        }}
                        disabled={!isEditMode || isEmployee}
                        className={inputClasses(!isEditMode || isEmployee)}
                    />
                </div>
            </section>
        </div>
    );
}
