import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, FileText, User, ArrowLeft, LogOut } from 'lucide-react';

// --- CONFIGURATION ---
const SUPABASE_URL = ""; 
const SUPABASE_ANON_KEY = "";

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// --- STYLES (Optimized for 800x480) ---
const theme = {
  bg: "#101622",
  card: "#151a25",
  primary: "#135bec",
  textWhite: "#ffffff",
  textGray: "#92a4c9",
  green: "#10B981",
  orange: "#F59E0B",
  fontMain: "'Helvetica Neue', Helvetica, Arial, sans-serif"
};

// --- MOCK DATA ---
const MOCK_BILLS = [
  { id: '98234', date: '2026-01-12', total: 170.50, items: 4 },
  { id: '98235', date: '2026-01-14', total: 45.00, items: 1 },
  { id: '98236', date: '2026-01-15', total: 320.00, items: 3 },
  { id: '98237', date: '2026-01-16', total: 12.00, items: 1 }, // Added for scroll test
  { id: '98238', date: '2026-01-17', total: 55.00, items: 2 }, // Added for scroll test
];

const MOCK_INVOICE_DETAILS = {
  '98234': {
    items: [
      { desc: "Wireless Gaming Mouse", qty: 1, price: 45.00 },
      { desc: "USB-C Charging Cable (2m)", qty: 2, price: 10.00 },
      { desc: "Mechanical Keyboard", qty: 1, price: 85.00 },
      { desc: "Screen Cleaning Kit", qty: 1, price: 5.00 }
    ],
    subtotal: 155.00,
    tax: 15.50,
    total: 170.50
  }
};

// ================= COMPONENT: LOGIN PAGE =================
const Login = ({ onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if(mobile && name) setStep(2);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    onLogin({ name, mobile });
  };

  // Shared style for perfect symmetry between Inputs and Buttons
  const fieldStyle = {
    width: '100%', 
    height: '48px', // Explicit matching height
    padding: '0 15px', // Horizontal padding only (vertical handled by height)
    borderRadius: '8px',
    boxSizing: 'border-box', // Ensures borders don't affect width/height calculations
    fontSize: '1rem',
    outline: 'none'
  };

  const inputStyle = {
    ...fieldStyle,
    border: `1px solid ${theme.primary}`, 
    background: theme.bg, 
    color: 'white'
  };

  const buttonStyle = {
    ...fieldStyle,
    border: 'none',
    cursor: 'pointer', 
    fontWeight: 'bold',
    color: 'white'
  };

  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '16px', width: '350px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <h2 style={{ color: theme.textWhite, marginBottom: '20px', textAlign: 'center', fontSize: '1.4rem' }}>Smart Cart Login</h2>
        
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: theme.textGray, display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Full Name</label>
              <input 
                type="text" required value={name} onChange={e => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ color: theme.textGray, display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Mobile Number</label>
              <input 
                type="tel" required value={mobile} onChange={e => setMobile(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: theme.primary }}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
             <div style={{ marginBottom: '25px' }}>
              <label style={{ color: theme.textGray, display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Enter OTP</label>
              <input 
                type="text" placeholder="1234" required value={otp} onChange={e => setOtp(e.target.value)}
                style={{ ...inputStyle, textAlign: 'center', letterSpacing: '4px' }} 
              />
            </div>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: theme.green }}>
              Verify & Login
            </button>
            <p onClick={() => setStep(1)} style={{color: theme.textGray, textAlign: 'center', marginTop: '15px', cursor: 'pointer', fontSize: '0.8rem'}}>Back</p>
          </form>
        )}
      </div>
    </div>
  );
};


// ================= COMPONENT: INVOICE =================
const Invoice = ({ billId, data, onBack }) => {
  const details = data || MOCK_INVOICE_DETAILS['98234'];

  return (
    <div style={{ background: '#f6f6f6', height: '100%', display: 'flex', flexDirection: 'column', color: '#333' }}>
      
      {/* Sticky Header for Invoice View */}
      <div style={{ padding: '10px 20px', backgroundColor: '#e9e9e9', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center' }}>
        <button onClick={onBack} style={{ padding: '8px 15px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <span style={{ marginLeft: '15px', fontWeight: 'bold', color: '#555' }}>Viewing Invoice: {billId}</span>
      </div>

      {/* Scrollable Invoice Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div style={{ maxWidth: '700px', margin: 'auto', padding: '25px', border: '1px solid #eee', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
            <div>
              <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '20px' }}>City Center Mall</h1>
              <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#777' }}>123 Shopping Avenue, Tech District</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: 0, color: '#555', fontSize: '18px' }}>INVOICE</h2>
              <p style={{ margin: '5px 0 0', fontSize: '12px' }}><strong>Date:</strong> 2026-01-12</p>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ marginBottom: '20px', fontSize: '13px' }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>Bill To:</strong>
            <span>Mr. Alex Johnson (ID: M-8821)</span>
          </div>

          {/* Table */}
          <table style={{ width: '100%', lineHeight: 'inherit', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Item Description</th>
                <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {details.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.desc}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>${(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', fontSize: '13px' }}>
            <table style={{ width: '250px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>Subtotal:</td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee', textAlign: 'right' }}>${details.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee' }}>Tax (10%):</td>
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee', textAlign: 'right' }}>${details.tax.toFixed(2)}</td>
                </tr>
                <tr style={{ fontSize: '15px', fontWeight: 'bold', color: '#2c3e50', borderTop: '2px solid #333' }}>
                  <td style={{ padding: '6px' }}>Total Amount:</td>
                  <td style={{ padding: '6px', textAlign: 'right' }}>${details.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= COMPONENT: DASHBOARD =================
const Dashboard = ({ user, onLogout }) => {
  const [view, setView] = useState('home'); 
  const [bills, setBills] = useState([]);
  const [selectedBillId, setSelectedBillId] = useState(null);

  const fetchBills = async () => {
    if (supabase) {
      const { data, error } = await supabase.from('bills').select('*').eq('user_mobile', user.mobile);
      if (!error && data) setBills(data);
    } else {
      setBills(MOCK_BILLS);
    }
  };

  const handleViewBills = () => {
    fetchBills();
    setView('bills');
  };

  const handleOpenInvoice = (id) => {
    setSelectedBillId(id);
    setView('invoice');
  };

  // --- Dashboard Home (800x480 Optimized) ---
  if (view === 'home') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Compact Header */}
        <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: theme.card, border: `2px solid ${theme.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👨‍💼</div>
            <div>
              <div style={{ color: theme.textGray, fontSize: '0.7rem', fontWeight: 'bold' }}>WELCOME BACK</div>
              <div style={{ fontSize: '1.0rem', fontWeight: 'bold' }}>{user.name}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: theme.textGray, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
             <LogOut size={18}/> <span>Logout</span>
          </button>
        </div>

        {/* Content Area - Horizontal Layout for Laptop/Wide */}
        <div style={{ padding: '20px 25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ color: theme.textWhite, fontSize: '1.2rem', marginBottom: '15px' }}>Admin Dashboard</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', height: '100%', maxHeight: '320px' }}>
            
            {/* 1. Start Shopping */}
            <div 
              style={{ backgroundColor: theme.primary, borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', boxShadow: `0 5px 15px -5px ${theme.primary}`, transition: 'transform 0.1s' }}
              onClick={() => alert("Starting Shopping Session...")}
            >
              <ShoppingCart size={48} color="white" style={{marginBottom: '15px'}} />
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>Start Shopping</h3>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Create new session</p>
            </div>

            {/* 2. View Bills */}
            <div 
              style={{ backgroundColor: theme.card, borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderTop: `4px solid ${theme.green}` }}
              onClick={handleViewBills}
            >
              <FileText size={48} color={theme.green} style={{marginBottom: '15px'}} />
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>View Bills</h3>
              <p style={{ margin: 0, color: theme.textGray, fontSize: '0.9rem' }}>History & Invoices</p>
            </div>

            {/* 3. Edit User */}
            <div 
              style={{ backgroundColor: theme.card, borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', borderTop: `4px solid ${theme.orange}` }}
              onClick={() => alert("Edit User Profile logic here")}
            >
              <User size={48} color={theme.orange} style={{marginBottom: '15px'}} />
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>Edit User</h3>
              <p style={{ margin: 0, color: theme.textGray, fontSize: '0.9rem' }}>Manage profile</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --- List of Bills (Scrollable) ---
  if (view === 'bills') {
    return (
      <div style={{ height: '100%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px', fontSize: '1rem', alignSelf: 'flex-start' }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        
        <h2 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Your Purchase History</h2>
        
        {/* Scrollable Container for List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            {bills.map(bill => (
              <div 
                key={bill.id}
                onClick={() => handleOpenInvoice(bill.id)}
                style={{ backgroundColor: theme.card, padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid transparent' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = theme.primary}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Invoice #{bill.id}</div>
                  <div style={{ color: theme.textGray, fontSize: '0.8rem' }}>{bill.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: theme.green }}>${bill.total.toFixed(2)}</div>
                  <div style={{ color: theme.textGray, fontSize: '0.8rem' }}>{bill.items} items</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'invoice') {
    return <Invoice billId={selectedBillId} onBack={() => setView('bills')} />;
  }
};

// ================= MAIN APP COMPONENT =================
export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Fixed 800x480 Container
  return (
    <div style={{ 
      width: '800px', 
      height: '480px', 
      backgroundColor: theme.bg, 
      fontFamily: theme.fontMain, 
      color: theme.textWhite,
      overflow: 'hidden', // Prevent outer window scroll
      margin: '0 auto',   // Center on screen if viewed on larger monitor
      position: 'relative',
      border: '1px solid #333' // Optional: Defines the edge on larger screens
    }}>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  );
}