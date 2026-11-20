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
  let reservedPetId;
  try {
    const { petId } = request.body;
    if (!petId) return response.status(400).json({ message: 'Please choose a pet to adopt.' });

    const existingRequest = await AdoptionRequest.findOne({
      user: request.user._id,
      pet: petId,
      status: 'Pending',
    });
    if (existingRequest) {
      return response.status(409).json({ message: 'You have already submitted an application for this pet.' });
    }

    // Atomically reserve only an Available pet. A read-then-save check allows
    // two simultaneous applicants to reserve the same pet.
    const pet = await Pet.findOneAndUpdate(
      { _id: petId, status: 'Available' },
      { $set: { status: 'Pending' } },
      { new: true, runValidators: true },
    );

    if (!pet) {
      const exists = await Pet.exists({ _id: petId });
      return response.status(exists ? 409 : 404).json({
        message: exists
          ? 'This pet is no longer available for applications.'
          : 'Pet not found.',
      });
    }
    reservedPetId = pet._id;

    const adoption = await AdoptionRequest.create(
      applicationPayload(request.body, request.user._id, petId),
    );

    return response.status(201).json({
      message: 'Your adoption request has been submitted successfully.',
      adoption,
      pet,
    });
  } catch (error) {
    // If validation or persistence fails after reservation, release the pet.
    if (reservedPetId) {
      try {
        await Pet.findOneAndUpdate(
          { _id: reservedPetId, status: 'Pending' },
          { $set: { status: 'Available' } },
        );
      } catch (rollbackError) {
        console.error('Failed to release pet after adoption request error:', rollbackError);
      }
    }
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

    const adoption = await AdoptionRequest.findOneAndUpdate(
      { _id: request.params.id, status: 'Pending' },
      { $set: { status } },
      { new: true, runValidators: true },
    );
    if (!adoption) {
      const exists = await AdoptionRequest.exists({ _id: request.params.id });
      return response.status(exists ? 409 : 404).json({
        message: exists ? 'This adoption request has already been reviewed.' : 'Adoption request not found.',
      });
    }

    const petStatus = status === 'Approved' ? 'Adopted' : 'Available';
    const pet = await Pet.findOneAndUpdate(
      { _id: adoption.pet, status: 'Pending' },
      { $set: { status: petStatus } },
      { new: true },
    );

    if (!pet) {
      // Restore the request if its pet could not be transitioned.
      await AdoptionRequest.findOneAndUpdate(
        { _id: adoption._id, status },
        { $set: { status: 'Pending' } },
      );
      return response.status(409).json({ message: 'The pet status changed. Refresh the request and try again.' });
    }

    const updatedAdoption = await AdoptionRequest.findById(adoption._id)
      .populate('user', 'name email phone')
      .populate('pet', 'name breed species image location status');
    return response.status(200).json({
      message: `Adoption request ${status.toLowerCase()}.`,
      adoption: updatedAdoption,
    });
  } catch (error) {
    return next(error);
  }
};

export const cancelAdoptionRequest = async (request, response, next) => {
  try {
    const adoption = await AdoptionRequest.findOneAndDelete({
      _id: request.params.id,
      user: request.user._id,
      status: 'Pending',
    });

    if (!adoption) {
      const exists = await AdoptionRequest.exists({
        _id: request.params.id,
        user: request.user._id,
      });
      return response.status(exists ? 409 : 404).json({
        message: exists
          ? 'Only pending requests can be cancelled.'
          : 'Adoption request not found.',
      });
    }

    await Pet.findOneAndUpdate(
      { _id: adoption.pet, status: 'Pending' },
      { $set: { status: 'Available' } },
    );
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};
