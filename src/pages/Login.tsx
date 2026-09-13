import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Lock } from 'lucide-react';

export function Login() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const users = useStore(state => state.users);
  const login = useStore(state => state.login);
  const currentUser = useStore(state => state.currentUser);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/instructor');
    }
  }, [currentUser, navigate]);

  const selectedUser = users.find(u => u.id === selectedUserId);
  const isAdmin = selectedUser?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedUser) {
      setError('Seleziona un utente.');
      return;
    }

    if (isAdmin && selectedUser.password !== password) {
      setError('Password errata.');
      return;
    }

    login(selectedUser.id);
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col justify-center py-12 relative overflow-hidden">
      {/* Decorative Top Background */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-brand-blue to-blue-900 rounded-b-[3rem] shadow-lg"></div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 mt-8">
        <div className="bg-white px-6 py-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 relative">
          
          <div className="text-center mb-8 pt-10">
            {/* Overlapping Logo */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <img 
                src="/logo.jpg" 
                alt="Master Piscine Logo" 
                className="w-28 h-28 rounded-2xl object-cover shadow-xl border-4 border-white bg-white" 
              />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Benvenuto</h1>
            <p className="text-gray-500 mt-2 font-medium">Accedi al tuo account</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chi sei?</label>
            <select
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors bg-white"
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                setPassword('');
                setError('');
              }}
            >
              <option value="" disabled>Seleziona il tuo nome...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'admin' ? 'Coordinatore' : 'Istruttore'})
                </option>
              ))}
            </select>
          </div>
          
          {isAdmin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors"
                  placeholder="Inserisci la password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 p-2 rounded-lg">{error}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-brand-blue hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md disabled:opacity-50"
            disabled={!selectedUserId}
          >
            <UserCircle />
            Accedi
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-2">Nota per il test:</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex justify-between p-2 bg-gray-50 rounded">
              <span>La password per il Coordinatore (Mario) è:</span> 
              <code className="font-bold text-brand-blue">admin</code>
            </li>
            <li className="p-2 bg-gray-50 rounded">
              Gli istruttori accedono direttamente senza password.
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
}
