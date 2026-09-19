import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  address: user.address,
  createdAt: user.createdAt,
});

export const register = async (request, response, next) => {
  try {
    const { name, email, password, phone, address } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return response.status(400).json({ message: 'Password must contain at least 6 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return response.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, password: hashedPassword, phone, address });
    const token = generateToken(user._id.toString());

    return response.status(201).json({ message: 'Account created successfully.', token, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    const passwordMatches = user && await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return response.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id.toString());
    return response.status(200).json({ message: 'Login successful.', token, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (request, response) => {
  response.status(200).json({ user: publicUser(request.user) });
};

export const changePassword = async (request, response, next) => {
  try {
    const { currentPassword, newPassword } = request.body;

    if (!currentPassword || !newPassword) {
      return response.status(400).json({ message: 'Current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return response.status(400).json({ message: 'New password must contain at least 6 characters.' });
    }

    const user = await User.findById(request.user._id).select('+password');
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
      return response.status(401).json({ message: 'Your current password is incorrect.' });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return response.status(400).json({ message: 'New password must be different from your current password.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return response.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    return next(error);
  }
};
