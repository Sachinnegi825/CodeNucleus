import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.cookies.accessToken; // Updated to use accessToken cookie

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and organization to check status
    const user = await User.findById(decoded.userId)
      .populate('organizationId', 'status')
      .select('status organizationId');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
      return res.status(403).json({ message: 'Your account is suspended. Access denied.' });
    }

    if (user.organizationId && user.organizationId.status === 'suspended') {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
      return res.status(403).json({ message: 'Your organization is suspended. Access denied.' });
    }

    req.user = decoded; // { userId, role, orgId }
    next();

  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};