import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Edit2, X, Save, ChevronLeft, Users } from 'lucide-react';
import type { Course } from '../../types';

export function CourseManagement() {
  const courses = useStore(state => state.courses);
  const users = useStore(state => state.users);
  const addCourse = useStore(state => state.addCourse);
  const updateCourse = useStore(state => state.updateCourse);
  const deleteCourse = useStore(state => state.deleteCourse);
  const students = useStore(state => state.students);
  const enrollments = useStore(state => state.enrollments);
  
  const instructors = users.filter(u => u.role === 'instructor');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [managingCourseId, setManagingCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({});
  
  const [timeHour, setTimeHour] = useState('16');
  const [timeMinute, setTimeMinute] = useState('00');
  const [courseDuration, setCourseDuration] = useState('45');

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData(course);
    
    const match = course.time.match(/^(\d{2}):(\d{2})\s\((\d+)\smin\)$/);
    if (match) {
      setTimeHour(match[1]);
      setTimeMinute(match[2]);
      setCourseDuration(match[3]);
    } else {
      setTimeHour('16');
      setTimeMinute('00');
      setCourseDuration('45');
    }
    
    setShowForm(true);
  };

  const handleNew = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({});
    setTimeHour('16');
    setTimeMinute('00');
    setCourseDuration('45');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timeString = `${timeHour}:${timeMinute} (${courseDuration} min)`;
    
    if (formData.name && formData.level && formData.schedule_days && formData.primary_instructor_id) {
      if (editingId) {
        await updateCourse({
          id: editingId,
          name: formData.name,
          level: formData.level,
          schedule_days: formData.schedule_days,
          time: timeString,
          primary_instructor_id: formData.primary_instructor_id
        });
      } else {
        await addCourse({
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          level: formData.level,
          schedule_days: formData.schedule_days,
          time: timeString,
          primary_instructor_id: formData.primary_instructor_id
        });
      }
      handleCancel();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestione Corsi</h1>
        {!showForm && (
          <button 
            onClick={handleNew}
            className="bg-brand-blue hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Nuovo Corso
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-brand-blue">
              {editingId ? 'Modifica Corso' : 'Aggiungi Nuovo Corso'}
            </h2>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Corso</label>
              <input type="text" required value={formData.name || ''} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-brand-blue focus:border-brand-blue" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Livello</label>
              <select required value={formData.level || ''} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-brand-blue focus:border-brand-blue" onChange={e => setFormData({...formData, level: e.target.value})}>
                <option value="">Seleziona livello...</option>
                <option value="Ambientamento">Ambientamento</option>
                <option value="Galleggiamento">Galleggiamento</option>
                <option value="2 livello">2 livello</option>
                <option value="3 livello">3 livello</option>
                <option value="4 livello">4 livello</option>
                <option value="5 livello">5 livello</option>
                <option value="6 livello">6 livello</option>
                <option value="Propaganda">Propaganda</option>
                <option value="Master">Master</option>
                <option value="Acqua gym">Acqua gym</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giorni</label>
              <select required value={formData.schedule_days || ''} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-brand-blue focus:border-brand-blue" onChange={e => setFormData({...formData, schedule_days: e.target.value})}>
                <option value="">Seleziona...</option>
                <option value="Lunedì-Giovedì">Lunedì-Giovedì</option>
                <option value="Martedì-Venerdì">Martedì-Venerdì</option>
                <option value="Mercoledì-Sabato">Mercoledì-Sabato</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orario Inizio e Durata</label>
              <div className="flex gap-2">
                <select value={timeHour} onChange={e => setTimeHour(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-brand-blue focus:border-brand-blue">
                  {Array.from({length: 16}, (_, i) => i + 7).map(h => (
                    <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <span className="flex items-center font-bold">:</span>
                <select value={timeMinute} onChange={e => setTimeMinute(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-brand-blue focus:border-brand-blue">
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select value={courseDuration} onChange={e => setCourseDuration(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-brand-blue focus:border-brand-blue bg-gray-50">
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="50">50 min</option>
                  <option value="60">1 ora</option>
                  <option value="90">1 ora e 30m</option>
                  <option value="120">2 ore</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Istruttore Principale</label>
              <select required value={formData.primary_instructor_id || ''} className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-brand-blue focus:border-brand-blue" onChange={e => setFormData({...formData, primary_instructor_id: e.target.value})}>
                <option value="">Seleziona istruttore...</option>
                {instructors.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={handleCancel} className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Annulla
              </button>
              <button type="submit" className="bg-brand-blue hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-2">
                <Save size={18} /> {editingId ? 'Aggiorna Corso' : 'Salva Corso'}
              </button>
            </div>
          </form>
        </div>
      )}

      {managingCourseId && (() => {
        const course = courses.find(c => c.id === managingCourseId);
        if (!course) return null;
        
        return (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
              <button 
                onClick={() => setManagingCourseId(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors shrink-0"
                title="Torna alla lista corsi"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{course.name}</h2>
                <p className="text-sm text-gray-500">Gestione Allievi Iscritti</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Nome e Cognome nuovo allievo" 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue"
                id="manage-new-student-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && managingCourseId) {
                      useStore.getState().addNewStudentToCourse(val, managingCourseId);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const input = document.getElementById('manage-new-student-input') as HTMLInputElement;
                  const val = input?.value.trim();
                  if (val && managingCourseId) {
                    useStore.getState().addNewStudentToCourse(val, managingCourseId);
                    if (input) input.value = '';
                  }
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                Aggiungi Allievo
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {students.filter(s => enrollments.some(e => e.course_id === managingCourseId && e.student_id === s.id)).length === 0 ? (
                  <li className="p-8 text-center text-gray-500 font-medium">Nessun allievo ancora iscritto a questo corso.</li>
                ) : (
                  students.filter(s => enrollments.some(e => e.course_id === managingCourseId && e.student_id === s.id)).map(student => (
                    <li key={student.id} className="p-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center group transition-colors">
                      <span className="font-medium text-gray-900 text-lg">{student.name}</span>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          if (window.confirm(`Sei sicuro di voler rimuovere ${student.name} dal corso?`)) {
                            await useStore.getState().removeStudentFromCourse(student.id, managingCourseId);
                          }
                        }}
                        className="text-red-400 hover:text-red-600 bg-red-50 sm:bg-transparent sm:hover:bg-red-50 p-2 sm:p-2.5 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 flex items-center gap-2"
                        title="Rimuovi Allievo"
                      >
                        <Trash2 size={18} />
                        <span className="text-sm font-bold sm:hidden">Rimuovi</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        );
      })()}

      {!showForm && !managingCourseId && (
        <div className="space-y-8">
          {courses.length === 0 && instructors.length === 0 && (
            <p className="text-gray-500 text-center py-8">Nessun corso o istruttore presente nel sistema.</p>
          )}

          {instructors.map(instructor => {
            const instructorCourses = courses.filter(c => c.primary_instructor_id === instructor.id);
            
            return (
              <div key={instructor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="bg-brand-blue text-white px-6 py-4 font-bold flex justify-between items-center">
                  <span className="text-lg">Istruttore: {instructor.name}</span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{instructorCourses.length} corsi</span>
                </div>
                
                {instructorCourses.length === 0 ? (
                  <p className="text-gray-500 text-center py-6 bg-gray-50">Nessun corso attualmente assegnato a questo istruttore.</p>
                ) : (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50/50">
                    {instructorCourses.map((course) => {
                      const enrolledCount = students.filter(s => enrollments.some(e => e.course_id === course.id && e.student_id === s.id)).length;
                      return (
                        <div 
                          key={course.id} 
                          className="bg-white border border-gray-100 rounded-xl p-5 hover:border-brand-blue/30 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                          onClick={() => setManagingCourseId(course.id)}
                        >
                          <div>
                             <div className="flex justify-between items-start mb-2">
                               <h3 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors text-lg pr-2 leading-tight">{course.name}</h3>
                               <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                 <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                 <button onClick={async () => {
                                   if (window.confirm('Sei sicuro di voler eliminare questo corso?')) await deleteCourse(course.id);
                                 }} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                               </div>
                             </div>
                             <div className="mb-4">
                               <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">{course.level}</span>
                             </div>
                          </div>
                          <div className="pt-3 border-t border-gray-50 flex flex-col gap-1.5 text-sm text-gray-600">
                             <div className="flex items-center justify-between">
                               <span>{course.schedule_days}</span>
                               <span className="font-medium text-gray-900">{course.time}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-brand-blue mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded-md text-xs font-bold">
                               <Users size={14} /> {enrolledCount} {enrolledCount === 1 ? 'Allievo' : 'Allievi'}
                             </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {courses.filter(c => !instructors.find(i => i.id === c.primary_instructor_id)).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden mb-6">
              <div className="bg-red-500 text-white px-6 py-4 font-bold flex justify-between items-center">
                <span className="text-lg">Corsi Orfani (Senza Istruttore)</span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-red-50/50">
                {courses.filter(c => !instructors.find(i => i.id === c.primary_instructor_id)).map((course) => {
                  const enrolledCount = students.filter(s => enrollments.some(e => e.course_id === course.id && e.student_id === s.id)).length;
                  return (
                    <div 
                      key={course.id} 
                      className="bg-white border border-red-100 rounded-xl p-5 hover:border-red-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                      onClick={() => setManagingCourseId(course.id)}
                    >
                      <div>
                         <div className="flex justify-between items-start mb-2">
                           <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors text-lg pr-2 leading-tight">{course.name}</h3>
                           <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                             <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"><Edit2 size={16} /></button>
                             <button onClick={async () => {
                               if (window.confirm('Eliminare corso orfano?')) await deleteCourse(course.id);
                             }} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                           </div>
                         </div>
                         <div className="mb-4">
                           <span className="inline-flex px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider">{course.level}</span>
                         </div>
                      </div>
                      <div className="pt-3 border-t border-gray-50 flex flex-col gap-1.5 text-sm text-gray-600">
                         <div className="flex items-center justify-between">
                           <span>{course.schedule_days}</span>
                           <span className="font-medium text-gray-900">{course.time}</span>
                         </div>
                         <div className="flex items-center gap-1.5 text-red-600 mt-1 bg-red-50 w-fit px-2 py-0.5 rounded-md text-xs font-bold">
                           <Users size={14} /> {enrolledCount} {enrolledCount === 1 ? 'Allievo' : 'Allievi'}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
