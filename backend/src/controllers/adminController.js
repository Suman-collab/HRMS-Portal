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

        const query = User.find().select('employeeId email role isVerified');

        // Execute query with pagination
        const users = await query.skip(startIndex).limit(limit).lean();

        // Get total count
        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            data: users,
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
