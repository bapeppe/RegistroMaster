import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Users, Save } from 'lucide-react';
import type { AttendanceStatus } from '../../types';

export function InstructorDashboard() {
  const currentUser = useStore(state => state.currentUser);
  const courses = useStore(state => state.courses);
  const students = useStore(state => state.students);
  const enrollments = useStore(state => state.enrollments);
  const recordAttendance = useStore(state => state.recordAttendance);
  const substitutions = useStore(state => state.substitutions);
  const attendances = useStore(state => state.attendances);

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [localAttendance, setLocalAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [savedMessage, setSavedMessage] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  const myCourses = courses.filter(course => {
    const isPrimary = course.primary_instructor_id === currentUser?.id;
    const subRecord = substitutions.find(s => s.course_id === course.id && s.date === today);
    const isSubstitute = subRecord?.substitute_instructor_id === currentUser?.id;
    const isReplaced = subRecord && subRecord.substitute_instructor_id !== currentUser?.id;
    
    return (isPrimary && !isReplaced) || isSubstitute;
  });

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    setSavedMessage(false);
    
    const existing = attendances.filter(a => a.course_id === courseId && a.date === today);
    const initialRecord: Record<string, AttendanceStatus> = {};
    existing.forEach(a => {
      initialRecord[a.student_id] = a.status;
    });
    setLocalAttendance(initialRecord);
  };

  const toggleAttendance = (studentId: string, status: AttendanceStatus) => {
    setLocalAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (!selectedCourse || !currentUser) return;

    Object.entries(localAttendance).forEach(([studentId, status]) => {
      recordAttendance({
        id: Math.random().toString(36).substr(2, 9),
        course_id: selectedCourse,
        student_id: studentId,
        date: today,
        status: status,
        recorded_by_instructor_id: currentUser.id
      });
    });

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  if (!selectedCourse) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">I Tuoi Corsi di Oggi</h1>
        <p className="text-brand-blue font-medium mb-6 bg-blue-50 inline-block px-3 py-1 rounded-full">{format(new Date(), 'dd/MM/yyyy')}</p>
        
        {myCourses.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
            <p className="text-gray-500">Non hai corsi assegnati per oggi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {myCourses.map(course => (
              <button
                key={course.id}
                onClick={() => handleSelectCourse(course.id)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-brand-blue hover:shadow-md transition-all text-left flex justify-between items-center group"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors">{course.name}</h3>
                  <p className="text-gray-500 mt-1">{course.time} • {course.level}</p>
                </div>
                <div className="bg-blue-50 text-brand-blue p-3 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  <Users size={24} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const activeCourse = courses.find(c => c.id === selectedCourse);
  const enrolledStudents = students.filter(s => 
    enrollments.some(e => e.course_id === selectedCourse && e.student_id === s.id)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28">
      <button 
        onClick={() => setSelectedCourse(null)}
        className="text-brand-blue hover:underline mb-2 inline-block font-medium"
      >
        &larr; Torna ai corsi
      </button>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 bg-gradient-to-r from-brand-blue to-blue-800 text-white">
        <h1 className="text-2xl font-bold">{activeCourse?.name}</h1>
        <p className="text-blue-100 mt-1">Appello del {format(new Date(), 'dd/MM/yyyy')} • {activeCourse?.time}</p>
      </div>

      <div className="space-y-3">
        {enrolledStudents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nessun allievo iscritto a questo corso.</p>
        ) : (
          enrolledStudents.map(student => {
            const status = localAttendance[student.id];
            
            return (
              <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-lg text-gray-900">{student.name}</span>
                  {student.birthYear && (
                    <span className="bg-gray-200 text-gray-700 text-xs font-bold px-1.5 py-0.5 rounded">
                      {student.birthYear.toString().slice(-2)}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleAttendance(student.id, 'present')}
                    className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${status === 'present' ? 'bg-green-500 text-white shadow-inner scale-105' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}
                  >
                    <CheckCircle size={32} />
                  </button>
                  <button
                    onClick={() => toggleAttendance(student.id, 'absent')}
                    className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${status === 'absent' ? 'bg-red-500 text-white shadow-inner scale-105' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'}`}
                  >
                    <XCircle size={32} />
                  </button>
                </div>
              </div>
            );
          })
        )}

        <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Aggiungi nuovo allievo al corso</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              placeholder="Nome Cognome" 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
              id="new-student-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value.trim();
                  const yearInput = document.getElementById('new-student-year') as HTMLInputElement;
                  const yearVal = yearInput?.value ? parseInt(yearInput.value) : undefined;
                  if (val && selectedCourse) {
                    useStore.getState().addNewStudentToCourse(val, selectedCourse, yearVal);
                    e.currentTarget.value = '';
                    if (yearInput) yearInput.value = '';
                  }
                }
              }}
            />
            <input 
              type="number" 
              placeholder="Anno (es. 2022)" 
              className="w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
              id="new-student-year"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const nameInput = document.getElementById('new-student-input') as HTMLInputElement;
                  const val = nameInput?.value.trim();
                  const yearVal = e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined;
                  if (val && selectedCourse) {
                    useStore.getState().addNewStudentToCourse(val, selectedCourse, yearVal);
                    if (nameInput) nameInput.value = '';
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
            <button 
              onClick={() => {
                const input = document.getElementById('new-student-input') as HTMLInputElement;
                const yearInput = document.getElementById('new-student-year') as HTMLInputElement;
                const val = input?.value.trim();
                const yearVal = yearInput?.value ? parseInt(yearInput.value) : undefined;
                if (val && selectedCourse) {
                  useStore.getState().addNewStudentToCourse(val, selectedCourse, yearVal);
                  if (input) input.value = '';
                  if (yearInput) yearInput.value = '';
                }
              }}
              className="bg-brand-blue text-white w-full sm:w-auto px-4 py-2 rounded-lg font-bold hover:bg-blue-900 transition-colors whitespace-nowrap"
            >
              Aggiungi
            </button>
          </div>
        </div>
      </div>

      {enrolledStudents.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-10 flex flex-col items-center">
           {savedMessage && (
             <div className="mb-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-1 rounded-full animate-pulse">
               Presenze salvate con successo!
             </div>
           )}
           <button
             onClick={handleSave}
             className="w-full max-w-3xl bg-brand-blue hover:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2 text-lg active:scale-[0.98]"
           >
             <Save size={24} />
             Salva Presenze
           </button>
        </div>
      )}
    </div>
  );
}
