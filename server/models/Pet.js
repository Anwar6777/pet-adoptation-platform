import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Pet name is required.'], trim: true, maxlength: [50, 'Pet name cannot exceed 50 characters.'] },
    species: { type: String, required: [true, 'Species is required.'], enum: ['Dog', 'Cat', 'Rabbit', 'Other'] },
    breed: { type: String, required: [true, 'Breed is required.'], trim: true, maxlength: [80, 'Breed cannot exceed 80 characters.'] },
    age: { type: Number, required: [true, 'Age is required.'], min: [0, 'Age cannot be negative.'], max: [30, 'Age must be realistic.'] },
    gender: { type: String, required: [true, 'Gender is required.'], enum: ['Male', 'Female'] },
    description: { type: String, required: [true, 'Description is required.'], trim: true, maxlength: [1000, 'Description cannot exceed 1000 characters.'] },
    personality: { type: [String], default: [] },
    location: { type: String, required: [true, 'Location is required.'], trim: true, maxlength: [80, 'Location cannot exceed 80 characters.'] },
    image: { type: String, required: [true, 'An image URL is required.'], trim: true, match: [/^https?:\/\//, 'Image must be a valid URL.'] },
    vaccinated: { type: Boolean, default: false },
    status: { type: String, enum: ['Available', 'Pending', 'Adopted'], default: 'Available' },
  },
  { timestamps: true },
);

petSchema.index({ species: 1, location: 1, status: 1 });

export default mongoose.model('Pet', petSchema);
