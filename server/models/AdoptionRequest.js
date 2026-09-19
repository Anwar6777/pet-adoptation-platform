import mongoose from 'mongoose';

const adoptionRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    fullName: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'] },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    address: { type: String, required: true, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 60 },
    housingType: { type: String, required: true, enum: ['Apartment', 'Independent House', 'Farmhouse', 'Other'] },
    previousPetExperience: { type: Boolean, required: true },
    reason: { type: String, required: true, trim: true, minlength: [20, 'Please provide at least 20 characters explaining why you want to adopt.'], maxlength: [1000, 'Reason cannot exceed 1000 characters.'] },
    contactMethod: { type: String, required: true, enum: ['Phone', 'Email'] },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true },
);

// Only one pending application is allowed for the same user and pet.
adoptionRequestSchema.index({ user: 1, pet: 1 }, { unique: true, partialFilterExpression: { status: 'Pending' } });

export default mongoose.model('AdoptionRequest', adoptionRequestSchema);
