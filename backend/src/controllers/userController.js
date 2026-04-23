const { validationResult } = require('express-validator');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * GET /api/users
 * List all users (admin only)
 */
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    ApiResponse.paginated(
      res,
      users,
      {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
      },
      'Users retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/role
 * Update user role (admin only)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      return ApiResponse.error(res, 'Role must be either admin or user', 400);
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user._id.toString()) {
      return ApiResponse.error(res, 'You cannot change your own role', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    ApiResponse.success(res, user, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, updateUserRole };
