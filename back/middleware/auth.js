import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify session exists and is active
    const session = await Session.findOne({
      sessionId: decoded.sessionId,
      userId: decoded.userId,
      isActive: true
    });

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Update last activity
    session.lastActivity = new Date();
    await session.save();

    req.userId = decoded.userId;
    req.sessionId = decoded.sessionId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export { JWT_SECRET };

