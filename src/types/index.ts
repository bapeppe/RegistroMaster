export type Role = 'admin' | 'instructor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
}

export interface Student {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  level: string;
  schedule_days: string; // e.g., "Mon-Thu", "Tue-Fri"
  time: string; // e.g., "16:00 - 17:00"
  primary_instructor_id: string;
}

export interface Enrollment {
  student_id: string;
  course_id: string;
}

export type AttendanceStatus = 'present' | 'absent';

export interface Attendance {
  id: string;
  course_id: string;
  student_id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  recorded_by_instructor_id: string;
}

export interface Substitution {
  course_id: string;
  date: string; // YYYY-MM-DD
  substitute_instructor_id: string;
}
