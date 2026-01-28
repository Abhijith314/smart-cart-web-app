import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Invoice from './components/Invoice';

// --- CONFIGURATION ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ================= MAIN APP COMPONENT =================
export default function App() {
  const [session, setSession] = useState(null);
  const [directBillId, setDirectBillId] = useState(null);

  useEffect(() => {
    // 1. Check for Direct Bill URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setDirectBillId(id);
    }

    // 2. Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // If a raw ID is in URL, we show Invoice View directly (Public Mode)
  if (directBillId) {
    // Small wrapper to allow going "Back" to home (which might mean Login if not logged in)
    const handleBack = () => {
      // Clear URL param without reload
      window.history.pushState({}, document.title, window.location.pathname);
      setDirectBillId(null);
    };

    // Public Invoice View
    return <Invoice billId={directBillId} onBack={handleBack} supabase={supabase} />;
  }

  // Main App Flow
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {!session ? (
        <Login onLogin={setSession} supabase={supabase} />
      ) : (
        <Dashboard session={session} onLogout={() => supabase.auth.signOut()} supabase={supabase} />
      )}
    </div>
  );
}