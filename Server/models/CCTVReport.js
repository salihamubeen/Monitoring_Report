const mongoose = require('mongoose');

// Define Schema for CCTV Reports
const cctvReportSchema = new mongoose.Schema({
  datetime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    enum: [
      'Narowal',
      'Baddomalhi',
      'Talwandi Bhindran',
      'Dhamthal',
      'Pasroor',
      'Qila Ahmadabad',
      'Chawinda',
      'Daska',
      'Sambrial',
      'Ugoki',
      'Shakargarh',
      'Kanjroor',
      'Laar Adda',
      'MDA',
      'Bilal Chowk',
      'Mumtazabad',
      'Muzaffargarh',
      'Rohilanwali',
      'Chishtian',
      'Khanewal',
      'Bahawalnagar'
    ]
  },
  findings: {
    type: String,
    required: true
  },
  intensity: {
    type: String,
    required: true
  },
  images: [{
    type: String // Store image URLs or base64 strings
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
cctvReportSchema.index({ createdAt: -1 });
cctvReportSchema.index({ location: 1 });

// Create and export the model
const CCTVReport = mongoose.model('CCTVReport', cctvReportSchema);

module.exports = CCTVReport; 