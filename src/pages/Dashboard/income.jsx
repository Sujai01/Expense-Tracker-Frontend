import React, { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { PlusCircle, Trash2, Download, TrendingUp, CircleDollarSign } from "lucide-react";

const Income = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        source: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "Salary",
        description: ""
    });

    const fetchIncomes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/income/get");
            if (res.data?.success) {
                setIncomes(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to load income records");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchIncomes(); }, [fetchIncomes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/income/add", formData);
            if (res.data?.success) {
                toast.success("Income added successfully!");
                setFormData({ source: "", amount: "", date: new Date().toISOString().split('T')[0], category: "Salary", description: "" });
                fetchIncomes();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding income");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            const res = await api.delete(`/income/${id}`);
            if (res.data?.success) {
                toast.success("Record deleted");
                setIncomes(prev => prev.filter(item => item._id !== id));
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleDownload = async () => {
        try {
            toast.loading("Preparing Excel report...", { id: "download" });
            const response = await api.get("/income/download", { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Incomes_Report.xlsx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Income report downloaded!", { id: "download" });
        } catch (err) {
            toast.error("Failed to download Excel report", { id: "download" });
        }
    };

    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="text-white w-full h-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <TrendingUp className="text-emerald-400" size={24} />
                        </div>
                        Income Tracker
                    </h1>
                    <p className="text-zinc-400 mt-2">Total Revenue: <span className="text-emerald-400 font-bold tracking-tight">${totalIncome.toLocaleString()}</span></p>
                </div>
                <button onClick={handleDownload} className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-5 py-2.5 rounded-xl hover:bg-zinc-800 hover:border-zinc-600 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm text-zinc-100 font-medium group">
                    <Download size={18} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" /> Export Excel
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* FORM PANEL */}
                <div className="lg:col-span-4">
                    <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-zinc-800 sticky top-24">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                            <PlusCircle className="text-emerald-500" size={20} />
                            <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Add Income</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Source</label>
                                <input type="text" placeholder="e.g. Salary" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-600" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Amount ($)</label>
                                <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-600" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Date</label>
                                <input type="date" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 outline-none focus:border-emerald-500 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                            </div>
                            <button className="w-full bg-emerald-600 text-white py-3.5 mt-2 rounded-xl font-semibold tracking-wide hover:bg-emerald-500 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-emerald-600/20">
                                Save Income
                            </button>
                        </form>
                    </div>
                </div>

                {/* LIST PANEL */}
                <div className="lg:col-span-8">
                    <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-800 overflow-hidden shadow-lg">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-zinc-900/50">
                            <CircleDollarSign size={20} className="text-zinc-400" />
                            <span className="font-semibold text-zinc-100 tracking-tight">Transaction History</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {loading ? (
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-16 bg-zinc-800/30 rounded-xl animate-pulse w-full"></div>
                                    ))}
                                </div>
                            ) : incomes.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                                        <CircleDollarSign className="text-zinc-500" size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-zinc-300">No income records</h3>
                                    <p className="text-sm text-zinc-500 mt-1">Add your first income using the form.</p>
                                </div>
                            ) : (
                                incomes.map((item) => (
                                    <div key={item._id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                                                {item.source.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-100 text-base">{item.source}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">{new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-emerald-400 font-bold tracking-tight text-lg">+${item.amount.toLocaleString()}</span>
                                            <button onClick={() => handleDelete(item._id)} className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Income;