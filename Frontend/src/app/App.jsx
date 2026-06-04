import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Register from "../feature/auth/pages/Register";
import Login from "../feature/auth/pages/Login";

// Temporary Home/Dashboard component
function HomePlaceholder() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-200 font-sans">
      <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 text-center space-y-6 backdrop-blur-md">
        <div className="space-y-2">
          <span className="font-serif text-2xl font-bold tracking-[0.4em] uppercase text-white">SNITCH</span>
          <h2 className="text-lg font-light tracking-wide text-neutral-300">Style Engine</h2>
        </div>
        <p className="text-xs text-neutral-400 font-light leading-relaxed">
          Welcome back to the streetwear hub. Your AI style matching dashboard is loading credentials.
        </p>
        <div className="flex gap-3 pt-2">
          <Link 
            to="/register" 
            className="flex-1 py-3 bg-white text-black font-semibold text-xs rounded-xl tracking-wider hover:bg-neutral-200 transition-all text-center cursor-pointer"
          >
            REGISTER
          </Link>
          <Link 
            to="/login" 
            className="flex-1 py-3 border border-neutral-800 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl tracking-wider transition-all text-center cursor-pointer"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing redirects to Register for testing */}
        <Route path="/" element={<HomePlaceholder />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

