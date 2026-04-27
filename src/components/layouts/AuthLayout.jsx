import React from "react";
import CARD_1 from "../../assets/images/CARD_1.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#09090b] selection:bg-indigo-500/30">
      {/* LEFT PANEL */}
      <div className="w-full lg:w-1/2 px-8 md:px-16 pt-8 pb-12 flex flex-col justify-center relative z-10 bg-[#09090b]">
        <div className="absolute top-8 left-8 md:left-12 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Expense<span className="text-indigo-400">Tracker</span>
          </h2>
        </div>
        
        <div className="w-full max-w-md mx-auto flex flex-col justify-center h-full">
          {children}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-[#09090b] relative items-center justify-center overflow-hidden border-l border-indigo-500/20 shadow-[inset_1px_0_40px_rgba(99,102,241,0.05)]">
        
        {/* Abstract Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,#00000000_0%,#09090b_100%)]"></div>
        
        {/* Glowing Orbs */}
        <div className="w-[45rem] h-[45rem] rounded-full bg-indigo-600/15 blur-[120px] absolute -top-20 -right-20 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="w-[35rem] h-[35rem] rounded-full bg-blue-600/10 blur-[100px] absolute -bottom-20 -left-20 mix-blend-screen" />

        <div className="relative z-20 flex flex-col items-center max-w-2xl w-full px-12">
          
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-tight">
              Take Control of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Your Finances</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
              Track your income, manage expenses, and achieve your financial goals with our premium analytics dashboard.
            </p>
          </div>

          {/* Floating Showcase */}
          <div className="relative w-full aspect-[4/3] flex justify-center items-center group">
             
            {/* The bobbing wrapper */}
            <div className="relative w-full h-full flex justify-center items-center transition-transform duration-1000 ease-in-out transform hover:-translate-y-2" style={{ animation: 'float 6s ease-in-out infinite' }}>
                
                <style>{`
                  @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                  }
                `}</style>

                {/* Floating Badges */}
                <div className="absolute -top-4 -right-2 z-30 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                  <span className="text-sm font-bold tracking-wide">+ $2,450.00</span>
                </div>

                <div className="absolute bottom-10 left-0 z-30 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.2)] flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>
                  <span className="text-sm font-bold tracking-wide">- $120.50</span>
                </div>

                {/* Overlapping Stats Card */}
                <div className="absolute top-12 -left-6 z-20 w-64 transform -rotate-6 transition-transform duration-500 hover:rotate-0 hover:scale-105 shadow-2xl">
                  <StatsInfoCard
                    icon={<LuTrendingUpDown />}
                    label="Current Balance"
                    value="43,000"
                    color="bg-indigo-500"
                  />
                </div>

                {/* Main Image */}
                <div className="absolute inset-x-0 bottom-0 top-24 bg-gradient-to-t from-[#09090b] via-transparent to-transparent z-10 rounded-2xl pointer-events-none"></div>
                <img
                  src={CARD_1}
                  className="w-[75%] ml-16 mb-8 rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.25)] ring-1 ring-white/10 transform rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105"
                  alt="Dashboard Preview"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-5 bg-zinc-900/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
      <div className={`w-12 h-12 flex items-center justify-center text-[24px] text-white ${color} rounded-xl shadow-inner`}>
        {icon}
      </div>

      <div className="flex flex-col justify-center">
        <h6 className="text-xs text-zinc-400 font-medium mb-1 uppercase tracking-wider">{label}</h6>
        <span className="text-xl font-bold text-white tracking-tight">${value}</span>
      </div>
      
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 w-1/3 group-hover:w-full transition-all duration-500 ease-out"></div>
    </div>
  );
};
