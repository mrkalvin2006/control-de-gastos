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
    // Group transactions by date
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
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center space-x-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp size={100} />
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner">
            <TrendingUp size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Ingresos Totales</p>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(ingresos)}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center space-x-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingDown size={100} />
          </div>
          <div className="p-4 bg-rose-50 rounded-2xl text-rose-600 shadow-inner">
            <TrendingDown size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Egresos Totales</p>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(egresos)}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white rounded-3xl p-6 shadow-sm border flex items-center space-x-5 relative overflow-hidden ${saldo < 0 ? 'border-rose-200 shadow-rose-100/50' : 'border-indigo-100 shadow-indigo-100/50'}`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Wallet size={100} />
          </div>
          <div className={`p-4 rounded-2xl shadow-inner ${saldo >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
            <Wallet size={28} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Saldo Actual</p>
            <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>{formatCurrency(saldo)}</p>
          </div>
        </motion.div>
      </div>

      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <PieChartIcon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Flujo Financiero en el Tiempo</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => {
                    const d = new Date(val + 'T00:00:00');
                    return `${d.getDate()}/${d.getMonth()+1}`;
                  }}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => `S/ ${val}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`S/ ${value.toFixed(2)}`, '']}
                  labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long' })}
                />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                <Area type="monotone" dataKey="egresos" name="Egresos" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorEgresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
