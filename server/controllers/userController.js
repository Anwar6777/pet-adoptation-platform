import AdoptionRequest from '../models/AdoptionRequest.js';
import User from '../models/User.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  address: user.address,
  createdAt: user.createdAt,
});

export const getUsers = async (_request, response, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return response.status(200).json({ users: users.map(publicUser) });
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (request, response, next) => {
  try {
    if (request.user.role !== 'admin' && request.user._id.toString() !== request.params.id) {
      return response.status(403).json({ message: 'You can only access your own profile.' });
    }
    const user = await User.findById(request.params.id);
    if (!user) return response.status(404).json({ message: 'User not found.' });
    return response.status(200).json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (request, response, next) => {
  try {
    if (request.user.role !== 'admin' && request.user._id.toString() !== request.params.id) {
      return response.status(403).json({ message: 'You can only update your own profile.' });
    }

    const updates = {};
    ['name', 'email', 'phone', 'address'].forEach((field) => {
      if (request.body[field] !== undefined) updates[field] = request.body[field];
    });
    if (typeof updates.email === 'string') updates.email = updates.email.trim().toLowerCase();

    const user = await User.findByIdAndUpdate(request.params.id, updates, { new: true, runValidators: true });
    if (!user) return response.status(404).json({ message: 'User not found.' });
    return response.status(200).json({ message: 'Profile updated successfully.', user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (request, response, next) => {
  try {
    if (request.user._id.toString() === request.params.id) {
      return response.status(400).json({ message: 'You cannot delete your own account while logged in as it.' });
    }

    const hasAdoptionHistory = await AdoptionRequest.exists({ user: request.params.id });
    if (hasAdoptionHistory) {
      return response.status(409).json({
        message: 'This user has adoption history and cannot be deleted. Keep the account record to preserve application history.',
      });
    }

    const user = await User.findByIdAndDelete(request.params.id);
    if (!user) return response.status(404).json({ message: 'User not found.' });
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};
