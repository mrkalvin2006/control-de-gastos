import { Transaction } from '../types';
import { TrendingUp, TrendingDown, Wallet, PieChart as PieChartIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

interface Props {
  transactions: Transaction[];
}

export default function SummaryCards({ transactions }: Props) {
  const ingresos = transactions
    .filter((t) => t.tipo === 'ingreso')
    .reduce((acc, t) => acc + t.monto, 0);
  const egresos = transactions
    .filter((t) => t.tipo === 'egreso')
    .reduce((acc, t) => acc + t.monto, 0);
  const saldo = ingresos - egresos;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const chartData = useMemo(() => {
    const grouped = transactions.reduce((acc, t) => {
      const date = t.fecha;
      if (!acc[date]) {
        acc[date] = { date, ingresos: 0, egresos: 0 };
      }
      if (t.tipo === 'ingreso') acc[date].ingresos += t.monto;
      if (t.tipo === 'egreso') acc[date].egresos += t.monto;
      return acc;
    }, {} as Record<string, { date: string; ingresos: number; egresos: number }>);

    return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex items-center space-x-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-400">
            <TrendingUp size={100} />
          </div>
          <div className="p-4 bg-emerald-950/50 rounded-2xl text-emerald-400">
            <TrendingUp size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Ingresos Totales</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(ingresos)}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex items-center space-x-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 text-red-400">
            <TrendingDown size={100} />
          </div>
          <div className="p-4 bg-red-950/50 rounded-2xl text-red-400">
            <TrendingDown size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Egresos Totales</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(egresos)}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-slate-900 rounded-2xl p-6 border flex items-center space-x-5 relative overflow-hidden ${saldo < 0 ? 'border-red-900/60' : 'border-blue-900/60'}`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-400">
            <Wallet size={100} />
          </div>
          <div className={`p-4 rounded-2xl ${saldo >= 0 ? 'bg-blue-950/50 text-blue-400' : 'bg-red-950/50 text-red-400'}`}>
            <Wallet size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Saldo Actual</p>
            <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-white' : 'text-red-400'}`}>{formatCurrency(saldo)}</p>
          </div>
        </motion.div>
      </div>

      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 p-6 rounded-2xl border border-slate-800"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-blue-950/50 text-blue-400 rounded-lg">
              <PieChartIcon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Flujo Financiero en el Tiempo</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    const d = new Date(val + 'T00:00:00');
                    return `${d.getDate()}/${d.getMonth()+1}`;
                  }}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(val) => `S/ ${val}`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #1e293b', background: '#0f172a', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.4)' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: number) => [`S/ ${value.toFixed(2)}`, '']}
                  labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}
                />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                <Area type="monotone" dataKey="egresos" name="Egresos" stroke="#f87171" strokeWidth={3} fillOpacity={1} fill="url(#colorEgresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
