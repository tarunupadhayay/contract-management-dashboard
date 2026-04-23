const express = require('express');
const router = express.Router();
const {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
  getVersions,
  getVersionById,
} = require('../controllers/contractController');
const { authenticate } = require('../middleware/auth');
const {
  createContractValidation,
  updateContractValidation,
  mongoIdValidation,
  contractListValidation,
} = require('../middleware/validate');

// All routes require authentication
router.use(authenticate);

// Contract CRUD
router.post('/', createContractValidation, createContract);
router.get('/', contractListValidation, getContracts);
router.get('/:id', mongoIdValidation, getContractById);
router.put('/:id', [...mongoIdValidation, ...updateContractValidation], updateContract);
router.delete('/:id', mongoIdValidation, deleteContract);

// Version history
router.get('/:id/versions', mongoIdValidation, getVersions);
router.get('/:id/versions/:versionId', getVersionById);

module.exports = router;
