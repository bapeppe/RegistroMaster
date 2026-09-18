import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { Calendar, Users, Activity, ChevronLeft, ChevronRight, Clock, User, Search } from 'lucide-react';

export function AdminDashboard() {
  const courses = useStore(state => state.courses);
  const users = useStore(state => state.users);
  const students = useStore(state => state.students);
  const attendances = useStore(state => state.attendances);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const instructors = users.filter(u => u.role === 'instructor');

  // Reset selected date when changing course
  useEffect(() => {
    setSelectedDate(null);
  }, [selectedCourseId]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  
  // All attendances for this course, sorted newest first
  const courseAttendances = selectedCourseId 
    ? attendances.filter(a => a.course_id === selectedCourseId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Get unique dates where attendance was taken
  const uniqueDates = Array.from(new Set(courseAttendances.map(a => a.date)));

  // Auto-select the most recent date if available
  useEffect(() => {
    if (!selectedDate && uniqueDates.length > 0) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  // Filter the attendances for the currently selected date
  const dateAttendances = courseAttendances.filter(a => a.date === selectedDate);

  // Filter for student search
  const filteredStudents = studentSearchQuery.trim() === '' 
    ? [] 
    : students.filter(s => s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()));

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentAttendances = selectedStudentId
    ? attendances.filter(a => a.student_id === selectedStudentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Coordinatore</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
          <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Corsi Attivi</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Totale Iscritti</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
        </div>
        
        <div className="col-span-2 md:col-span-1 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start sm:justify-start justify-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg flex-shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Istruttori Registrati</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{instructors.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {selectedCourseId ? (
          /* Dettaglio Corso Selezionato */
          <div>
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
              <button 
                onClick={() => setSelectedCourseId(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Torna alla lista corsi"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedCourse?.name}</h2>
                <p className="text-sm text-gray-500">Storico Presenze</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Form Aggiunta Allievo */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-700">Aggiungi Allievo</h3>
                    <p className="text-xs text-gray-500">Iscrivi rapidamente un nuovo studente a questo corso</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                    <input 
                      type="text" 
                      placeholder="Nome Cognome" 
                      className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                      id="admin-new-student-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = e.currentTarget.value.trim();
                          const yearInput = document.getElementById('admin-new-student-year') as HTMLInputElement;
                          const yearVal = yearInput?.value ? parseInt(yearInput.value) : undefined;
                          if (val && selectedCourseId) {
                            useStore.getState().addNewStudentToCourse(val, selectedCourseId, yearVal);
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
                      id="admin-new-student-year"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const nameInput = document.getElementById('admin-new-student-input') as HTMLInputElement;
                          const val = nameInput?.value.trim();
                          const yearVal = e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined;
                          if (val && selectedCourseId) {
                            useStore.getState().addNewStudentToCourse(val, selectedCourseId, yearVal);
                            if (nameInput) nameInput.value = '';
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('admin-new-student-input') as HTMLInputElement;
                        const yearInput = document.getElementById('admin-new-student-year') as HTMLInputElement;
                        const val = input?.value.trim();
                        const yearVal = yearInput?.value ? parseInt(yearInput.value) : undefined;
                        if (val && selectedCourseId) {
                          useStore.getState().addNewStudentToCourse(val, selectedCourseId, yearVal);
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

                {courseAttendances.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nessuna presenza registrata per questo corso.</p>
                ) : (
                  <div className="space-y-6">
                    {/* Selettore della data */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="font-semibold text-gray-700">Seleziona data appello:</label>
                      <select
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue bg-white"
                        value={selectedDate || ''}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      >
                        {uniqueDates.map(date => (
                          <option key={date} value={date}>
                            {format(new Date(date), 'dd/MM/yyyy')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tabella presenze per la data selezionata */}
                    <div className="overflow-x-auto border border-gray-100 rounded-lg">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Studente</th>
                            <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Stato</th>
                            <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Registrato da</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {dateAttendances.map(a => {
                            const student = students.find(s => s.id === a.student_id);
                            const instructor = users.find(u => u.id === a.recorded_by_instructor_id);
                            
                            return (
                              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                                  <div className="flex items-center gap-2">
                                    <span>{student?.name || 'Utente rimosso'}</span>
                                    {student?.birthYear && (
                                      <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        {student.birthYear}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-sm">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    a.status === 'present' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {a.status === 'present' ? 'Presente' : 'Assente'}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-500">
                                  {instructor?.name || '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : selectedStudentId ? (
          /* Dettaglio Allievo Selezionato */
          <div>
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
              <button 
                onClick={() => setSelectedStudentId(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Torna alla dashboard"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedStudent?.name}</h2>
                <p className="text-sm text-gray-500">Storico Completo Presenze</p>
              </div>
            </div>
            
            <div className="p-6">
              {studentAttendances.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Nessuna presenza registrata per questo allievo.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Data</th>
                        <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Corso</th>
                        <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Stato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {studentAttendances.map(a => {
                        const course = courses.find(c => c.id === a.course_id);
                        return (
                          <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-sm font-medium text-gray-900">
                              {format(new Date(a.date), 'dd/MM/yyyy')}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700">
                              {course?.name || 'Corso rimosso'}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                a.status === 'present' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {a.status === 'present' ? 'Presente' : 'Assente'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Lista Corsi e Ricerca */
          <div className="flex flex-col h-full bg-white">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Seleziona un Corso</h2>
                <p className="text-sm text-gray-500 mt-1">Scegli un corso per visualizzare il registro presenze</p>
              </div>
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Cerca allievo..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue bg-white shadow-sm"
                />
                {filteredStudents.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                    <ul className="py-1">
                      {filteredStudents.map(student => (
                        <li 
                          key={student.id}
                          onClick={() => {
                            setSelectedStudentId(student.id);
                            setStudentSearchQuery('');
                          }}
                          className="px-4 py-2 hover:bg-brand-blue hover:text-white cursor-pointer text-sm text-gray-700 transition-colors"
                        >
                          {student.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 sm:p-6 bg-gray-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map(course => {
                  const instructor = users.find(u => u.id === course.primary_instructor_id);
                  return (
                    <div 
                      key={course.id} 
                      onClick={() => setSelectedCourseId(course.id)}
                      className="bg-white p-5 rounded-xl border border-gray-100 hover:border-brand-blue/30 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors text-lg leading-tight pr-4">{course.name}</h3>
                          <div className="p-1.5 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors shrink-0">
                            <ChevronRight size={18} className="text-gray-400 group-hover:text-brand-blue" />
                          </div>
                        </div>
                        <div className="mb-4">
                          <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">{course.level}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-50">
                        <div className="text-sm text-gray-600 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2"><Calendar size={14} className="text-gray-400 shrink-0"/><span className="truncate">{course.schedule_days}</span></div>
                          <div className="flex items-center gap-2"><Clock size={14} className="text-gray-400 shrink-0"/><span className="truncate">{course.time}</span></div>
                          <div className="flex items-center gap-2"><User size={14} className="text-gray-400 shrink-0"/><span className="truncate font-medium">{instructor?.name || 'Nessun Istruttore'}</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {courses.length === 0 && (
                  <div className="col-span-full p-8 text-center bg-white rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">Nessun corso attivo trovato nel sistema.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
