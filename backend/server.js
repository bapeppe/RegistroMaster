require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { User, Student, Course, Enrollment, Attendance, Substitution } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/master-piscine';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Ping per Cron Job ---
app.get('/ping', (req, res) => {
  res.status(200).send('Backend attivo');
});

// --- Users ---
app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.deleteOne({ id: req.params.id });
    // Note: in a real system we might clean up courses/attendances linked to this instructor
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- Students ---
app.get('/api/students', async (req, res) => {
  const students = await Student.find({});
  res.json(students);
});

app.post('/api/students', async (req, res) => {
  const { id, name } = req.body;
  try {
    const newStudent = await Student.create({ id, name });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.deleteOne({ id: req.params.id });
    await Enrollment.deleteMany({ student_id: req.params.id }); // Clean up enrollments
    // also clean up attendances if needed
    await Attendance.deleteMany({ student_id: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// --- Courses ---
app.get('/api/courses', async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

app.post('/api/courses', async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.deleteOne({ id: req.params.id });
    await Enrollment.deleteMany({ course_id: req.params.id }); // Also delete enrollments
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// --- Enrollments ---
app.get('/api/enrollments', async (req, res) => {
  const enrollments = await Enrollment.find({});
  res.json(enrollments);
});

app.post('/api/enrollments', async (req, res) => {
  const { student_id, course_id } = req.body;
  try {
    const newEnrollment = await Enrollment.create({ student_id, course_id });
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

app.delete('/api/enrollments/:course_id/:student_id', async (req, res) => {
  try {
    await Enrollment.deleteOne({ course_id: req.params.course_id, student_id: req.params.student_id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
});

// --- Substitutions ---
app.get('/api/substitutions', async (req, res) => {
  const substitutions = await Substitution.find({});
  res.json(substitutions);
});

// --- Attendances ---
app.get('/api/attendances', async (req, res) => {
  const attendances = await Attendance.find({});
  res.json(attendances);
});

app.post('/api/attendances', async (req, res) => {
  const { id, course_id, student_id, date, status, recorded_by_instructor_id } = req.body;
  
  try {
    // Upsert logic based on course, student, date
    const updated = await Attendance.findOneAndUpdate(
      { course_id, student_id, date },
      { id, status, recorded_by_instructor_id },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
