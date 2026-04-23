const { validationResult } = require('express-validator');
const Contract = require('../models/Contract');
const ApiResponse = require('../utils/apiResponse');

/**
 * POST /api/contracts
 * Create a new contract
 */
const createContract = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, description, parties, startDate, endDate, status } = req.body;

    const contract = await Contract.create({
      title,
      description,
      parties,
      startDate,
      endDate,
      status: status || 'Draft',
      createdBy: req.user._id,
      activityLog: [
        {
          action: 'CREATED',
          performedBy: req.user._id,
          details: `Contract "${title}" created`,
        },
      ],
    });

    await contract.populate('createdBy', 'name email');

    ApiResponse.created(res, contract, 'Contract created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contracts
 * List contracts with search, filter, sort, pagination
 */
const getContracts = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const {
      page = 1,
      limit = 10,
      search,
      status,
      startDateFrom,
      startDateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build filter query
    const filter = { isDeleted: false };

    // Search by title or party name
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { parties: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by date range
    if (startDateFrom || startDateTo) {
      filter.startDate = {};
      if (startDateFrom) filter.startDate.$gte = new Date(startDateFrom);
      if (startDateTo) filter.startDate.$lte = new Date(startDateTo);
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [contracts, total] = await Promise.all([
      Contract.find(filter)
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-versions -activityLog'),
      Contract.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    ApiResponse.paginated(
      res,
      contracts,
      {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      'Contracts retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contracts/:id
 * Get a single contract with full details
 */
const getContractById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const contract = await Contract.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate('createdBy', 'name email')
      .populate('activityLog.performedBy', 'name email')
      .populate('versions.modifiedBy', 'name email');

    if (!contract) {
      return ApiResponse.error(res, 'Contract not found', 404);
    }

    ApiResponse.success(res, contract, 'Contract retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/contracts/:id
 * Update a contract (creates version snapshot before update)
 */
const updateContract = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const contract = await Contract.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!contract) {
      return ApiResponse.error(res, 'Contract not found', 404);
    }

    // Check ownership or admin role
    if (
      contract.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return ApiResponse.error(
        res,
        'Not authorized to update this contract',
        403
      );
    }

    const { title, description, parties, startDate, endDate, status, changeNote } =
      req.body;

    // Validate status transition if status is being changed
    if (status && status !== contract.status) {
      if (!contract.canTransitionTo(status)) {
        return ApiResponse.error(
          res,
          `Invalid status transition from '${contract.status}' to '${status}'. Allowed transitions: ${
            {
              Draft: ['Active'],
              Active: ['Executed', 'Expired'],
              Executed: ['Expired'],
              Expired: [],
            }[contract.status]?.join(', ') || 'none'
          }`,
          400
        );
      }
    }

    // Validate end date
    const newStartDate = startDate ? new Date(startDate) : contract.startDate;
    const newEndDate = endDate ? new Date(endDate) : contract.endDate;
    if (newEndDate <= newStartDate) {
      return ApiResponse.error(res, 'End date must be after start date', 400);
    }

    // Create version snapshot before update
    contract.createVersionSnapshot(req.user._id, changeNote || '');

    // Apply updates
    if (title) contract.title = title;
    if (description) contract.description = description;
    if (parties) contract.parties = parties;
    if (startDate) contract.startDate = startDate;
    if (endDate) contract.endDate = endDate;

    // Handle status change
    if (status && status !== contract.status) {
      const oldStatus = contract.status;
      contract.status = status;
      contract.addActivityLog(
        'STATUS_CHANGED',
        req.user._id,
        `Status changed from '${oldStatus}' to '${status}'`
      );
    }

    // Add general update activity log
    contract.addActivityLog(
      'UPDATED',
      req.user._id,
      changeNote || 'Contract updated'
    );

    await contract.save();
    await contract.populate('createdBy', 'name email');

    ApiResponse.success(res, contract, 'Contract updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/contracts/:id
 * Soft delete a contract
 */
const deleteContract = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const contract = await Contract.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!contract) {
      return ApiResponse.error(res, 'Contract not found', 404);
    }

    // Check ownership or admin role
    if (
      contract.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return ApiResponse.error(
        res,
        'Not authorized to delete this contract',
        403
      );
    }

    // Soft delete
    contract.softDelete(req.user._id);
    await contract.save();

    ApiResponse.success(res, null, 'Contract deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contracts/:id/versions
 * Get version history of a contract
 */
const getVersions = async (req, res, next) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .select('title versions')
      .populate('versions.modifiedBy', 'name email');

    if (!contract) {
      return ApiResponse.error(res, 'Contract not found', 404);
    }

    // Return versions in reverse chronological order
    const versions = [...contract.versions].reverse();

    ApiResponse.success(
      res,
      { contractTitle: contract.title, versions },
      'Version history retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contracts/:id/versions/:versionId
 * Get a specific version of a contract
 */
const getVersionById = async (req, res, next) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate('versions.modifiedBy', 'name email');

    if (!contract) {
      return ApiResponse.error(res, 'Contract not found', 404);
    }

    const version = contract.versions.id(req.params.versionId);
    if (!version) {
      return ApiResponse.error(res, 'Version not found', 404);
    }

    ApiResponse.success(res, version, 'Version retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
  getVersions,
  getVersionById,
};
