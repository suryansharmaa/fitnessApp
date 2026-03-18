import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  exercises: [{
    name: String,
    sets: String,
    reps: String
  }],
  createdAt: { type: Date, default: Date.now }
});

export const WorkoutGroup = mongoose.model('Workout', workoutSchema);
