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
      <main className="w-full flex-grow relative overflow-hidden bg-gradient-to-br from-[#ffe5db] to-[#cbb2a6] py-24 px-6 flex items-center justify-center min-h-[70vh]">
        {/* Symmetrical Ambient Warm Rose Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-36 bg-[#dfa38f]/10 rounded-full blur-[80px] pointer-events-none z-0" />
        
        {/* Clean Success Card */}
        <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-[#e8cdc1]/40 shadow-[0_12px_40px_rgba(45,41,38,0.08)] p-8 md:p-10 text-center space-y-6 flex flex-col items-center animate-in zoom-in-95 duration-300">
          <div className="w-14 h-14 bg-[#e8cdc1]/30 text-[#805c51] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl font-light">
              check_circle
            </span>
          </div>

          <div className="space-y-2">
            <h2 
              className="text-2xl md:text-3xl text-[#3d2f28] font-bold tracking-tight leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Welcome to Stephanie Keys!
            </h2>
            <p className="text-xs text-[#81756f] leading-relaxed max-w-xs mx-auto">
              Your account for <span className="font-bold text-[#3d2f28]">{formData.email}</span> has been successfully created. Get ready to elevate your piano playing.
            </p>
          </div>

          <div className="h-px bg-[#e8cdc1]/30 w-full" />

          <div className="flex flex-col gap-3 w-full pt-1">
            <button
              onClick={() => {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("guest_name", formData.name);
                localStorage.setItem("guest_email", formData.email);
                localStorage.setItem("guest_country", formData.country);
                window.dispatchEvent(new Event("storage"));
                onNavigate("dashboard");
              }}
              className="w-full bg-[#6e5a51] hover:bg-[#58473f] text-white text-xs font-bold uppercase tracking-[0.12em] py-3.5 px-6 rounded-xl border-none cursor-pointer active:scale-[0.98] transition-all shadow-sm"
            >
              Go to Student Dashboard
            </button>
            
            <button
              onClick={() => onNavigate("home")}
              className="w-full bg-transparent hover:bg-[#f3ecea] text-[#5c3a2e] text-xs font-bold uppercase tracking-widest py-3 rounded-xl border border-[#e8cdc1]/60 cursor-pointer active:scale-[0.98] transition-all"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex-grow relative overflow-hidden bg-[#fffaf7] py-20 px-6 flex items-center justify-center min-h-[85vh]">
      {/* Background Silk Texture */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none opacity-40"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,250,247,0.92) 0%, rgba(252,238,233,0.85) 100%), url('/floral.png')",
        }}
      />

      {/* Clean Create Account Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl border border-[#e8cdc1]/40 shadow-[0_12px_40px_rgba(45,41,38,0.08)] p-8 md:p-10 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2">
            <div className="h-px w-8 bg-[#e8cdc1]" />
            <span 
              className="text-xl text-[#805c51] font-serif select-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              𝄞
            </span>
            <div className="h-px w-8 bg-[#e8cdc1]" />
          </div>

          <h1 
            className="text-2xl md:text-3xl text-[#3d2f28] font-bold tracking-tight leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Create Account
          </h1>
          <p className="text-[#81756f] text-xs max-w-xs mx-auto font-medium leading-relaxed">
            Start your journey into advanced Gospel & Jazz piano playing.
          </p>
        </div>

        {error && (
          <div className="bg-[#fff0ed] border border-[#f5b4a4] text-[#a83b2a] rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-base select-none">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
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
              className="w-full bg-[#fffcfa] border border-[#e8cdc1] focus:border-[#ab7e66] rounded-xl px-4 py-3 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
            />
          </div>

          <div className="space-y-1">
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
              className="w-full bg-[#fffcfa] border border-[#e8cdc1] focus:border-[#ab7e66] rounded-xl px-4 py-3 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
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
                className="w-full bg-[#fffcfa] border border-[#e8cdc1] focus:border-[#ab7e66] rounded-xl px-4 py-3 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
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
                className="w-full bg-[#fffcfa] border border-[#e8cdc1] focus:border-[#ab7e66] rounded-xl px-4 py-3 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 transition-all outline-none"
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

          <div className="flex items-start gap-2.5 pt-2 ml-1">
            <input
              type="checkbox"
              name="agree"
              id="agree-checkbox"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-0.5 rounded border-[#e8cdc1] text-[#805c51] focus:ring-[#805c51] cursor-pointer"
            />
            <label htmlFor="agree-checkbox" className="text-[10px] text-[#81756f] leading-tight select-none cursor-pointer">
              I agree to the <button type="button" onClick={() => onNavigate("terms")} className="text-[#805c51] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">Terms of Service</button> and <button type="button" onClick={() => onNavigate("privacy")} className="text-[#805c51] font-bold hover:underline bg-transparent border-none cursor-pointer p-0">Privacy Policy</button>.
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#6e5a51] hover:bg-[#58473f] text-white text-xs font-bold uppercase tracking-[0.12em] py-3.5 px-6 rounded-xl border-none cursor-pointer active:scale-[0.98] transition-all shadow-sm"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-[#e8cdc1]/30">
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
