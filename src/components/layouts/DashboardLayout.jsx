import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { 
  LayoutDashboard, 
  HandCoins, 
  ReceiptIndianRupee, 
  LogOut,
  User as UserIcon
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/income", icon: <HandCoins size={20} />, label: "Income" },
    { to: "/expense", icon: <ReceiptIndianRupee size={20} />, label: "Expenses" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
             ExpenseTracker
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-primary text-white shadow-lg shadow-purple-200" : "text-gray-500 hover:bg-gray-50"
                }`
              }
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-end items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-primary border border-purple-200">
               {user?.profileImageUrl ? (
                 <img src={user.profileImageUrl} alt="pfp" className="rounded-full h-full w-full object-cover" />
               ) : <UserIcon size={20} />}
            </div>
          </div>
        </header>
        
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;