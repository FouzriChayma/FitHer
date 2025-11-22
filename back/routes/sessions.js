import express from 'express';
import Session from '../models/Session.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all active sessions for current user
router.get('/active', authenticate, async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.userId,
      isActive: true
    })
    .sort({ lastActivity: -1 })
    .lean();

    res.json(sessions.map(session => ({
      sessionId: session.sessionId,
      userId: session.userId.toString(),
      loginTime: session.loginTime,
      lastActivity: session.lastActivity,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      isCurrent: session.sessionId === req.sessionId
    })));
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// End a specific session
router.post('/end/:sessionId', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Only allow ending own sessions
    const session = await Session.findOne({
      sessionId,
      userId: req.userId
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Note: Allow ending current session too (for logout)
    // But handle it differently if needed

    session.isActive = false;
    await session.save();

    res.json({ success: true, message: 'Session ended successfully' });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

