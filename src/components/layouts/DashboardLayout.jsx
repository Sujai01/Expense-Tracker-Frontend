import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { LayoutDashboard, HandCoins, ReceiptIndianRupee, LogOut, User } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden selection:bg-indigo-500/30">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#09090b] border-r border-white/5 flex flex-col shrink-0 relative z-20">
        <div className="p-8 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent tracking-tight">
          ExpenseTracker
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"}`}>
            <LayoutDashboard size={18} className={location.pathname === '/dashboard' ? "text-indigo-400" : ""} /> Dashboard
          </NavLink>
          <NavLink to="/income" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"}`}>
            <HandCoins size={18} className={location.pathname === '/income' ? "text-green-400" : ""} /> Income
          </NavLink>
          <NavLink to="/expense" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"}`}>
            <ReceiptIndianRupee size={18} className={location.pathname === '/expense' ? "text-red-400" : ""} /> Expenses
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full rounded-xl text-sm font-medium transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* HEADER */}
        <header className="h-20 flex justify-end items-center px-10 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 px-2 py-1.5 rounded-full pr-5">
             <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700 overflow-hidden">
                {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User size={16} className="text-zinc-400" />
                )}
             </div>
             <span className="text-sm font-semibold text-zinc-200">{user?.fullName || "User"}</span>
          </div>
        </header>
        
        {/* PAGE CONTENT */}
        <section className="flex-1 overflow-y-auto p-10 relative z-0">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both h-full">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;