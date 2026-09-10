import { ROLE_LABELS, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  veConsolidado: boolean;
}

export default function LedgerTable({ transactions, onDelete, veConsolidado }: Props) {
  const ingresos = transactions.filter((t) => t.tipo === 'ingreso');
  const egresos = transactions.filter((t) => t.tipo === 'egreso');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00'); // Prevent timezone shift
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(date);
  };

  const columnCount = veConsolidado ? 5 : 5;

  const TableHeader = () => (
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cant.</th>
        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-full">Descripción</th>
        {veConsolidado && (
          <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Origen</th>
        )}
        <th className="px-5 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto</th>
        {!veConsolidado && (
          <th className="px-5 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider w-12"></th>
        )}
      </tr>
    </thead>
  );

  const TableRow = ({ t, colorClass }: { t: Transaction; colorClass: string }) => (
    <motion.tr
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
    >
      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{formatDate(t.fecha)}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500 text-center">{t.cantidad ?? '-'}</td>
      <td className="px-5 py-4 text-sm text-slate-800">{t.descripcion}</td>
      {veConsolidado && (
        <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
            {ROLE_LABELS[t.role] ?? t.role} · {t.username}
          </span>
        </td>
      )}
      <td className={`px-5 py-4 whitespace-nowrap text-sm font-bold text-right ${colorClass}`}>
        {formatCurrency(t.monto)}
      </td>
      {!veConsolidado && (
        <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => onDelete(t.id)}
            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors p-2 rounded-lg"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </td>
      )}
    </motion.tr>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Tabla de Ingresos */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="px-6 py-5 bg-emerald-50/50 border-b border-emerald-100/50">
          <h3 className="text-lg font-bold text-emerald-800 tracking-tight">Registro de Ingresos</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200">
            <TableHeader />
            <tbody className="bg-white divide-y divide-slate-100">
              <AnimatePresence>
                {ingresos.length === 0 ? (
                  <tr>
                    <td colSpan={columnCount} className="px-5 py-12 text-center text-sm text-slate-400">
                      No hay ingresos registrados.
                    </td>
                  </tr>
                ) : (
                  ingresos.map((t) => <TableRow key={t.id} t={t} colorClass="text-emerald-600" />)
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Egresos */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="px-6 py-5 bg-rose-50/50 border-b border-rose-100/50">
          <h3 className="text-lg font-bold text-rose-800 tracking-tight">Registro de Egresos</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200">
            <TableHeader />
            <tbody className="bg-white divide-y divide-slate-100">
              <AnimatePresence>
                {egresos.length === 0 ? (
                  <tr>
                    <td colSpan={columnCount} className="px-5 py-12 text-center text-sm text-slate-400">
                      No hay egresos registrados.
                    </td>
                  </tr>
                ) : (
                  egresos.map((t) => <TableRow key={t.id} t={t} colorClass="text-rose-600" />)
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
