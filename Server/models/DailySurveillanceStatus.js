const mongoose = require('mongoose');

const dailySurveillanceStatusSchema = new mongoose.Schema({
  date: {
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
  openingTime: {
    type: String,
    required: true
  },
  closingTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  totalCameras: {
    type: Number,
    required: true
  },
  workingCameras: {
    type: Number,
    required: true
  },
  nonWorkingCameras: {
    type: Number,
    required: true
  },
  totalDaysRecorded: {
    type: Number,
    required: true
  },
  remarks: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

dailySurveillanceStatusSchema.index({ createdAt: -1 });

const DailySurveillanceStatus = mongoose.model('DailySurveillanceStatus', dailySurveillanceStatusSchema);

module.exports = DailySurveillanceStatus; 