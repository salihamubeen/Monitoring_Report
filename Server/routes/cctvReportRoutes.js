const express = require('express');
const router = express.Router();
const {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getReportsByLocation
} = require('../controllers/cctvReportController');

// Base route: /api/reports

// GET all reports
router.get('/', getAllReports);

// GET reports by location
router.get('/location/:location', getReportsByLocation);

// GET single report by ID
router.get('/:id', getReportById);

// POST create new report
router.post('/', createReport);

// PUT update report
router.put('/:id', updateReport);

// DELETE report
router.delete('/:id', deleteReport);

module.exports = router; 