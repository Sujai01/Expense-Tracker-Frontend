import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { Trash2, Download, PlusCircle, Receipt } from "lucide-react";

const Expense = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0], // Default to today
        description: ""
    });

    // List of professional categories
    const categories = ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Other"];

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await api.get("/expense/get");
            setExpenses(res.data.data);
        } catch (err) {
            toast.error("Could not load expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExpenses(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) return toast.error("Please select a category");

        try {
            await api.post("/expense/add", formData);
            toast.success("Expense recorded");
            setFormData({ category: "", amount: "", date: new Date().toISOString().split('T')[0], description: "" });
            fetchExpenses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error saving expense");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        try {
            await api.delete(`/expense/${id}`);
            toast.success("Entry deleted");
            setExpenses(expenses.filter(item => item._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleDownload = () => {
        // Points to the backend Excel route we created
        window.open("http://localhost:5000/api/expense/download", "_blank");
    };

    // Calculate total for the header (adds a nice touch)
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
                    <p className="text-gray-500">Total Spent: <span className="text-red-600 font-semibold">${totalExpense.toFixed(2)}</span></p>
                </div>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm text-gray-700"
                >
                    <Download size={18} /> Export Excel
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* FORM COLUMN (4/12) */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-6">
                            <PlusCircle className="text-red-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Add Expense</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                <input 
                                    type="number" 
                                    placeholder="0.00"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input 
                                    type="date" 
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea 
                                    placeholder="What was this for?"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-20"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                                Record Expense
                            </button>
                        </form>
                    </div>
                </div>

                {/* LIST COLUMN (8/12) */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                            <Receipt className="text-gray-400" />
                            <h2 className="text-xl font-semibold text-gray-800">Recent History</h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                <div className="p-10 text-center text-gray-400">Loading expenses...</div>
                            ) : expenses.length === 0 ? (
                                <div className="p-10 text-center text-gray-400">No expenses recorded yet.</div>
                            ) : (
                                expenses.map((item) => (
                                    <div key={item._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center font-bold">
                                                {item.category[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{item.category}</h3>
                                                <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()} • {item.description || 'No description'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-red-600 font-bold text-lg">-${item.amount}</span>
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
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