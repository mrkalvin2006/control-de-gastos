import { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { motion } from 'motion/react';
import { PlusCircle, MinusCircle, Plus } from 'lucide-react';

interface Props {
  onAdd: (transaction: Omit<Transaction, 'id' | 'userId' | 'userRole'>) => void;
}

export default function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>('ingreso');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      type,
      date,
      quantity,
      description,
      amount: Number(amount),
    });

    setDescription('');
    setAmount('');
    setQuantity('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 sticky top-24"
    >
      <h2 className="text-lg font-semibold text-slate-800 mb-6">Nueva Transacción</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex space-x-3 mb-2 p-1 bg-slate-100/50 rounded-2xl">
          <button
            type="button"
            onClick={() => setType('ingreso')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              type === 'ingreso'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 scale-[1.02]'
                : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <PlusCircle size={18} />
            <span className="font-medium text-sm">Ingreso</span>
          </button>
          <button
            type="button"
            onClick={() => setType('egreso')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              type === 'egreso'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-[1.02]'
                : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MinusCircle size={18} />
            <span className="font-medium text-sm">Egreso</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Fecha</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Cantidad</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
              placeholder="Opcional"
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Descripción</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿De qué trata esta transacción?"
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Monto (S/)</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-xl font-semibold text-slate-800 placeholder-slate-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-200 mt-2 active:scale-[0.98]"
        >
          <Plus size={20} />
          <span>Agregar Registro</span>
        </button>
      </form>
    </motion.div>
  );
}
