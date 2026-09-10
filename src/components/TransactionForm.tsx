import { useState } from 'react';
import { NewTransaction, TransactionType } from '../types';
import { motion } from 'motion/react';
import { PlusCircle, MinusCircle, Plus } from 'lucide-react';

interface Props {
  onAdd: (transaction: NewTransaction) => void | Promise<void>;
}

export default function TransactionForm({ onAdd }: Props) {
  const [tipo, setTipo] = useState<TransactionType>('ingreso');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [cantidad, setCantidad] = useState<number | ''>('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || !monto) return;

    setSubmitting(true);
    await onAdd({
      tipo,
      fecha,
      cantidad,
      descripcion,
      monto: Number(monto),
    });
    setSubmitting(false);

    setDescripcion('');
    setMonto('');
    setCantidad('');
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
            onClick={() => setTipo('ingreso')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              tipo === 'ingreso'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 scale-[1.02]'
                : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <PlusCircle size={18} />
            <span className="font-medium text-sm">Ingreso</span>
          </button>
          <button
            type="button"
            onClick={() => setTipo('egreso')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              tipo === 'egreso'
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
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Cantidad</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value ? Number(e.target.value) : '')}
              placeholder="Opcional"
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Descripción</label>
            <input
              type="text"
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
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
              value={monto}
              onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : '')}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-xl font-semibold text-slate-800 placeholder-slate-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-200 mt-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          <span>{submitting ? 'Guardando...' : 'Agregar Registro'}</span>
        </button>
      </form>
    </motion.div>
  );
}
