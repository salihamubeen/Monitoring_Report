const CCTVReport = require('../models/CCTVReport');

// @desc    Get all CCTV reports
// @route   GET /api/reports
// @access  Public
const getAllReports = async (req, res) => {
  try {
    const reports = await CCTVReport.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports'
    });
  }
};

// @desc    Get single CCTV report
// @route   GET /api/reports/:id
// @access  Public
const getReportById = async (req, res) => {
  try {
    const report = await CCTVReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report'
    });
  }
};

// @desc    Create new CCTV report
// @route   POST /api/reports
// @access  Public
const createReport = async (req, res) => {
  try {
    const { datetime, location, findings, intensity, images } = req.body;

    // Validate required fields
    if (!datetime || !location || !findings || !intensity) {
      return res.status(400).json({
        success: false,
        error: 'Please provide datetime, location, findings, and intensity'
      });
    }

    const newReport = new CCTVReport({
      datetime,
      location,
      findings,
      intensity,
      images: images || []
    });

    const savedReport = await newReport.save();
    
    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: savedReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create report'
    });
  }
};

// @desc    Update CCTV report
// @route   PUT /api/reports/:id
// @access  Public
const updateReport = async (req, res) => {
  try {
    const { datetime, location, findings, intensity, images } = req.body;

    const updatedReport = await CCTVReport.findByIdAndUpdate(
      req.params.id,
      { datetime, location, findings, intensity, images },
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: updatedReport
    });
  } catch (error) {
    console.error('Error updating report:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update report'
    });
  }
};

// @desc    Delete CCTV report
// @route   DELETE /api/reports/:id
// @access  Public
const deleteReport = async (req, res) => {
  try {
    const deletedReport = await CCTVReport.findByIdAndDelete(req.params.id);
    
    if (!deletedReport) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete report'
    });
  }
};

// @desc    Get reports by location
// @route   GET /api/reports/location/:location
// @access  Public
const getReportsByLocation = async (req, res) => {
  try {
    const reports = await CCTVReport.find({ 
      location: req.params.location 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports by location:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports by location'
    });
  }
};

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getReportsByLocation
}; 