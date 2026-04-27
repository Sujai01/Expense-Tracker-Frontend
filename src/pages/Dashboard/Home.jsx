import React, { useEffect, useState, useMemo } from "react";
import api from "../../utils/api";
import { 
    ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    PieChart, Pie, Cell 
} from "recharts";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Activity } from "lucide-react";

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; 

        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await api.get("/stats/dashboard");
                if (isMounted && res.data) {
                    setStats(res.data);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchStats();
        return () => { isMounted = false; };
    }, []);

    const donutData = useMemo(() => {
        if (!stats?.summary) return [];
        return [
            { name: 'Income', value: stats.summary.totalIncome, color: '#10b981' }, // Emerald 500
            { name: 'Expense', value: stats.summary.totalExpense, color: '#f43f5e' }, // Rose 500
        ];
    }, [stats]);

    if (loading) {
        return (
            <div className="p-2 w-full h-full">
                <div className="h-10 w-48 bg-zinc-800/50 rounded-lg animate-pulse mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-zinc-800/30 rounded-2xl animate-pulse border border-white/5"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-[380px] bg-zinc-800/30 rounded-3xl animate-pulse border border-white/5"></div>
                    <div className="h-[380px] bg-zinc-800/30 rounded-3xl animate-pulse border border-white/5"></div>
                </div>
            </div>
        );
    }

    const summary = stats?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
    const chartData = stats?.chartData || [];

    return (
        <div className="text-white w-full h-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <Activity className="text-indigo-400" size={24} />
                </div>
                Financial Overview
            </h1>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-900 p-6 rounded-2xl text-white shadow-lg shadow-indigo-900/20 group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex justify-between items-center opacity-90 mb-4 relative z-10">
                        <span className="text-sm font-medium tracking-wide">Net Balance</span>
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md"><Wallet size={18} /></div>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight relative z-10">${summary.balance.toLocaleString()}</h2>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-xl p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors shadow-sm group">
                    <div className="flex justify-between items-center text-zinc-400 mb-4">
                        <span className="text-sm font-medium tracking-wide">Total Income</span>
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform"><ArrowUpCircle size={18} /></div>
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight">${summary.totalIncome.toLocaleString()}</h2>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-xl p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors shadow-sm group">
                    <div className="flex justify-between items-center text-zinc-400 mb-4">
                        <span className="text-sm font-medium tracking-wide">Total Expenses</span>
                        <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 group-hover:scale-110 transition-transform"><ArrowDownCircle size={18} /></div>
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight">${summary.totalExpense.toLocaleString()}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* TREND CHART */}
                <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-zinc-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-indigo-500/5 blur-[80px] pointer-events-none"></div>
                    <h3 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
                        Cash Flow Trend
                    </h3>
                    <div className="h-[300px] w-full relative z-10">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                        stroke="#52525b"
                                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="#52525b" 
                                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ color: '#e4e4e7', fontWeight: 500 }}
                                        labelStyle={{ color: '#a1a1aa', marginBottom: '8px' }}
                                    />
                                    <Area 
                                        type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3}
                                        fillOpacity={1} fill="url(#colorIncome)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                                    />
                                    <Area 
                                        type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3}
                                        fillOpacity={1} fill="url(#colorExpense)" activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500 italic">
                                No data available to plot trend
                            </div>
                        )}
                    </div>
                </div>

                {/* BREAKDOWN CHART */}
                <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-zinc-800 shadow-sm relative overflow-hidden">
                    <h3 className="text-lg font-bold text-zinc-100 mb-6">Income vs Expense</h3>
                    <div className="h-[300px] w-full relative z-10">
                        {summary.totalIncome > 0 || summary.totalExpense > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="#18181b"
                                        strokeWidth={3}
                                    >
                                        {donutData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                        itemStyle={{ color: '#e4e4e7', fontWeight: 500 }}
                                        formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500 italic">
                                Add transactions to see breakdown
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;