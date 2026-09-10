import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Perfil, ROLE_LABELS, SesionUsuario, UserRole } from '../types';
import {
  Lock,
  LogIn,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Crown,
  FileText,
  MapPin,
  Sparkles,
  ShieldAlert,
  HeartHandshake,
  Megaphone,
  UserCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onLogin: (sesion: SesionUsuario) => void;
}

const ROLE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShieldCheck,
  Crown,
  FileText,
  MapPin,
  Sparkles,
  ShieldAlert,
  HeartHandshake,
  Megaphone,
};

const ROLE_ICON_MAP: Record<UserRole, string> = {
  administrador: 'ShieldCheck',
  admin: 'ShieldCheck',
  presidente: 'Crown',
  presidentecac: 'Crown',
  secretario: 'FileText',
  delegadodepasaje: 'MapPin',
  encargado_limpieza: 'Sparkles',
  encargado_seguridad: 'ShieldAlert',
  encargado_asistencia_social: 'HeartHandshake',
  encargado_publicidad: 'Megaphone',
};

function RoleIcon({ role, size = 26, className }: { role: UserRole; size?: number; className?: string }) {
  const iconName = ROLE_ICON_MAP[role];
  const Icon = ROLE_ICONS[iconName] ?? UserCircle2;
  return <Icon size={size} className={className} />;
}

export default function Auth({ onLogin }: Props) {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loadingPerfiles, setLoadingPerfiles] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [seleccionado, setSeleccionado] = useState<Perfil | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc('caja_listar_perfiles');
      setLoadingPerfiles(false);
      if (error || !data) {
        setLoadError('No se pudo cargar la lista de perfiles.');
        return;
      }
      setPerfiles(
        data.map((p: { user_profile_id: string; username: string; role: UserRole }) => ({
          userProfileId: p.user_profile_id,
          username: p.username,
          role: p.role,
        }))
      );
    })();
  }, []);

  const handleSelect = (perfil: Perfil) => {
    setSeleccionado(perfil);
    setPassword('');
    setError('');
  };

  const handleBack = () => {
    setSeleccionado(null);
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seleccionado) return;
    setError('');
    setSubmitting(true);

    const { data, error: rpcError } = await supabase.rpc('caja_login', {
      p_username: seleccionado.username,
      p_password: password,
    });

    setSubmitting(false);

    if (rpcError || !data || data.length === 0) {
      setError('Contraseña incorrecta.');
      return;
    }

    const row = data[0];
    onLogin({
      token: row.token,
      userProfileId: row.user_profile_id,
      username: row.username,
      role: row.role as UserRole,
      veConsolidado: row.ve_consolidado,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[45%] h-[45%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[15%] w-[25%] h-[25%] rounded-full bg-red-500/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/logo-centro-artesanal.png"
            alt="Centro Artesanal Cusco"
            className="w-20 h-20 object-contain mb-4 drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold text-white">Libro de Caja</h1>
          <p className="text-slate-400 text-sm mt-1">
            {seleccionado ? 'Ingresa tu contraseña para continuar' : 'Selecciona tu perfil para iniciar sesión'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!seleccionado ? (
            <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {loadingPerfiles ? (
                <div className="flex items-center justify-center py-10 text-slate-400">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Cargando perfiles...
                </div>
              ) : loadError ? (
                <div className="text-red-400 text-sm bg-red-950/40 border border-red-900/50 p-3 rounded-xl text-center">
                  {loadError}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {perfiles.map((perfil) => (
                    <button
                      key={perfil.userProfileId}
                      onClick={() => handleSelect(perfil)}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900/40 hover:bg-blue-600/20 border border-slate-700/60 hover:border-blue-500/60 rounded-xl transition-all active:scale-[0.97] group"
                    >
                      <div className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-700/60 group-hover:bg-blue-600 text-slate-300 group-hover:text-white transition-colors">
                        <RoleIcon role={perfil.role} size={22} />
                      </div>
                      <span className="text-xs font-semibold text-slate-200 text-center leading-tight">
                        {ROLE_LABELS[perfil.role] ?? perfil.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.form
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Cambiar perfil
              </button>

              <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-700/60 rounded-xl p-3">
                <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white">
                  <RoleIcon role={seleccionado.role} size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{ROLE_LABELS[seleccionado.role] ?? seleccionado.role}</p>
                  <p className="text-xs text-slate-400 truncate">{seleccionado.username}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Contraseña</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    autoFocus
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900/60 pl-10 px-3 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
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
                    className="text-red-400 text-sm bg-red-950/40 border border-red-900/50 p-3 rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full justify-center items-center space-x-2 rounded-xl bg-blue-600 py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
                <span>{submitting ? 'Ingresando...' : 'Ingresar'}</span>
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-xs text-slate-500">Centro Artesanal Cusco · Manos Cusqueñas al Mundo</p>
      </motion.div>
    </div>
  );
}
