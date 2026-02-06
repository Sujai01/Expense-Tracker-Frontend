import React, { useEffect, useState, useCallback, memo } from "react";
import api from "../../utils/api";
import { 
    ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Activity } from "lucide-react";

// 1. ISOLATED CHART COMPONENT
// Memoizing prevents the chart from re-calculating while the page is navigating
const DashboardChart = memo(({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis 
                    dataKey="date" 
                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                    stroke="#666" fontSize={12} tickMargin={10}
                />
                <YAxis stroke="#666" fontSize={12} tickMargin={10} />
                <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', color: '#fff' }} />
                <Legend verticalAlign="top" height={36}/>
                <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#colorIncome)" strokeWidth={3} isAnimationActive={false} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#colorExpense)" strokeWidth={3} isAnimationActive={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
});

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renderChart, setRenderChart] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            const res = await api.get("/stats/dashboard");
            if (res.data) {
                setStats(res.data);
            }
        } catch (err) {
            console.error("Dashboard error", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // 2. THE STABILITY GUARD
    // This effect ensures the chart is ONLY added to the DOM after the page is fully stable
    useEffect(() => {
        if (!loading && stats) {
            const timer = setTimeout(() => {
                setRenderChart(true);
            }, 300); // 300ms is the "sweet spot" for React transitions
            return () => clearTimeout(timer);
        }
    }, [loading, stats]);

    if (loading) return <div className="p-10 text-center text-white animate-pulse">Loading Dashboard...</div>;

    const summary = stats?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
    const chartData = stats?.chartData || [];

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <Activity className="text-[#875cf5]" /> Financial Overview
            </h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#875cf5] p-6 rounded-2xl text-white shadow-lg shadow-purple-500/10">
                    <p className="text-xs opacity-80 mb-1">Net Balance</p>
                    <h2 className="text-3xl font-bold">${summary.balance.toLocaleString()}</h2>
                </div>
                <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Total Income</p>
                    <h2 className="text-2xl font-bold text-white">${summary.totalIncome.toLocaleString()}</h2>
                </div>
                <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
                    <h2 className="text-2xl font-bold text-white">${summary.totalExpense.toLocaleString()}</h2>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-[#121212] p-6 rounded-3xl border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-6">Cash Flow Trend</h3>
                <div className="w-full min-h-[350px] flex items-center justify-center">
                    {renderChart && chartData.length > 0 ? (
                        <DashboardChart data={chartData} />
                    ) : (
                        <div className="text-gray-600 italic">
                            {chartData.length === 0 ? "No transactions found." : "Loading visual analytics..."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;