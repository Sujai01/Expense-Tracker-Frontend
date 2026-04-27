import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Lazy load pages for performance optimization
const Login = lazy(() => import("./pages/auth/Login"));
const SignUP = lazy(() => import("./pages/auth/SignUP"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Root />}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUP/>}/>
            
            <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
            <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>}/>
            <Route path="/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>}/>
          </Routes>
        </Suspense>
      </Router>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a'
          }
        }} 
      />
    </UserContextProvider>
  )
}

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <DashboardLayout>{children}</DashboardLayout> : <Navigate to="/login" />;
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default App;