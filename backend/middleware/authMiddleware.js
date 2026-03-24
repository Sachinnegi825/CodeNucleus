import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies.jwt; // Read from httpOnly cookie

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, orgId }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};