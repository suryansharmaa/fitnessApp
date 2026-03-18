import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { WorkoutGroup } from "./models/Workout.js";
import { User } from "./models/User.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fitnessApp";
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// 🔑 REPLACE THESE WITH YOUR ACTUAL RAPIDAPI KEY
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "YOUR_ACTUAL_RAPIDAPI_KEY_HERE";
const EXERCISE_HOST = "exercisedb.p.rapidapi.com";

// --- AUTHENTICATION ENDPOINTS ---
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// --- USER PROGRESS ENDPOINT ---
app.get("/api/user/progress", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // In a real app, heatmapData would be updated daily based on workouts completed.
    // For this demo, let's keep the real structure fetched from DB.
    res.json({
      dailyGoal: user.dailyGoal,
      dailyBurn: user.dailyBurn,
      workoutGoalTime: user.workoutGoalTime,
      workoutActualTime: user.workoutActualTime,
      heatmapData: user.heatmapData
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
});

// --- Helper: Fetch Exercise Data ---
async function fetchData(endpoint) {
  const response = await fetch(`https://${EXERCISE_HOST}${endpoint}`, {
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": EXERCISE_HOST,
    },
  });
  if (!response.ok) throw new Error("RapidAPI Fetch failed");
  return response.json();
}

async function fetchExerciseImage(exerciseId) {
  const params = new URLSearchParams({ resolution: "180", exerciseId });
  const response = await fetch(`https://${EXERCISE_HOST}/image?${params}`, {
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": EXERCISE_HOST,
    },
  });
  if (!response.ok) throw new Error("Image fetch failed");
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/gif;base64,${base64}`;
}

// --- Route: Get Exercises (With Static Fallback) ---
app.get("/exercises", async (req, res) => {
  const { bodyPart } = req.query;
  if (!bodyPart) return res.status(400).json({ error: "Please provide a bodyPart query" });

  try {
    const exercisesData = await fetchData(`/exercises/bodyPart/${bodyPart}`);
    const exercises = [];
    for (let i = 0; i < Math.min(8, exercisesData.length); i++) {
      const ex = exercisesData[i];
      try {
        const gifUrl = await fetchExerciseImage(ex.id);
        exercises.push({ name: ex.name, bodyPart: ex.bodyPart, equipment: ex.equipment, gifUrl });
      } catch (e) {
        exercises.push({ name: ex.name, bodyPart: ex.bodyPart, equipment: ex.equipment, gifUrl: 'https://via.placeholder.com/180?text=Workout+Animation' });
      }
    }
    res.json({ exercises });
  } catch (err) {
    console.log("RapidAPI failed or key missing. Returning static fallback data.");
    // Massive static fallback data ensuring the library always works
    const staticData = Array.from({ length: 8 }).map((_, i) => ({
      name: `${bodyPart} Master Move ${i + 1}`,
      bodyPart: bodyPart,
      equipment: ['body weight', 'dumbbell', 'barbell', 'cable'][i % 4],
      gifUrl: 'https://via.placeholder.com/180/18181b/aa3bff?text=No+API+Key'
    }));
    res.json({ exercises: staticData });
  }
});

// --- Route: Smart Planner Algorithm ---
app.post("/api/planner", auth, async (req, res) => {
  const { goal, equipment } = req.body;
  const userId = req.user.userId;
  if (!goal || !equipment) return res.status(400).json({ error: "Goal and equipment are required." });

  try {
    let planTitle = goal === 'muscle' ? 'Hypertrophy Matrix' : 'Fat Burn Matrix';
    let duration = '45 mins';
    let exercises = [];

    if (goal === 'muscle') {
      if (equipment === 'yes') {
        exercises = [
          { name: 'Barbell Squats', sets: '3', reps: '10' },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '12' },
          { name: 'Pull-ups', sets: '3', reps: 'To Failure' },
          { name: 'Bulgarian Split Squats', sets: '2', reps: '12 / leg' },
          { name: 'Cable Crunches', sets: '3', reps: '15' }
        ];
      } else {
        exercises = [
          { name: 'Pistol Squat Progressions', sets: '3', reps: '8 / leg' },
          { name: 'Decline Push-ups', sets: '3', reps: '15' },
          { name: 'Inverted Rows (if possible)', sets: '3', reps: '12' },
          { name: 'Pike Push-ups', sets: '3', reps: '10' },
          { name: 'V-Ups', sets: '3', reps: '20' }
        ];
      }
    } else {
      duration = '35 mins';
      planTitle = equipment === 'yes' ? 'HIIT Weighted Burn' : 'Bodyweight Shred';
      if (equipment === 'yes') {
        exercises = [
          { name: 'Dumbbell Thrusters', sets: '4', reps: '45s work / 15s rest' },
          { name: 'Kettlebell Swings', sets: '4', reps: '45s work / 15s rest' },
          { name: 'Burpee Over Bar', sets: '4', reps: '45s work / 15s rest' },
          { name: 'Box Jumps', sets: '4', reps: '45s work / 15s rest' }
        ];
      } else {
        exercises = [
          { name: 'Burpees', sets: '5', reps: '1 min work / 30s rest' },
          { name: 'Mountain Climbers', sets: '5', reps: '1 min work / 30s rest' },
          { name: 'Jump Squats', sets: '5', reps: '1 min work / 30s rest' },
          { name: 'High Knees', sets: '5', reps: '1 min work / 30s rest' }
        ];
      }
    }

    const newWorkout = new WorkoutGroup({ title: planTitle, duration, exercises, userId });
    await newWorkout.save();

    res.json(newWorkout);
  } catch (err) {
    res.status(500).json({ error: "Algorithm synthesis failed" });
  }
});

// --- Route: Get User Workouts History ---
app.get("/api/user/workouts", auth, async (req, res) => {
  try {
    const workouts = await WorkoutGroup.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// --- Route: Mark Workout Complete & Update Stats ---
app.post("/api/user/workouts/:id/complete", auth, async (req, res) => {
  try {
    const workout = await WorkoutGroup.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!workout) return res.status(404).json({ error: "Workout not found" });
    if (workout.completed) return res.status(400).json({ error: "Already completed" });

    workout.completed = true;
    await workout.save();

    // Dynamically update user dashboard stats (Calculate ~10 kcal/min roughly)
    const user = await User.findById(req.user.userId);
    const durationMins = parseInt(workout.duration) || 45;
    
    user.workoutActualTime += durationMins;
    user.dailyBurn += durationMins * 10;
    
    // Increment the current day's heatmap level (0 to 3 max)
    const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 0=Mon, 6=Sun
    const currentWeekIndex = 11; // Displaying last 12 weeks, current is the last column
    
    if (user.heatmapData[currentDayIndex]) {
      const currentLevel = user.heatmapData[currentDayIndex][currentWeekIndex];
      user.heatmapData[currentDayIndex][currentWeekIndex] = Math.min(3, currentLevel + 1);
      user.markModified('heatmapData'); // Required for nested arrays in Mongoose
    }

    await user.save();

    res.json({ success: true, workout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to complete workout" });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
