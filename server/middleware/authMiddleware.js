import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (request, response, next) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication is required.' });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return response.status(401).json({ message: 'The account linked to this token no longer exists.' });
    }

    request.user = user;
    return next();
  } catch (_error) {
    return response.status(401).json({ message: 'Your session is invalid or has expired. Please log in again.' });
  }
};

export const adminOnly = (request, response, next) => {
  if (request.user?.role !== 'admin') {
    return response.status(403).json({ message: 'Administrator access is required.' });
  }

  return next();
};
