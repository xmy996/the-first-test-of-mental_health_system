const mongoose = require('mongoose');

const AssessmentRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  score: {
    type: Number,
    required: [true, 'Please add a score'],
    min: [0, 'Score must be at least 0']
  },
  maxScore: {
    type: Number,
    required: [true, 'Please add a maximum score']
  },
  percentage: {
    type: Number,
    required: [true, 'Please add a percentage'],
    min: [0, 'Percentage must be at least 0'],
    max: [100, 'Percentage must be at most 100']
  },
  result: {
    type: String,
    required: [true, 'Please add a result interpretation']
  },
  recommendations: {
    type: [String],
    required: [true, 'Please add recommendations']
  },
  answers: [
    {
      question: String,
      selectedOption: String,
      score: Number
    }
  ],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// 添加复合索引以确保用户不会重复完成同一测评
AssessmentRecordSchema.index({ user: 1, assessment: 1 }, { unique: true });

module.exports = mongoose.model('AssessmentRecordSchema', AssessmentRecordSchema);
