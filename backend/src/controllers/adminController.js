import User from '../models/User.js';

/**
 * @desc    Get all employees with pagination
 * @route   GET /api/admin/employees
 * @access  Private/Admin
 */
export const getEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const query = User.find().select('-password');
        const users = await query.skip(startIndex).limit(limit).lean();

        // Also fetch their profiles to have names and designations
        const userIds = users.map(u => u._id);
        const profiles = await import('../models/EmployeeProfile.js').then(m => m.default.find({ userId: { $in: userIds } }).lean());

        const enhancedUsers = users.map(user => {
            const profile = profiles.find(p => p.userId.toString() === user._id.toString());
            return {
                ...user,
                profile: profile ? {
                    name: profile.personalDetails?.name,
                    designation: profile.jobDetails?.designation,
                    department: profile.jobDetails?.department
                } : null
            };
        });

        // Get total count
        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            data: enhancedUsers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching employees:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving employees',
        });
    }
};
