import { useState } from 'react';

interface ForgotPasswordProps {
  onNavigate: (view: any) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Simulate sending reset link
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <main className="w-full h-full flex-grow relative overflow-hidden bg-transparent py-2 px-4 flex items-center justify-center select-none">
        {/* Clean Success Card - Matches Dashboard & Auth Vibes */}
        <div className="relative z-10 w-full max-w-md bg-white/55 backdrop-blur-sm border-2 border-[#dfa38f] rounded-lg p-6 sm:p-7 text-center space-y-4 shadow-md flex flex-col items-center animate-auth-fade">
          <div className="w-12 h-12 bg-[#dfa38f]/20 text-[#805c51] rounded-full flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-2xl font-light">
              check_circle
            </span>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl text-[#3d2f28] font-bold tracking-tight leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Reset Link Sent!
            </h2>
            <p className="text-xs text-[#81756f] leading-relaxed max-w-xs mx-auto">
              We have sent a password reset link to <span className="font-bold text-[#3d2f28]">{email}</span>. Please check your email inbox and spam folder.
            </p>
          </div>

          <div className="h-px bg-[#dfa38f]/30 w-full" />

          <button
            onClick={() => onNavigate("signin")}
            style={{
              background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
              boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
              border: "1px solid #D9A998",
            }}
            className="w-full h-10 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.01] active:scale-95 text-white text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center shadow-none"
          >
            Back to Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-full flex-grow relative overflow-hidden bg-transparent py-2 px-4 flex items-center justify-center select-none">
      <div className="relative z-10 w-full max-w-md bg-white/55 backdrop-blur-sm rounded-lg border-2 border-[#dfa38f] shadow-md p-6 sm:p-7 flex flex-col gap-4 animate-auth-fade">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-[26px] text-[#3d2f28] font-bold tracking-tight leading-snug" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Reset Password
          </h1>
          <p className="text-[#81756f] text-xs max-w-xs mx-auto font-medium leading-relaxed">
            Enter your account's email address and we will send you a link to reset your password.
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
            <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-1">Email Address</label>
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
              Send Reset Link
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-[#dfa38f]/30">
          <p className="text-[11px] text-[#81756f]">
            Remember your password?{' '}
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
