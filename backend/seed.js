const mongoose = require('mongoose');
const { User, Student, Course, Enrollment, Attendance, Substitution } = require('./models');

const MONGO_URI = 'mongodb://127.0.0.1:27017/master-piscine';

const mockUsers = [
  { id: 'u1', name: 'Mario Rossi', email: 'admin@masterpiscine.it', role: 'admin', password: 'admin' },
  { id: 'u2', name: 'Luigi Bianchi', email: 'luigi@masterpiscine.it', role: 'instructor' },
  { id: 'u3', name: 'Giulia Verdi', email: 'giulia@masterpiscine.it', role: 'instructor' }
];

const mockStudents = [
  { id: 's1', name: 'Alessandro Neri' },
  { id: 's2', name: 'Beatrice Gialli' },
  { id: 's3', name: 'Carlo Marroni' },
  { id: 's4', name: 'Diana Blu' }
];

const mockCourses = [
  { id: 'c1', name: 'Corso Principianti 1', level: 'Principianti', schedule_days: 'Lunedì-Giovedì', time: '16:00 - 17:00', primary_instructor_id: 'u2' },
  { id: 'c2', name: 'Corso Avanzato', level: 'Avanzato', schedule_days: 'Martedì-Venerdì', time: '17:30 - 18:30', primary_instructor_id: 'u3' }
];

const mockEnrollments = [
  { student_id: 's1', course_id: 'c1' },
  { student_id: 's2', course_id: 'c1' },
  { student_id: 's3', course_id: 'c2' },
  { student_id: 's4', course_id: 'c2' }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // Clear existing
    await User.deleteMany({});
    await Student.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Attendance.deleteMany({});
    await Substitution.deleteMany({});
    console.log('Cleared existing data.');

    // Insert mock data
    await User.insertMany(mockUsers);
    await Student.insertMany(mockStudents);
    await Course.insertMany(mockCourses);
    await Enrollment.insertMany(mockEnrollments);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
