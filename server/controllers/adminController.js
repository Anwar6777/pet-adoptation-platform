import AdoptionRequest from '../models/AdoptionRequest.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';

export const getDashboardSummary = async (_request, response, next) => {
  try {
    const [totalPets, availablePets, adoptedPets, pendingRequests, totalUsers, recentRequests] = await Promise.all([
      Pet.countDocuments(),
      Pet.countDocuments({ status: 'Available' }),
      Pet.countDocuments({ status: 'Adopted' }),
      AdoptionRequest.countDocuments({ status: 'Pending' }),
      User.countDocuments(),
      AdoptionRequest.find().populate('user', 'name email').populate('pet', 'name image').sort({ createdAt: -1 }).limit(5),
    ]);
    return response.status(200).json({ stats: { totalPets, availablePets, adoptedPets, pendingRequests, totalUsers }, recentRequests });
  } catch (error) {
    return next(error);
  }
};
