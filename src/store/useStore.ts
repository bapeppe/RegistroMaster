import { create } from 'zustand';
import type { User, Student, Course, Enrollment, Attendance, Substitution } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface StoreState {
  // State
  currentUser: User | null;
  users: User[];
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  attendances: Attendance[];
  substitutions: Substitution[];
  isLoading: boolean;

  // Actions
  fetchInitialData: () => Promise<void>;
  login: (id: string) => void;
  logout: () => void;
  
  // Admin Actions
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  
  addStudent: (student: Student) => void;
  addNewStudentToCourse: (name: string, course_id: string) => Promise<void>;
  enrollStudent: (student_id: string, course_id: string) => void;
  unenrollStudent: (student_id: string, course_id: string) => void;
  removeStudentFromCourse: (student_id: string, course_id: string) => Promise<void>;
  
  addUser: (user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  
  // Instructor Actions
  recordAttendance: (attendance: Attendance) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  currentUser: null,
  users: [],
  students: [],
  courses: [],
  enrollments: [],
  attendances: [],
  substitutions: [],
  isLoading: true,

  fetchInitialData: async () => {
    try {
      const [users, students, courses, enrollments, attendances, substitutions] = await Promise.all([
        fetch(`${API_URL}/users`).then(res => res.json()),
        fetch(`${API_URL}/students`).then(res => res.json()),
        fetch(`${API_URL}/courses`).then(res => res.json()),
        fetch(`${API_URL}/enrollments`).then(res => res.json()),
        fetch(`${API_URL}/attendances`).then(res => res.json()),
        fetch(`${API_URL}/substitutions`).then(res => res.json())
      ]);

      set({
        users,
        students,
        courses,
        enrollments,
        attendances,
        substitutions,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      set({ isLoading: false });
    }
  },

  login: (id) => set((state) => ({ 
    currentUser: state.users.find(u => u.id === id) || null 
  })),
  logout: () => set({ currentUser: null }),
  
  addCourse: async (course) => {
    // Optimistic UI update
    set((state) => ({ courses: [...state.courses, course] }));
    try {
      await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  },
  
  updateCourse: async (course) => {
    // Optimistic UI update
    set((state) => ({
      courses: state.courses.map(c => c.id === course.id ? course : c)
    }));
    try {
      await fetch(`${API_URL}/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  },
  
  deleteCourse: async (id) => {
    // Optimistic UI update
    set((state) => ({
      courses: state.courses.filter(c => c.id !== id),
      enrollments: state.enrollments.filter(e => e.course_id !== id)
    }));
    try {
      await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  },
  
  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
  addNewStudentToCourse: async (name, course_id) => {
    const newStudentId = 's' + Math.random().toString(36).substr(2, 9);
    
    // Optimistic UI update
    set((state) => ({
      students: [...state.students, { id: newStudentId, name }],
      enrollments: [...state.enrollments, { student_id: newStudentId, course_id }]
    }));

    try {
      // 1. Create student in DB
      await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newStudentId, name })
      });

      // 2. Create enrollment in DB
      await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: newStudentId, course_id })
      });
    } catch (error) {
      console.error('Failed to add new student to course in DB:', error);
    }
  },
  enrollStudent: (student_id, course_id) => set((state) => ({
    enrollments: [...state.enrollments, { student_id, course_id }]
  })),
  unenrollStudent: (student_id, course_id) => set((state) => ({
    enrollments: state.enrollments.filter(e => !(e.student_id === student_id && e.course_id === course_id))
  })),
  removeStudentFromCourse: async (student_id, course_id) => {
    // Optimistic UI update
    set((state) => ({
      enrollments: state.enrollments.filter(e => !(e.student_id === student_id && e.course_id === course_id))
    }));
    
    try {
      await fetch(`${API_URL}/enrollments/${course_id}/${student_id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to remove student from course in DB:', error);
    }
  },
  
  addUser: async (user) => {
    set((state) => ({ users: [...state.users, user] }));
    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } catch (error) {
      console.error('Failed to add user to DB:', error);
    }
  },
  deleteUser: async (id) => {
    set((state) => ({ users: state.users.filter(u => u.id !== id) }));
    try {
      await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete user from DB:', error);
    }
  },
  
  deleteStudent: async (id) => {
    set((state) => ({ 
      students: state.students.filter(s => s.id !== id),
      enrollments: state.enrollments.filter(e => e.student_id !== id)
    }));
    try {
      await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete student from DB:', error);
    }
  },
  
  recordAttendance: async (attendance) => {
    // Ottimistic UI update
    set((state) => {
      const filtered = state.attendances.filter(a => 
        !(a.course_id === attendance.course_id && a.student_id === attendance.student_id && a.date === attendance.date)
      );
      return { attendances: [...filtered, attendance] };
    });

    try {
      await fetch(`${API_URL}/attendances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendance)
      });
    } catch (error) {
      console.error('Failed to save attendance to DB:', error);
      // In a real app we might revert the optimistic update here
    }
  },
}));
