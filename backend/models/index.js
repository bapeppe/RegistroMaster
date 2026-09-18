const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['admin', 'instructor'], required: true },
  password: { type: String } // optional, only for admin
});
const User = mongoose.model('User', userSchema);

// Student Model
const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  birthYear: { type: Number }
});
const Student = mongoose.model('Student', studentSchema);

// Course Model
const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  level: { type: String, required: true },
  schedule_days: { type: String, required: true },
  time: { type: String, required: true },
  primary_instructor_id: { type: String, required: true }
});
const Course = mongoose.model('Course', courseSchema);

// Enrollment Model
const enrollmentSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  course_id: { type: String, required: true }
});
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// Attendance Model
const attendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  course_id: { type: String, required: true },
  student_id: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ['present', 'absent'], required: true },
  recorded_by_instructor_id: { type: String, required: true }
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Substitution Model
const substitutionSchema = new mongoose.Schema({
  course_id: { type: String, required: true },
  date: { type: String, required: true },
  substitute_instructor_id: { type: String, required: true }
});
const Substitution = mongoose.model('Substitution', substitutionSchema);

module.exports = {
  User,
  Student,
  Course,
  Enrollment,
  Attendance,
  Substitution
};
