const express = require('express');
const { check, validationResult } = require('express-validator');
const Assessment = require('../models/Assessment');
const AssessmentRecord = require('../models/AssessmentRecord');

const router = express.Router();

// @desc    Get all assessments
// @route   GET /api/v1/assessments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const assessments = await assessment.find();

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single assessment
// @route   GET /api/v1/assessments/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const assessment = await assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new assessment
// @route   POST /api/v1/assessments
// @access  Private/Admin
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('duration', 'Duration is required').isInt({ min: 1 }),
    check('questions', 'At least one question is required').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Add createdBy field
      req.body.createdBy = req.user.id;

      const assessment = await assessment.create(req.body);

      res.status(201).json({
        success: true,
        data: assessment
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
);

// @desc    Update assessment
// @route   PUT /api/v1/assessments/:id
// @access  Private/Admin
router.put(
  '/:id',
  [
    check('title', 'Title is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('category', 'Category is required').optional().not().isEmpty(),
    check('duration', 'Duration must be at least 1 minute').optional().isInt({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let assessment = await assessment.findById(req.params.id);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: 'assessment not found'
        });
      }

      // Make sure user is assessment creator
      if (assessment.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this assessment'
        });
      }

      assessment = await assessment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        success: true,
        data: assessment
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
);

// @desc    Delete assessment
// @route   DELETE /api/v1/assessments/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const assessment = await assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'assessment not found'
      });
    }

    // Make sure user is assessment creator
    if (assessment.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this assessment'
      });
    }

    await assessment.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Submit assessment results
// @route   POST /api/v1/assessments/:id/submit
// @access  Private
router.post(
  '/:id/submit',
  [
    check('answers', 'Answers are required').isArray({ min: 1 }),
    check('answers.*.question', 'Question is required').not().isEmpty(),
    check('answers.*.selectedOption', 'Selected option is required').not().isEmpty(),
    check('answers.*.score', 'Score is required').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const assessment = await assessment.findById(req.params.id);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: 'assessment not found'
        });
      }

      // Calculate total score
      let totalScore = 0;
      let maxScore = 0;

      req.body.answers.forEach(answer => {
        totalScore += answer.score;
        
        // Find the question to get max possible score
        const question = assessment.questions.find(q => q.question === answer.question);
        if (question) {
          maxScore += Math.max(...question.scores);
        }
      });

      // Calculate percentage
      const percentage = Math.round((totalScore / maxScore) * 100);

      // Generate result interpretation based on percentage
      let result = '';
      let recommendations = [];

      if (assessment.category === 'depression') {
        if (percentage < 30) {
          result = '轻度抑郁症状';
          recommendations = [
            '保持规律的生活作息',
            '增加社交活动',
            '适当的体育锻炼',
            '学习放松技巧'
          ];
        } else if (percentage < 60) {
          result = '中度抑郁症状';
          recommendations = [
            '寻求心理咨询师的帮助',
            '参加支持小组',
            '保持健康的生活方式',
            '学习应对压力的技巧'
          ];
        } else {
          result = '重度抑郁症状';
          recommendations = [
            '尽快寻求专业心理咨询或精神科医生的帮助',
            '考虑药物治疗',
            '建立支持系统',
            '避免独处，保持社交接触'
          ];
        }
      } else if (assessment.category === 'anxiety') {
        if (percentage < 30) {
          result = '轻度焦虑症状';
          recommendations = [
            '学习深呼吸和放松技巧',
            '保持规律的体育锻炼',
            '改善睡眠质量',
            '减少咖啡因摄入'
          ];
        } else if (percentage < 60) {
          result = '中度焦虑症状';
          recommendations = [
            '寻求心理咨询师的帮助',
            '学习认知行为疗法技巧',
            '练习正念冥想',
            '建立健康的应对机制'
          ];
        } else {
          result = '重度焦虑症状';
          recommendations = [
            '尽快寻求专业心理咨询或精神科医生的帮助',
            '考虑药物治疗',
            '学习焦虑管理技巧',
            '避免触发焦虑的情境'
          ];
        }
      } else if (assessment.category === 'stress') {
        if (percentage < 30) {
          result = '轻度压力水平';
          recommendations = [
            '保持工作与生活的平衡',
            '学习时间管理技巧',
            '增加休闲活动',
            '保持社交支持'
          ];
        } else if (percentage < 60) {
          result = '中度压力水平';
          recommendations = [
            '寻求心理咨询师的帮助',
            '学习压力管理技巧',
            '改善工作环境',
            '增加放松活动'
          ];
        } else {
          result = '重度压力水平';
          recommendations = [
            '尽快寻求专业心理咨询师的帮助',
            '考虑工作调整或休息',
            '学习压力管理和放松技巧',
            '改善生活方式'
          ];
        }
      } else {
        // Default result for other categories
        if (percentage < 30) {
          result = '健康状态';
          recommendations = [
            '保持健康的生活方式',
            '定期进行自我评估',
            '学习压力管理技巧',
            '保持社交支持'
          ];
        } else if (percentage < 60) {
          result = '轻度问题';
          recommendations = [
            '寻求心理咨询师的帮助',
            '学习相关的自我帮助技巧',
            '改善生活方式',
            '增加社交支持'
          ];
        } else {
          result = '需要关注的问题';
          recommendations = [
            '尽快寻求专业心理咨询师的帮助',
            '考虑专业治疗',
            '建立支持系统',
            '学习相关的自我帮助技巧'
          ];
        }
      }

      // Create assessment record
      const assessmentRecord = await AssessmentRecord.create({
        user: req.user.id,
        assessment: req.params.id,
        score: totalScore,
        maxScore,
        percentage,
        result,
        recommendations,
        answers: req.body.answers
      });

      res.status(201).json({
        success: true,
        data: assessmentRecord
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  }
);

// @desc    Get user assessment records
// @route   GET /api/v1/assessments/records
// @access  Private
router.get('/records', async (req, res) => {
  try {
    const records = await AssessmentRecord.find({ user: req.user.id }).populate('assessment', 'title category');

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user assessment record for specific assessment
// @route   GET /api/v1/assessments/:id/record
// @access  Private
router.get('/:id/record', async (req, res) => {
  try {
    const record = await AssessmentRecord.findOne({
      user: req.user.id,
      assessment: req.params.id
    }).populate('assessment', 'title category description');

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'No record found for this assessment'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
