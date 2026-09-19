import { useState } from 'react';

interface SignInProps {
  onNavigate: (view: any) => void;
}

export default function SignIn({ onNavigate }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    // Simulate successful login
    const existingFullName = localStorage.getItem("full_name");
    const existingName = localStorage.getItem("guest_name");
    if (!existingFullName && !existingName) {
      const derivedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      localStorage.setItem("full_name", derivedName);
      localStorage.setItem("guest_name", derivedName);
    } else if (existingFullName && !existingName) {
      localStorage.setItem("guest_name", existingFullName);
    } else if (existingName && !existingFullName) {
      localStorage.setItem("full_name", existingName);
    }
    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("storage"));
    onNavigate("dashboard");
  };

  return (
    <main className="w-full h-full flex-grow relative overflow-hidden bg-transparent py-2 px-4 flex items-center justify-center select-none">
      {/* Clean Sign In Card - Matches Dashboard Page Vibes */}
      <div className="relative z-10 w-full max-w-md bg-white/55 backdrop-blur-sm rounded-lg border-2 border-[#dfa38f] shadow-md p-6 sm:p-7 flex flex-col gap-4 animate-auth-fade">
        {/* Header (Musical icon removed) */}
        <div className="text-center space-y-1.5">
          <h1 
            className="text-2xl sm:text-[26px] text-[#3d2f28] font-bold tracking-tight leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Sign In
          </h1>
          <p className="text-[#81756f] text-xs max-w-xs mx-auto font-medium leading-relaxed">
            Enter your credentials to access your piano lessons & personal dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-[#fff0ed] border border-[#f5b4a4] text-[#a83b2a] rounded-lg px-3 py-2 text-xs font-bold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-sm select-none">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label 
              className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="yourname@example.com"
                className="w-full bg-[#fffcfa]/90 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3.5 py-2.5 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label 
                className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446]"
              >
                Password
              </label>
              <button 
                type="button" 
                onClick={() => onNavigate("forgotpassword")}
                className="text-[10px] font-bold text-[#805c51] hover:text-[#5c3a2e] hover:underline bg-transparent border-none cursor-pointer transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              className="w-full bg-[#fffcfa]/90 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3.5 py-2.5 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                border: "1px solid #D9A998",
              }}
              className="w-full h-10 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.01] active:scale-95 text-white text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center shadow-none"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-[#dfa38f]/30">
          <p className="text-[11px] text-[#81756f]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="text-[#805c51] font-bold hover:underline bg-transparent border-none cursor-pointer p-0 ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
