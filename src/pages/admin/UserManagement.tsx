import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Users, GraduationCap, Plus, Trash2, X, Save } from 'lucide-react';

export function UserManagement() {
  const users = useStore(state => state.users);
  const students = useStore(state => state.students);
  const attendances = useStore(state => state.attendances);
  const addUser = useStore(state => state.addUser);
  const deleteUser = useStore(state => state.deleteUser);
  const deleteStudent = useStore(state => state.deleteStudent);

  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', role: 'instructor', password: '' });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userForm.name) {
      await addUser({
        id: 'u' + Math.random().toString(36).substr(2, 9),
        name: userForm.name,
        email: `${userForm.name.replace(/\s+/g, '').toLowerCase()}@masterpiscine.it`,
        role: userForm.role as 'admin' | 'instructor',
        password: userForm.role === 'admin' ? userForm.password : undefined
      });
      setShowUserForm(false);
      setUserForm({ name: '', role: 'instructor', password: '' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900">Gestione Utenti e Allievi</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Istruttori */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-brand-blue text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <h2 className="text-lg font-bold">Staff / Istruttori</h2>
            </div>
            {!showUserForm && (
              <button onClick={() => setShowUserForm(true)} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                <Plus size={16} /> Aggiungi
              </button>
            )}
          </div>

          {showUserForm && (
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-brand-blue">Nuovo Utente</h3>
                <button onClick={() => setShowUserForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome e Cognome</label>
                  <input type="text" required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
                    <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue">
                      <option value="instructor">Istruttore</option>
                      <option value="admin">Coordinatore (Admin)</option>
                    </select>
                  </div>
                  {userForm.role === 'admin' && (
                    <div className="flex-1 animate-in fade-in slide-in-from-top-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="text" required placeholder="password123" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-900 transition-colors">
                    <Save size={16} /> Salva Utente
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="p-0 flex-1 overflow-auto max-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruolo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-brand-blue'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={async () => {
                            if (window.confirm(`Sei sicuro di voler eliminare ${u.name}?`)) {
                              await deleteUser(u.id);
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                          title="Elimina Istruttore"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allievi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-blue-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap size={20} />
              <h2 className="text-lg font-bold">Anagrafica Allievi</h2>
            </div>
            <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-medium">{students.length} totali</span>
          </div>
          <div className="p-0 flex-1 overflow-auto max-h-[500px]">
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nessun allievo presente nel sistema.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome Allievo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map(s => {
                    const studentAttendances = attendances.filter(a => a.student_id === s.id);
                    const presences = studentAttendances.filter(a => a.status === 'present').length;
                    const absences = studentAttendances.filter(a => a.status === 'absent').length;

                    return (
                      <tr key={s.id} className="hover:bg-gray-50 group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 mb-1">{s.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {presences} {presences === 1 ? 'Presenza' : 'Presenze'}
                            </span>
                            <span className="inline-flex items-center text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {absences} {absences === 1 ? 'Assenza' : 'Assenze'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            onClick={async () => {
                              if (window.confirm(`Attenzione: Eliminerai definitivamente ${s.name} dal sistema e da tutti i corsi. Procedere?`)) {
                                await deleteStudent(s.id);
                              }
                            }}
                            className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                            title="Elimina Allievo"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
