import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required.'], trim: true, maxlength: [60, 'Name cannot exceed 60 characters.'] },
    email: { type: String, required: [true, 'Email is required.'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'] },
    password: { type: String, required: [true, 'Password is required.'], minlength: [6, 'Password must contain at least 6 characters.'], select: false },
    phone: { type: String, trim: true, maxlength: [20, 'Phone number cannot exceed 20 characters.'] },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: { type: String, trim: true, maxlength: [200, 'Address cannot exceed 200 characters.'] },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
