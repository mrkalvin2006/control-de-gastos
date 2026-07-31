import { useState, useEffect } from 'react';
import { Transaction, UserProfile } from './types';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import LedgerTable from './components/LedgerTable';
import AuthComponent from './components/Auth';
import { FileSpreadsheet, LogOut, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('demo_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('demo_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('demo_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('demo_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('demo_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'userId' | 'userRole'>) => {
    if (!user) return;
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
      userId: user.uid,
      userRole: user.role,
      createdAt: Date.now(),
    };
    setTransactions(prev => 
      [transaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  if (!user) {
    return <AuthComponent onLogin={setUser} />;
  }

  const roleLabels: Record<string, string> = {
    caja_chica: 'Caja Chica',
    caja_central: 'Caja Central',
    asistenta_social: 'Asistenta Social',
    prensa: 'Prensa / Propaganda',
    presidente: 'Presidente (Consolidado)',
  };

  const filteredTransactions = user.role === 'presidente' 
    ? transactions 
    : transactions.filter(t => t.userId === user.uid);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm shadow-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-200">
              <FileSpreadsheet size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">Libro de Caja</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-sm text-slate-600 border-r border-slate-200 pr-4">
              <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                <User size={18} />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-slate-900 leading-none mb-0.5">{user.name}</p>
                <p className="text-xs font-medium text-slate-500">{roleLabels[user.role]}</p>
              </div>
            </div>
            <button
              onClick={() => setUser(null)}
              className="flex items-center space-x-2 text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors active:scale-[0.98]"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {user.role === 'presidente' ? 'Consolidado General' : `Panel de ${roleLabels[user.role]}`}
          </h2>
          <p className="text-slate-500 text-base mt-2 max-w-2xl">
            {user.role === 'presidente' 
              ? 'Vista general de todos los ingresos y egresos registrados por los diferentes usuarios.'
              : 'Gestiona tus propios ingresos y egresos de forma segura e independiente.'}
          </p>
        </motion.div>

        <SummaryCards transactions={filteredTransactions} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {user.role !== 'presidente' && (
            <div className="lg:col-span-1">
               <TransactionForm onAdd={handleAddTransaction} />
            </div>
          )}
          <div className={user.role === 'presidente' ? 'lg:col-span-3' : 'lg:col-span-2'}>
             <LedgerTable transactions={filteredTransactions} onDelete={handleDeleteTransaction} userRole={user.role} />
          </div>
        </div>
      </main>
    </div>
  );
}
