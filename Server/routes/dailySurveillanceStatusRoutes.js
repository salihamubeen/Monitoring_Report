const express = require('express');
const router = express.Router();
const {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus
} = require('../controllers/dailySurveillanceStatusController');

// Base route: /api/daily-surveillance

// GET all statuses
router.get('/', getAllStatuses);

// GET single status by ID
router.get('/:id', getStatusById);

// POST create new status
router.post('/', createStatus);

// PUT update status
router.put('/:id', updateStatus);

// DELETE status
router.delete('/:id', deleteStatus);

module.exports = router; 