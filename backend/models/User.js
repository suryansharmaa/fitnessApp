import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'User' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dailyGoal: { type: Number, default: 650 }, // kcal
  dailyBurn: { type: Number, default: 0 },
  workoutGoalTime: { type: Number, default: 90 }, // minutes
  workoutActualTime: { type: Number, default: 0 },
  heatmapData: {
    type: [[Number]],
    default: () => Array.from({ length: 7 }, () => Array(12).fill(0))
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
