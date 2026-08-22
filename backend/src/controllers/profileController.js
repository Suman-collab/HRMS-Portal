import EmployeeProfile from '../models/EmployeeProfile.js';

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params; // this id is the User._id

        // Check authorization: must be admin or the requested user
        if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You can only access your own profile',
            });
        }

        const profile = await EmployeeProfile.findOne({ userId: id }).populate({
            path: 'userId',
            select: 'employeeId email role',
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Employee profile not found for this user',
            });
        }

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Check authorization: must be admin or the requested user
        if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You can only update your own profile',
            });
        }

        let profile = await EmployeeProfile.findOne({ userId: id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Employee profile not found for this user',
            });
        }

        // Role-based field whitelisting
        if (req.user.role === 'admin') {
            // Admins can update any payload fields that correspond to the schema.
            // We will perform a deep merge to preserve existing nested fields if a partial object is sent.
            if (req.body.personalDetails) {
                profile.personalDetails = { ...profile.personalDetails, ...req.body.personalDetails };
            }
            if (req.body.jobDetails) {
                profile.jobDetails = { ...profile.jobDetails, ...req.body.jobDetails };
            }
            if (req.body.salaryStructure) {
                profile.salaryStructure = { ...profile.salaryStructure, ...req.body.salaryStructure };
            }
            if (req.body.documents) {
                profile.documents = req.body.documents;
            }
            if (req.body.profilePicture !== undefined) {
                profile.profilePicture = req.body.profilePicture;
            }
        } else {
            // Employees can only update personalDetails.address, personalDetails.phone, profilePicture
            if (req.body.personalDetails) {
                if (req.body.personalDetails.address !== undefined) {
                    profile.personalDetails.address = req.body.personalDetails.address;
                }
                if (req.body.personalDetails.phone !== undefined) {

                    // Basic phone format validation for employee update (backend schema handles some via mongoose match)
                    const phone = req.body.personalDetails.phone;
                    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
                    if (phone && !phoneRegex.test(phone)) {
                        return res.status(400).json({ success: false, message: 'Invalid phone format' });
                    }

                    profile.personalDetails.phone = req.body.personalDetails.phone;
                }
            }
            if (req.body.profilePicture !== undefined) {
                profile.profilePicture = req.body.profilePicture;
            }
        }

        // Attempt to save (mongoose will run schema validators)
        await profile.save();

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: 'Validation Error: ' + messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server error updating profile' });
    }
};
