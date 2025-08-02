const DailySurveillanceStatus = require('../models/DailySurveillanceStatus');

// @desc    Get all daily surveillance status entries
// @route   GET /api/daily-surveillance
// @access  Public
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await DailySurveillanceStatus.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: statuses.length,
      data: statuses
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch statuses' });
  }
};

// @desc    Get single status by ID
// @route   GET /api/daily-surveillance/:id
// @access  Public
const getStatusById = async (req, res) => {
  try {
    const status = await DailySurveillanceStatus.findById(req.params.id);
    if (!status) {
      return res.status(404).json({ success: false, error: 'Status not found' });
    }
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch status' });
  }
};

// @desc    Create new daily surveillance status
// @route   POST /api/daily-surveillance
// @access  Public
const createStatus = async (req, res) => {
  try {
    const {
      date,
      location,
      openingTime,
      closingTime,
      status,
      totalCameras,
      workingCameras,
      nonWorkingCameras,
      totalDaysRecorded,
      remarks
    } = req.body;

    if (!date || !location || !openingTime || !closingTime || !status || totalCameras == null || workingCameras == null || nonWorkingCameras == null || totalDaysRecorded == null) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const newStatus = new DailySurveillanceStatus({
      date,
      location,
      openingTime,
      closingTime,
      status,
      totalCameras,
      workingCameras,
      nonWorkingCameras,
      totalDaysRecorded,
      remarks
    });

    const savedStatus = await newStatus.save();
    res.status(201).json({ success: true, message: 'Status created successfully', data: savedStatus });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: 'Failed to create status' });
  }
};

// @desc    Update daily surveillance status
// @route   PUT /api/daily-surveillance/:id
// @access  Public
const updateStatus = async (req, res) => {
  try {
    const {
      date,
      location,
      openingTime,
      closingTime,
      status,
      totalCameras,
      workingCameras,
      nonWorkingCameras,
      totalDaysRecorded,
      remarks
    } = req.body;

    const updatedStatus = await DailySurveillanceStatus.findByIdAndUpdate(
      req.params.id,
      { date, location, openingTime, closingTime, status, totalCameras, workingCameras, nonWorkingCameras, totalDaysRecorded, remarks },
      { new: true, runValidators: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({ success: false, error: 'Status not found' });
    }

    res.status(200).json({ success: true, message: 'Status updated successfully', data: updatedStatus });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
};

// @desc    Delete daily surveillance status
// @route   DELETE /api/daily-surveillance/:id
// @access  Public
const deleteStatus = async (req, res) => {
  try {
    const deletedStatus = await DailySurveillanceStatus.findByIdAndDelete(req.params.id);
    if (!deletedStatus) {
      return res.status(404).json({ success: false, error: 'Status not found' });
    }
    res.status(200).json({ success: true, message: 'Status deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete status' });
  }
};

module.exports = {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus
}; 