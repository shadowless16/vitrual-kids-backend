const Result = require('../models/Result');
const User = require('../models/User');
const Test = require('../models/Test');

exports.getTeacherAnalytics = async (req, res) => {
  try {
    // 1. Get tests created by this teacher
    const teacherTests = await Test.find({ createdBy: req.user.userId }).select('_id');
    const testIds = teacherTests.map(t => t._id);

    // 2. Filter results by those tests
    const results = await Result.find({ testId: { $in: testIds } }).populate('testId studentId');
    
    // Aggregate data for teacher
    const stats = {
      classAverage: 0,
      totalSubmissions: results.length,
      activeLearners: new Set(results.map(r => r.studentId?._id.toString())).size,
      subjectBreakdown: {},
      topPerformers: []
    };

    if (results.length > 0) {
      const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
      stats.classAverage = Math.round(totalScore / results.length);

      // Subject breakdown
      results.forEach(r => {
        const subject = r.testId?.subject || 'Other';
        if (!stats.subjectBreakdown[subject]) {
          stats.subjectBreakdown[subject] = { total: 0, count: 0 };
        }
        stats.subjectBreakdown[subject].total += r.score;
        stats.subjectBreakdown[subject].count += 1;
      });

      // Format subject breakdown
      Object.keys(stats.subjectBreakdown).forEach(s => {
        stats.subjectBreakdown[s] = Math.round(stats.subjectBreakdown[s].total / stats.subjectBreakdown[s].count);
      });

      // Top Performers calculation (simplified)
      const studentMap = {};
      results.forEach(r => {
        const studentId = r.studentId?._id;
        if (!studentId) return;
        if (!studentMap[studentId]) {
          studentMap[studentId] = { name: r.studentId.name, total: 0, count: 0 };
        }
        studentMap[studentId].total += r.score;
        studentMap[studentId].count += 1;
      });

      stats.topPerformers = Object.values(studentMap)
        .map(s => ({ name: s.name, avg: Math.round(s.total / s.count) }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 5);
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const teachers = await User.countDocuments({ role: 'teacher' });
    const tests = await Test.countDocuments();
    
    res.json({
      totalUsers,
      students,
      teachers,
      totalTests: tests,
      status: 'Healthy'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
