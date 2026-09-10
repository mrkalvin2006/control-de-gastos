import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabaseClient';
import { NewTransaction, ROLE_LABELS, SesionUsuario, Transaction } from './types';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import LedgerTable from './components/LedgerTable';
import AuthComponent from './components/Auth';
import { LogOut, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const SESSION_STORAGE_KEY = 'caja_sesion';

export default function App() {
  const [sesion, setSesion] = useState<SesionUsuario | null>(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cerrarSesion = useCallback(() => {
    setSesion(null);
    setTransactions([]);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (sesion) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sesion));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [sesion]);

  const cargarMovimientos = useCallback(async () => {
    if (!sesion) return;
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.rpc('caja_listar_movimientos', {
      p_token: sesion.token,
    });

    setLoading(false);

    if (error) {
      setErrorMsg('Tu sesión expiró. Vuelve a iniciar sesión.');
      cerrarSesion();
      return;
    }

    setTransactions(data ?? []);
  }, [sesion, cerrarSesion]);

  useEffect(() => {
    cargarMovimientos();
  }, [cargarMovimientos]);

  const handleAddTransaction = async (newTx: NewTransaction) => {
    if (!sesion) return;
    setErrorMsg('');

    const { data, error } = await supabase.rpc('caja_crear_movimiento', {
      p_token: sesion.token,
      p_tipo: newTx.tipo,
      p_fecha: newTx.fecha,
      p_cantidad: newTx.cantidad === '' ? null : newTx.cantidad,
      p_descripcion: newTx.descripcion,
      p_monto: newTx.monto,
    });

    if (error || !data) {
      setErrorMsg('No se pudo guardar el registro. Intenta nuevamente.');
      return;
    }

    setTransactions((prev) =>
      [data as Transaction, ...prev].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      )
    );
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!sesion) return;
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;

    const { data, error } = await supabase.rpc('caja_eliminar_movimiento', {
      p_token: sesion.token,
      p_id: id,
    });

    if (error || !data) {
      setErrorMsg('No se pudo eliminar el registro.');
      return;
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    if (sesion) {
      await supabase.rpc('caja_logout', { p_token: sesion.token });
    }
    cerrarSesion();
  };

  if (!sesion) {
    return <AuthComponent onLogin={setSesion} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-12">
      <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-emerald-600" />

      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo-centro-artesanal.png" alt="Centro Artesanal Cusco" className="w-11 h-11 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Libro de Caja</h1>
              <p className="text-xs text-slate-400 leading-tight">Centro Artesanal Cusco</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right border-r border-slate-800 pr-4">
              <p className="font-bold text-white leading-none mb-1 text-sm">{sesion.username}</p>
              <p className="text-xs font-medium text-red-400">{ROLE_LABELS[sesion.role] ?? sesion.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors active:scale-[0.98]"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {sesion.veConsolidado ? 'Consolidado General' : `Panel de ${ROLE_LABELS[sesion.role] ?? sesion.role}`}
          </h2>
          <p className="text-slate-400 text-base mt-2 max-w-2xl">
            {sesion.veConsolidado
              ? 'Vista general de todos los ingresos y egresos registrados por los diferentes usuarios.'
              : 'Gestiona tus propios ingresos y egresos de forma segura e independiente.'}
          </p>
        </motion.div>

        {errorMsg && (
          <div className="mb-6 text-red-400 text-sm bg-red-950/40 border border-red-900/50 p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {loading && transactions.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 className="animate-spin mr-2" size={20} />
            Cargando movimientos...
          </div>
        ) : (
          <>
            <SummaryCards transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {!sesion.veConsolidado && (
                <div className="lg:col-span-1">
                  <TransactionForm onAdd={handleAddTransaction} />
                </div>
              )}
              <div className={sesion.veConsolidado ? 'lg:col-span-3' : 'lg:col-span-2'}>
                <LedgerTable
                  transactions={transactions}
                  onDelete={handleDeleteTransaction}
                  veConsolidado={sesion.veConsolidado}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
