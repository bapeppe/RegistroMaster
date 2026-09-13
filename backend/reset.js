const mongoose = require('mongoose');
const { User, Student, Course, Enrollment, Attendance, Substitution } = require('./models');

const MONGO_URI = 'mongodb://127.0.0.1:27017/master-piscine';

const adminUser = { 
  id: 'u1', 
  name: 'Mario Rossi', 
  email: 'admin@masterpiscine.it', 
  role: 'admin', 
  password: 'admin' 
};

async function reset() {
  try {
    console.log('Connecting to MongoDB per il reset totale...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // Clear all existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await Attendance.deleteMany({});
    await Substitution.deleteMany({});
    console.log('Database SVUOTATO completamente (tutte le collezioni azzerate).');

    // Re-insert only the Admin user
    await User.create(adminUser);
    console.log('Utente Admin (Mario Rossi) ricreato per permettere il login.');

    console.log('RESET COMPLETATO CON SUCCESSO!');
  } catch (error) {
    console.error('Errore durante il reset:', error);
  } finally {
    mongoose.connection.close();
  }
}

reset();
