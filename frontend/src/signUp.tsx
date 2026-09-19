import { useState } from 'react';
import SearchableCountryDropdown from './SearchableCountryDropdown';

interface SignUpProps {
  onNavigate: (view: any) => void;
}

export default function SignUp({ onNavigate }: SignUpProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'Indonesia',
    agree: false
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agree) {
      setError('You must agree to the Terms of Service & Privacy Policy');
      return;
    }

    // Simulate successful account creation
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <main className="w-full h-full flex-grow relative overflow-hidden bg-transparent py-2 px-4 flex items-center justify-center select-none">
        {/* Symmetrical Ambient Warm Rose Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-36 bg-[#dfa38f]/10 rounded-full blur-[80px] pointer-events-none z-0" />
        
        {/* Clean Success Card - Matches Dashboard Page Vibes */}
        <div className="relative z-10 w-full max-w-md bg-white/55 backdrop-blur-sm rounded-lg border-2 border-[#dfa38f] shadow-md p-6 sm:p-7 text-center space-y-4 flex flex-col items-center animate-in zoom-in-95 duration-300">
          <div className="w-12 h-12 bg-[#dfa38f]/20 text-[#805c51] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl font-light">
              check_circle
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 
              className="text-2xl text-[#3d2f28] font-bold tracking-tight leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Welcome to Stephanie Keys!
            </h2>
            <p className="text-xs text-[#81756f] leading-relaxed max-w-xs mx-auto">
              Your account for <span className="font-bold text-[#3d2f28]">{formData.email}</span> has been successfully created.
            </p>
          </div>

          <div className="h-px bg-[#dfa38f]/30 w-full" />

          <div className="flex flex-col gap-2.5 w-full pt-1">
            <button
              onClick={() => {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("guest_name", formData.name);
                localStorage.setItem("full_name", formData.name);
                localStorage.setItem("guest_email", formData.email);
                localStorage.setItem("guest_country", formData.country);
                window.dispatchEvent(new Event("storage"));
                onNavigate("dashboard");
              }}
              style={{
                background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                border: "1px solid #D9A998",
              }}
              className="w-full h-10 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.01] active:scale-95 text-white text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center shadow-none"
            >
              Go to Student Dashboard
            </button>
            
            <button
              onClick={() => onNavigate("home")}
              className="w-full bg-white/70 hover:bg-white text-[#5c3a2e] text-xs font-bold uppercase tracking-widest h-9 rounded-lg border border-[#dfa38f]/60 cursor-pointer active:scale-[0.98] transition-all"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-full flex-grow relative overflow-hidden bg-transparent py-2 px-4 flex items-center justify-center select-none">
      {/* Clean Create Account Card - Matches Dashboard Page Vibes */}
      <div className="relative z-10 w-full max-w-md bg-white/55 backdrop-blur-sm rounded-lg border-2 border-[#dfa38f] shadow-md p-5 sm:p-6 flex flex-col gap-3 animate-auth-fade">
        {/* Header (Musical icon removed) */}
        <div className="text-center space-y-1">
          <h1 
            className="text-2xl text-[#3d2f28] font-bold tracking-tight leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Create Account
          </h1>
          <p className="text-[#81756f] text-[11px] max-w-xs mx-auto font-medium leading-relaxed">
            Start your journey into advanced Gospel & Jazz piano playing.
          </p>
        </div>

        {error && (
          <div className="bg-[#fff0ed] border border-[#f5b4a4] text-[#a83b2a] rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-sm select-none">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="space-y-0.5">
            <label 
              className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Stephanie Halim"
              className="w-full bg-[#fffcfa]/90 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
            />
          </div>

          <div className="space-y-0.5">
            <label 
              className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@example.com"
              className="w-full bg-[#fffcfa]/90 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-0.5">
              <label 
                className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full bg-[#fffcfa]/90 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
              />
            </div>

            <div className="space-y-0.5">
              <label 
                className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="w-full bg-[#fffcfa]/90 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
              />
            </div>
          </div>

          <SearchableCountryDropdown
            value={formData.country}
            onChange={(country) => {
              setFormData(prev => ({ ...prev, country }));
              setError('');
            }}
          />

          <div className="flex items-start gap-2 pt-0.5 ml-1">
            <input
              type="checkbox"
              name="agree"
              id="agree-checkbox"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-0.5 rounded border-[#dfa38f] text-[#805c51] focus:ring-[#805c51] cursor-pointer"
            />
            <label htmlFor="agree-checkbox" className="text-[10px] text-[#81756f] leading-tight select-none cursor-pointer">
              I agree to the <button type="button" onClick={() => onNavigate("terms")} className="text-[#805c51] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">Terms of Service</button> and <button type="button" onClick={() => onNavigate("privacy")} className="text-[#805c51] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">Privacy Policy</button>.
            </label>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                border: "1px solid #D9A998",
              }}
              className="w-full h-9.5 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.01] active:scale-95 text-white text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center shadow-none"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="text-center pt-1.5 border-t border-[#dfa38f]/30">
          <p className="text-[11px] text-[#81756f]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate("signin")}
              className="text-[#805c51] font-bold hover:underline bg-transparent border-none cursor-pointer p-0 ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
