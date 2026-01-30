import React, { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { 
    PlusCircle, 
    Trash2, 
    Download, 
    Wallet, 
    Calendar, 
    TrendingUp,
    CircleDollarSign
} from "lucide-react";

const Income = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        source: "",
        amount: "",
        date: new Date().toISOString().split('T')[0], // Defaults to today
        category: "Salary",
        description: ""
    });

    // We use useCallback to memoize the function and prevent unnecessary re-renders
    const fetchIncomes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/income/get");
            if (res.data?.success) {
                setIncomes(res.data.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load income records");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIncomes();
    }, [fetchIncomes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/income/add", formData);
            if (res.data?.success) {
                toast.success("Income added successfully!");
                // Reset form
                setFormData({
                    source: "",
                    amount: "",
                    date: new Date().toISOString().split('T')[0],
                    category: "Salary",
                    description: ""
                });
                fetchIncomes(); // Refresh the list
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

    const handleExport = () => {
        // Points to the specialized Excel route we built
        window.open("http://localhost:5000/api/income/download", "_blank");
    };

    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="text-green-600" /> Income Tracker
                    </h1>
                    <p className="text-gray-500">Total Revenue: <span className="text-green-600 font-bold">${totalIncome.toLocaleString()}</span></p>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm text-gray-700 font-medium"
                >
                    <Download size={18} /> Export Excel
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* FORM SECTION (Left Side) */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <div className="flex items-center gap-2 mb-6">
                            <PlusCircle className="text-green-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Add Income</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Source / Company</label>
                                <input 
                                    type="text" placeholder="e.g. Freelance Project" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                                    value={formData.source}
                                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Amount ($)</label>
                                <div className="relative">
                                    <CircleDollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="number" placeholder="0.00"
                                        className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="date" 
                                        className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex justify-center items-center gap-2">
                                <PlusCircle size={20} /> Save Income
                            </button>
                        </form>
                    </div>
                </div>

                {/* LIST SECTION (Right Side) */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                <div className="p-12 text-center text-gray-400 animate-pulse">Loading data...</div>
                            ) : incomes.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">
                                    <Wallet size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No income history found.</p>
                                </div>
                            ) : (
                                incomes.map((item) => (
                                    <div key={item._id} className="p-5 hover:bg-gray-50 transition flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center font-bold">
                                                <TrendingUp size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">{item.source}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <Calendar size={12} />
                                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">{item.category || "Salary"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-green-600 font-extrabold text-xl">+${item.amount.toLocaleString()}</span>
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete entry"
                                            >
                                                <Trash2 size={20} />
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