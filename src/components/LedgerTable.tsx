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
    <thead className="bg-slate-800/60 border-b border-slate-700">
      <tr>
        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Fecha</th>
        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Cant.</th>
        <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-full">Descripción</th>
        {veConsolidado && (
          <th className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Origen</th>
        )}
        <th className="px-5 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Monto</th>
        {!veConsolidado && (
          <th className="px-5 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider w-12"></th>
        )}
      </tr>
    </thead>
  );

  const TableRow = ({ t, colorClass }: { t: Transaction; colorClass: string }) => (
    <motion.tr
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors"
    >
      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">{formatDate(t.fecha)}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 text-center">{t.cantidad ?? '-'}</td>
      <td className="px-5 py-4 text-sm text-slate-200">{t.descripcion}</td>
      {veConsolidado && (
        <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-400">
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
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
            className="text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors p-2 rounded-lg"
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
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
        <div className="px-6 py-5 bg-emerald-950/40 border-b border-emerald-900/40">
          <h3 className="text-lg font-bold text-emerald-400 tracking-tight">Registro de Ingresos</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-800">
            <TableHeader />
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              <AnimatePresence>
                {ingresos.length === 0 ? (
                  <tr>
                    <td colSpan={columnCount} className="px-5 py-12 text-center text-sm text-slate-500">
                      No hay ingresos registrados.
                    </td>
                  </tr>
                ) : (
                  ingresos.map((t) => <TableRow key={t.id} t={t} colorClass="text-emerald-400" />)
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Egresos */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
        <div className="px-6 py-5 bg-red-950/40 border-b border-red-900/40">
          <h3 className="text-lg font-bold text-red-400 tracking-tight">Registro de Egresos</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-800">
            <TableHeader />
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              <AnimatePresence>
                {egresos.length === 0 ? (
                  <tr>
                    <td colSpan={columnCount} className="px-5 py-12 text-center text-sm text-slate-500">
                      No hay egresos registrados.
                    </td>
                  </tr>
                ) : (
                  egresos.map((t) => <TableRow key={t.id} t={t} colorClass="text-red-400" />)
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
