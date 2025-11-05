const mongoose = require('mongoose');

const AssessmentQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Please add options'],
    validate: {
      validator: function(v) {
        return v.length >= 2;
      },
      message: 'At least two options are required'
    }
  },
  scores: {
    type: [Number],
    required: [true, 'Please add scores'],
    validate: {
      validator: function(v) {
        return v.length === this.options.length;
      },
      message: 'Scores must match the number of options'
    }
  }
});

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['depression', 'anxiety', 'stress', 'personality', 'relationship', 'other'],
    default: 'other'
  },
  duration: {
    type: Number,
    required: [true, 'Please add an estimated duration in minutes']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  questions: [assessmentQuestionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
