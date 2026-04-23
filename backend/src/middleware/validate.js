const { body, param, query } = require('express-validator');

const signupValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const createContractValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('parties')
    .isArray({ min: 1 })
    .withMessage('At least one party is required'),
  body('parties.*')
    .trim()
    .notEmpty()
    .withMessage('Party name cannot be empty'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('status')
    .optional()
    .isIn(['Draft', 'Active', 'Executed', 'Expired'])
    .withMessage('Invalid status value'),
];

const updateContractValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  body('parties')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one party is required'),
  body('parties.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Party name cannot be empty'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('status')
    .optional()
    .isIn(['Draft', 'Active', 'Executed', 'Expired'])
    .withMessage('Invalid status value'),
  body('changeNote')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Change note cannot exceed 500 characters'),
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

const contractListValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['Draft', 'Active', 'Executed', 'Expired'])
    .withMessage('Invalid status filter'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'startDate', 'endDate'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

module.exports = {
  signupValidation,
  loginValidation,
  createContractValidation,
  updateContractValidation,
  mongoIdValidation,
  contractListValidation,
};
