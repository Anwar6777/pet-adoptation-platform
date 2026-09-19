import AdoptionRequest from '../models/AdoptionRequest.js';
import Pet from '../models/Pet.js';

const applicationPayload = (body, userId, petId) => ({
  user: userId,
  pet: petId,
  fullName: body.fullName,
  email: body.email,
  phone: body.phone,
  address: body.address,
  city: body.city,
  housingType: body.housingType,
  previousPetExperience: body.previousPetExperience,
  reason: body.reason,
  contactMethod: body.contactMethod,
});

export const createAdoptionRequest = async (request, response, next) => {
  try {
    const { petId } = request.body;
    if (!petId) return response.status(400).json({ message: 'Please choose a pet to adopt.' });

    const pet = await Pet.findById(petId);
    if (!pet) return response.status(404).json({ message: 'Pet not found.' });
    if (pet.status === 'Adopted') return response.status(400).json({ message: 'This pet has already been adopted.' });
    if (pet.status === 'Pending') return response.status(400).json({ message: 'An adoption request for this pet is already under review.' });

    const existingRequest = await AdoptionRequest.findOne({ user: request.user._id, pet: petId, status: 'Pending' });
    if (existingRequest) return response.status(400).json({ message: 'You have already submitted an application for this pet.' });

    const adoption = await AdoptionRequest.create(applicationPayload(request.body, request.user._id, petId));
    pet.status = 'Pending';
    await pet.save();

    return response.status(201).json({ message: 'Your adoption request has been submitted successfully.', adoption, pet });
  } catch (error) {
    return next(error);
  }
};

export const getMyAdoptionRequests = async (request, response, next) => {
  try {
    const adoptions = await AdoptionRequest.find({ user: request.user._id }).populate('pet').sort({ createdAt: -1 });
    return response.status(200).json({ adoptions });
  } catch (error) {
    return next(error);
  }
};

export const getAllAdoptionRequests = async (_request, response, next) => {
  try {
    const adoptions = await AdoptionRequest.find()
      .populate('user', 'name email phone')
      .populate('pet', 'name breed species image location status')
      .sort({ createdAt: -1 });
    return response.status(200).json({ adoptions });
  } catch (error) {
    return next(error);
  }
};

export const updateAdoptionStatus = async (request, response, next) => {
  try {
    const { status } = request.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return response.status(400).json({ message: 'Status must be Approved or Rejected.' });
    }

    const adoption = await AdoptionRequest.findById(request.params.id);
    if (!adoption) return response.status(404).json({ message: 'Adoption request not found.' });
    if (adoption.status !== 'Pending') return response.status(400).json({ message: 'This adoption request has already been reviewed.' });

    adoption.status = status;
    await adoption.save();
    await Pet.findByIdAndUpdate(adoption.pet, { status: status === 'Approved' ? 'Adopted' : 'Available' });

    const updatedAdoption = await AdoptionRequest.findById(adoption._id).populate('user', 'name email phone').populate('pet', 'name breed species image location status');
    return response.status(200).json({ message: `Adoption request ${status.toLowerCase()}.`, adoption: updatedAdoption });
  } catch (error) {
    return next(error);
  }
};

export const cancelAdoptionRequest = async (request, response, next) => {
  try {
    const adoption = await AdoptionRequest.findOne({ _id: request.params.id, user: request.user._id });
    if (!adoption) return response.status(404).json({ message: 'Adoption request not found.' });
    if (adoption.status !== 'Pending') return response.status(400).json({ message: 'Only pending requests can be cancelled.' });

    await Pet.findByIdAndUpdate(adoption.pet, { status: 'Available' });
    await adoption.deleteOne();
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};
