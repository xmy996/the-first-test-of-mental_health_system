const mongoose = require('mongoose');

const ConsultantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialty: {
    type: [String],
    required: [true, 'Please add specialties'],
    enum: ['depression', 'anxiety', 'stress', 'relationship', 'family', 'child', 'adolescent', 'addiction', 'trauma', 'other']
  },
  education: {
    type: String,
    required: [true, 'Please add education background']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    min: [0, 'Experience cannot be negative']
  },
  certification: {
    type: [String],
    required: [true, 'Please add certifications']
  },
  introduction: {
    type: String,
    required: [true, 'Please add an introduction'],
    trim: true
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add a consultation fee'],
    min: [0, 'Fee cannot be negative']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating must be at most 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      timeSlots: [
        {
          startTime: {
            type: String,
            required: true
          },
          endTime: {
            type: String,
            required: true
          },
          isAvailable: {
            type: Boolean,
            default: true
          }
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consultant', ConsultantSchema);
