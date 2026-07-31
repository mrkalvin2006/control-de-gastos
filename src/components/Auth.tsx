import { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, Wallet, User as UserIcon, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_USERS = [
  { uid: '1', username: 'presidente', password: 'presidente1', role: 'presidente', name: 'Presidente' },
  { uid: '2', username: 'cajachica', password: 'cajachica1', role: 'caja_chica', name: 'Caja Chica' },
  { uid: '3', username: 'cajacentral', password: 'cajacentral1', role: 'caja_central', name: 'Caja Central' },
  { uid: '4', username: 'asistenta', password: 'asistenta1', role: 'asistenta_social', name: 'Asistenta Social' },
  { uid: '5', username: 'prensa', password: 'prensa1', role: 'prensa', name: 'Prensa Propaganda' },
];

interface Props {
  onLogin: (user: UserProfile) => void;
}

export default function Auth({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const foundUser = MOCK_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password
    );

    if (foundUser) {
      onLogin({
        uid: foundUser.uid,
        role: foundUser.role as any,
        name: foundUser.name,
        email: `${foundUser.username}@sistema.com`,
      });
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  const handleFillDemo = (u: any) => {
    setUsername(u.username);
    setPassword(u.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-slate-100">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600 mb-4">
          <div className="bg-white p-4 rounded-full shadow-md border border-indigo-100">
            <Wallet size={40} className="text-indigo-600" />
          </div>
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Libro de Caja
        </h1>
        <h2 className="mt-2 text-center text-sm text-slate-600">
          Ingresa tus credenciales para acceder al sistema
        </h2>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-indigo-100/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Usuario</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 pl-10 px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                  placeholder="Ej. presidente"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Contraseña</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 pl-10 px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-rose-600 text-sm bg-rose-50 p-3 rounded-xl border border-rose-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center items-center space-x-2 rounded-xl border border-transparent bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
              >
                <LogIn size={20} />
                <span>Ingresar al Sistema</span>
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Usuarios de Prueba</p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_USERS.map((u) => (
                <button
                  key={u.uid}
                  type="button"
                  onClick={() => handleFillDemo(u)}
                  className="text-left px-3 py-2 text-xs rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition-colors"
                >
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-slate-500 text-[10px] truncate">{u.username}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
