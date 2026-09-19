import React, { useState, useEffect, useRef } from 'react';

interface UserProfileProps {
  onNavigate?: (view: any) => void;
  initialTab?: string;
}

export default function UserProfile({ onNavigate }: UserProfileProps) {
  // Personal details states
  const [displayName, setDisplayName] = useState<string>(() => {
    return localStorage.getItem('guest_name') || localStorage.getItem('user_name') || 'Stephanie Keys';
  });
  const [fullName, setFullName] = useState<string>(() => {
    return localStorage.getItem('full_name') || 'Stephanie Halim';
  });
  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem('guest_email') || 'stephanie@gmail.com';
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return (
      localStorage.getItem('user_avatar') ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80'
    );
  });
  const [primaryInstrument, setPrimaryInstrument] = useState<'Piano' | 'Violin'>('Piano');

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Alerts & modal states
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'subscription' | 'invoices' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setAvatarUrl(result);
          localStorage.setItem('user_avatar', result);
          window.dispatchEvent(new Event('storage'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist to localStorage
    if (displayName.trim()) {
      localStorage.setItem('guest_name', displayName.trim());
      localStorage.setItem('user_name', displayName.trim());
    }
    if (fullName.trim()) {
      localStorage.setItem('full_name', fullName.trim());
    }
    if (email.trim()) {
      localStorage.setItem('guest_email', email.trim());
    }
    if (avatarUrl.trim()) {
      localStorage.setItem('user_avatar', avatarUrl.trim());
    }

    // Trigger storage sync across layout & components
    window.dispatchEvent(new Event('storage'));

    // Clear password inputs
    setCurrentPassword('');
    setNewPassword('');

    // Show feedback
    setAlertMessage('Your profile & account settings have been saved successfully!');
    setTimeout(() => setAlertMessage(null), 4000);
  };

  return (
    <main className="w-full flex-grow relative overflow-hidden bg-transparent py-8 sm:py-12 px-4 flex items-center justify-center select-none animate-in fade-in duration-300">
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md border-2 border-[#dfa38f] rounded-2xl shadow-xl overflow-hidden">
        {/* Title Bar Header */}
        <div className="px-6 sm:px-8 py-4 sm:py-5 border-b-2 border-[#dfa38f]/40 bg-gradient-to-r from-white/80 via-white/50 to-white/80 flex items-center justify-between">
          <h1
            className="text-lg sm:text-xl md:text-2xl font-bold text-[#3d2f28] tracking-tight flex items-center gap-2.5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="material-symbols-outlined text-[#805c51] text-2xl font-light select-none">
              manage_accounts
            </span>
            <span>MY PROFILE & ACCOUNT SETTINGS</span>
          </h1>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="text-[11px] font-bold text-[#805c51] hover:underline uppercase tracking-wider bg-transparent border-none cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>Dashboard</span>
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6 sm:space-y-7">
          {/* Notification Alert */}
          {alertMessage && (
            <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-xl px-4 py-3 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                <span>{alertMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setAlertMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 bg-transparent border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* AVATAR SECTION */}
          <div className="bg-white/45 backdrop-blur-xs border border-[#dfa38f]/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
            {/* Left: Avatar Image with Luxurious Rose Gold Metallic Frame */}
            <div className="flex flex-col items-center shrink-0">
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8E3DB 25%, #E2B0A4 50%, #C48B7C 75%, #8C5446 100%)',
                  boxShadow: '0 4px 14px rgba(181, 114, 98, 0.35), inset 0 1px 1.5px #FFFFFF',
                  border: '2px solid #FFFFFF',
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 flex items-center justify-center overflow-hidden shadow-md"
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover rounded-full bg-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80';
                  }}
                />
              </div>
              <span
                className="mt-2 text-xs sm:text-sm font-bold text-[#3d2f28] text-center"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {displayName.split(' ')[0]} {displayName.split(' ')[1]?.[0] || 'H'}.
              </span>
            </div>

            {/* Right: Change Avatar Controls */}
            <div className="flex-1 w-full space-y-2">
              <label className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#7a5446]">
                Change Avatar
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => {
                    setAvatarUrl(e.target.value);
                    localStorage.setItem('user_avatar', e.target.value);
                    window.dispatchEvent(new Event('storage'));
                  }}
                  placeholder="Paste Image URL..."
                  className="flex-1 bg-white/80 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] placeholder-[#b88e7e]/50 outline-none transition-all"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2 px-3.5 bg-white/80 hover:bg-white text-[#805c51] hover:text-[#5a3b32] border border-[#dfa38f] rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-sm">upload</span>
                  <span>Upload</span>
                </button>
              </div>

              <p className="text-[10px] text-[#81756f] font-medium">
                Enter an image URL or upload a JPG/PNG photo from your computer.
              </p>
            </div>
          </div>

          {/* -- PERSONAL DETAILS ----------------------------------------------- */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-[#dfa38f]/40 pb-1.5">
              <span className="material-symbols-outlined text-sm text-[#805c51]">badge</span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#7a5446]">
                Personal Details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Stephanie Keys"
                  className="w-full bg-white/80 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] font-semibold outline-none transition-all"
                  required
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                    Full Name
                  </label>
                  <span className="text-[9.5px] text-[#81756f] italic font-medium">
                    (Used for Certificates)
                  </span>
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Stephanie Halim"
                  className="w-full bg-white/80 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] font-semibold outline-none transition-all"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                    Email Address
                  </label>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9.5px] font-bold inline-flex items-center gap-0.5">
                    <span>✔</span> Verified
                  </span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="stephanie@gmail.com"
                  className="w-full bg-white/80 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] font-semibold outline-none transition-all"
                  required
                />
              </div>

              {/* Primary Instrument Toggle */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                  Primary Inst.
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrimaryInstrument('Piano')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                      primaryInstrument === 'Piano'
                        ? 'bg-gradient-to-r from-[#dfa38f] to-[#cb9e8a] text-white border-[#b58474] shadow-xs'
                        : 'bg-white/70 text-[#7a5446] border-[#dfa38f]/60 hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">piano</span>
                    <span>Piano</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrimaryInstrument('Violin')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                      primaryInstrument === 'Violin'
                        ? 'bg-gradient-to-r from-[#dfa38f] to-[#cb9e8a] text-white border-[#b58474] shadow-xs'
                        : 'bg-white/70 text-[#7a5446] border-[#dfa38f]/60 hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">music_note</span>
                    <span>Violin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* -- MEMBERSHIP & BILLING --------------------------------------------- */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-[#dfa38f]/40 pb-1.5">
              <span className="material-symbols-outlined text-sm text-[#805c51]">credit_card</span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#7a5446]">
                Membership & Billing
              </span>
            </div>

            <div className="bg-white/45 backdrop-blur-xs border border-[#dfa38f]/60 rounded-xl p-4 sm:p-5 space-y-3">
              {/* Row 1: Plan Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                  Plan Status
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#eac4b1] to-[#dfa38f] text-[#4a2e25] border border-[#d9a998] font-black text-[10px] uppercase tracking-widest shadow-2xs">
                    ACTIVE MEMBER
                  </span>
                  <span className="text-[#3d2f28] font-bold">
                    Annual Plan ($14.16/mo billed yearly)
                  </span>
                </div>
              </div>

              {/* Row 2: Trial Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs border-t border-[#dfa38f]/30 pt-2.5">
                <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                  Trial Status
                </span>
                <span className="text-[#805c51] font-bold">
                  14-Day Free Trial (Ends Oct 03, 2026)
                </span>
              </div>

              {/* Row 3: Next Renewal */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs border-t border-[#dfa38f]/30 pt-2.5">
                <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                  Next Renewal
                </span>
                <span className="text-[#3d2f28] font-bold">
                  Billed $169.99 on Oct 03, 2026
                </span>
              </div>

              {/* Row 4: Payment Method */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs border-t border-[#dfa38f]/30 pt-2.5">
                <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                  Payment Method
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white border border-[#dfa38f]/60 rounded text-[10px] font-black text-[#1A1F71]">
                    VISA
                  </span>
                  <span className="text-[#3d2f28] font-bold">
                    Visa ending in •••• 4242
                  </span>
                </div>
              </div>

              {/* Action Buttons: Manage / Cancel Subscription & View Billing History */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModal('subscription')}
                  className="flex-1 py-2 px-3 rounded-lg bg-white/80 hover:bg-white text-[#7a5446] border border-[#dfa38f] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-98 shadow-2xs text-center"
                >
                  Manage / Cancel Subscription
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('invoices')}
                  className="flex-1 py-2 px-3 rounded-lg bg-white/80 hover:bg-white text-[#7a5446] border border-[#dfa38f] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-98 shadow-2xs text-center"
                >
                  View Billing History / Invoices
                </button>
              </div>
            </div>
          </div>

          {/* -- SECURITY --------------------------------------------------------- */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-[#dfa38f]/40 pb-1.5">
              <span className="material-symbols-outlined text-sm text-[#805c51]">lock</span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#7a5446]">
                Security
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/80 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/80 border border-[#dfa38f] focus:border-[#ab7e66] rounded-lg px-3 py-2 text-xs text-[#4a2e25] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              style={{
                background:
                  'linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)',
                boxShadow: 'inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d',
                border: '1px solid #D9A998',
              }}
              className="w-full h-11 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.01] active:scale-95 text-white text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center shadow-none gap-2"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>SAVE PROFILE CHANGES</span>
            </button>
          </div>
        </form>
      </div>

      {/* Subscription Modal */}
      {activeModal === 'subscription' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#dfa38f] p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3
              className="text-lg font-bold text-[#3d2f28]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Subscription Management
            </h3>
            <p className="text-xs text-[#6e5448] leading-relaxed">
              Your Annual Membership is currently active under the 14-Day Free Trial. Your subscription will renew on Oct 03, 2026.
            </p>
            <div className="bg-[#fff8f6] p-3 rounded-lg border border-[#dfa38f]/40 space-y-1.5 text-xs text-[#5a3b32]">
              <div className="flex justify-between">
                <span className="font-semibold">Plan:</span>
                <span className="font-bold">Annual Membership ($169.99/yr)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Next Payment:</span>
                <span className="font-bold">Oct 03, 2026</span>
              </div>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Your subscription cancellation request has been recorded. You can continue accessing all features until Oct 03, 2026.');
                  setActiveModal(null);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel Subscription
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2 px-4 rounded-lg bg-[#dfa38f] text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Modal */}
      {activeModal === 'invoices' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#dfa38f] p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3
              className="text-lg font-bold text-[#3d2f28]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Billing History & Invoices
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#fff8f6] rounded-lg border border-[#dfa38f]/40 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-[#3d2f28]">INV-2026-0901</span>
                  <span className="text-[10px] text-[#81756f]">Sep 19, 2026 • 14-Day Free Trial</span>
                </div>
                <span className="font-bold text-emerald-700">$0.00</span>
              </div>
              <div className="p-3 bg-[#fff8f6] rounded-lg border border-[#dfa38f]/40 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-[#3d2f28]">INV-2026-0814</span>
                  <span className="text-[10px] text-[#81756f]">Aug 14, 2026 • Sheet Music Bundle</span>
                </div>
                <span className="font-bold text-[#3d2f28]">$15.00</span>
              </div>
            </div>
            <div className="text-right pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2 px-4 rounded-lg bg-[#dfa38f] text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
