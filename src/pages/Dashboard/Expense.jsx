import React, { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { Trash2, Download, PlusCircle, Receipt, ArrowDownCircle } from "lucide-react";

const Expense = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        description: ""
    });

    const categories = ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Other"];

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/expense/all");
            if (res.data?.success) {
                setExpenses(res.data.data);
            }
        } catch (err) {
            toast.error("Could not load expenses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) return toast.error("Please select a category");
        try {
            await api.post("/expense/add", formData);
            toast.success("Expense recorded");
            setFormData({ category: "", amount: "", date: new Date().toISOString().split('T')[0], description: "" });
            fetchExpenses();
        } catch (err) {
            toast.error("Error saving expense");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
            await api.delete(`/expense/${id}`);
            toast.success("Entry deleted");
            setExpenses(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleDownload = async () => {
        try {
            toast.loading("Preparing Excel report...", { id: "exp-download" });
            const response = await api.get("/expense/download", { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Expense_Report.xlsx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Expense report downloaded!", { id: "exp-download" });
        } catch (err) {
            toast.error("Failed to download report", { id: "exp-download" });
        }
    };

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="text-white w-full h-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <ArrowDownCircle className="text-rose-400" size={24} />
                        </div>
                        Expense Tracker
                    </h1>
                    <p className="text-zinc-400 mt-2">Total Spent: <span className="text-rose-400 font-bold tracking-tight">${totalExpense.toLocaleString()}</span></p>
                </div>
                <button onClick={handleDownload} className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-5 py-2.5 rounded-xl hover:bg-zinc-800 hover:border-zinc-600 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm text-zinc-100 font-medium group">
                    <Download size={18} className="text-zinc-400 group-hover:text-rose-400 transition-colors" /> Export Excel
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* FORM PANEL */}
                <div className="lg:col-span-4">
                    <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-zinc-800 sticky top-24">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                            <PlusCircle className="text-rose-500" size={20} />
                            <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Add Expense</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Category</label>
                                <select className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 transition-all cursor-pointer" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                    <option value="" className="text-zinc-500">Select Category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Amount ($)</label>
                                <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 transition-all placeholder:text-zinc-600" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Date</label>
                                <input type="date" className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 outline-none focus:border-rose-500 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Description (Optional)</label>
                                <input type="text" placeholder="Details..." className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 transition-all placeholder:text-zinc-600" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <button className="w-full bg-rose-600 text-white py-3.5 mt-2 rounded-xl font-semibold tracking-wide hover:bg-rose-500 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-rose-600/20">
                                Record Expense
                            </button>
                        </form>
                    </div>
                </div>

                {/* LIST PANEL */}
                <div className="lg:col-span-8">
                    <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-800 overflow-hidden shadow-lg">
                        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-zinc-900/50">
                            <Receipt size={20} className="text-zinc-400" />
                            <span className="font-semibold text-zinc-100 tracking-tight">Recent History</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {loading ? (
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-16 bg-zinc-800/30 rounded-xl animate-pulse w-full"></div>
                                    ))}
                                </div>
                            ) : expenses.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                                        <Receipt className="text-zinc-500" size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-zinc-300">No expenses recorded</h3>
                                    <p className="text-sm text-zinc-500 mt-1">Add your first expense using the form.</p>
                                </div>
                            ) : (
                                expenses.map((item) => (
                                    <div key={item._id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                                                {item.category.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-100 text-base">{item.category}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">
                                                    {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    {item.description ? ` • ${item.description}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-rose-400 font-bold tracking-tight text-lg">-${item.amount.toLocaleString()}</span>
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

export default Expense;