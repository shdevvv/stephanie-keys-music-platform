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
    const saved = localStorage.getItem('user_avatar');
    if (!saved || saved.includes('unsplash.com')) {
      localStorage.setItem('user_avatar', '/profile-photo.jpg');
      return '/profile-photo.jpg';
    }
    return saved;
  });
  const [learningFocus, setLearningFocus] = useState<'Piano' | 'Violin' | 'ABRSM Theory'>(() => {
    return (localStorage.getItem('user_learning_focus') as any) || 'Piano';
  });

  // Security edit state
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Subscription state (active vs canceled)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'canceled'>(() => {
    return (localStorage.getItem('user_subscription_status') as 'active' | 'canceled') || 'active';
  });

  // Alerts & modal states
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ header: string; body: string; type?: 'cancel' | 'success' } | null>(null);
  const [renderedModal, setRenderedModal] = useState<'subscription' | 'invoices' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (type: 'subscription' | 'invoices') => {
    setRenderedModal(type);
    requestAnimationFrame(() => {
      setIsModalOpen(true);
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setRenderedModal(null);
    }, 280);
  };

  // Invoices list data
  const invoicesList = [
    {
      id: 'INV-2026-0901',
      date: 'Sep 19, 2026',
      item: '14-Day Free Trial',
      status: 'Paid / Trial',
      statusType: 'trial',
      amount: '$0.00',
      paymentMethod: 'Visa ending in •••• 4242',
    },
    {
      id: 'INV-2026-0814',
      date: 'Aug 14, 2026',
      item: 'Sheet Music Bundle',
      status: 'Paid',
      statusType: 'paid',
      amount: '$15.00',
      paymentMethod: 'Visa ending in •••• 4242',
    },
  ];

  const handleDownloadInvoice = (inv: (typeof invoicesList)[0]) => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${inv.id} - Stephanie Keys</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; color: #3d2f28; background: #fff; padding: 40px; max-width: 650px; margin: 0 auto; line-height: 1.5; }
    .header { border-bottom: 2px solid #dfa38f; padding-bottom: 20px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 700; color: #4a2e25; }
    .brand-sub { font-size: 11px; color: #8c675a; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px; }
    .inv-meta { text-align: right; }
    .inv-num { font-size: 18px; font-weight: 700; color: #8c1d24; font-family: monospace; }
    .inv-date { font-size: 12px; color: #81756f; margin-top: 4px; }
    .badge { display: inline-block; margin-top: 8px; padding: 3px 10px; background: #dcfce7; color: #166534; border: 1px solid #86efac; border-radius: 9999px; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-grid { display: flex; justify-content: space-between; margin-bottom: 28px; gap: 20px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #81756f; font-weight: 700; margin-bottom: 4px; }
    .value { font-size: 14px; font-weight: 700; color: #3d2f28; }
    .sub-value { font-size: 12px; color: #6e5448; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th { text-align: left; padding: 10px 12px; background: #faf2ed; color: #6e4b3f; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #dfa38f; }
    td { padding: 14px 12px; border-bottom: 1px solid #ebd5cc; font-size: 13px; }
    .amount { text-align: right; font-weight: 700; }
    .total-row td { font-size: 15px; font-weight: 800; color: #4a2e25; border-bottom: 2px solid #dfa38f; padding-top: 16px; padding-bottom: 16px; background: #fffaf8; }
    .footer { margin-top: 45px; border-top: 1px dashed #ebd5cc; padding-top: 20px; font-size: 11.5px; color: #81756f; text-align: center; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Stephanie Keys</div>
      <div class="brand-sub">Official Payment Receipt &amp; Tax Invoice</div>
    </div>
    <div class="inv-meta">
      <div class="inv-num">${inv.id}</div>
      <div class="inv-date">Issued: ${inv.date}</div>
      <span class="badge">● ${inv.status}</span>
    </div>
  </div>

  <div class="info-grid">
    <div>
      <div class="label">Billed To</div>
      <div class="value">${fullName || displayName}</div>
      <div class="sub-value">${email}</div>
    </div>
    <div style="text-align: right;">
      <div class="label">Payment Method</div>
      <div class="value">${inv.paymentMethod}</div>
      <div class="sub-value">Status: Verified &amp; Cleared</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div style="font-weight: 700; color: #3d2f28;">${inv.item}</div>
          <div style="font-size: 11.5px; color: #81756f; margin-top: 2px;">Digital Subscription &amp; Platform Access</div>
        </td>
        <td class="amount">${inv.amount}</td>
      </tr>
      <tr class="total-row">
        <td>Total Paid (USD)</td>
        <td class="amount">${inv.amount}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p style="margin: 0 0 6px 0; font-weight: 600; color: #52352b;">Thank you for learning with Stephanie Keys Music Platform!</p>
    <p style="margin: 0;">For inquiries or support, please contact us at support@stephaniekeys.com</p>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`);
        printWindow.document.close();
      }
    } catch {
      // ignore
    }

    setToast({
      header: 'Download Started',
      body: `Invoice ${inv.id} is ready for download/print.`,
      type: 'success',
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar && !savedAvatar.includes('unsplash.com')) {
      setAvatarUrl(savedAvatar);
    } else {
      setAvatarUrl('/profile-photo.jpg');
      localStorage.setItem('user_avatar', '/profile-photo.jpg');
    }
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

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

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
    localStorage.setItem('user_learning_focus', learningFocus);

    // Trigger storage sync across layout & components
    window.dispatchEvent(new Event('storage'));

    // Clear password inputs and lock back to read-only
    setCurrentPassword('');
    setNewPassword('');
    setIsEditingSecurity(false);

    // Show feedback
    setAlertMessage('Your profile & account settings have been saved successfully!');
    setTimeout(() => setAlertMessage(null), 4000);
  };

  return (
    <main className="w-full flex-grow relative overflow-hidden bg-transparent py-8 sm:py-12 px-4 flex items-center justify-center select-none animate-in fade-in duration-300">
      <style>{`
        .shop-btn-theme {
          background: linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%);
          box-shadow: inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d;
          border: 1px solid #D9A998;
          color: #ffffff;
        }
        .shop-btn-theme:hover {
          filter: brightness(1.22);
          box-shadow: inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d, 0 4px 14px rgba(181, 114, 98, 0.4);
          transform: scale(1.015);
        }
        .shop-btn-outline {
          background: rgba(255, 255, 255, 0.85);
          color: #7a5446;
          border: 1px solid rgba(223, 163, 143, 0.7);
          transition: all 0.22s ease-out;
        }
        .shop-btn-outline:hover {
          background: linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%) !important;
          box-shadow: inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d, 0 3px 10px rgba(181, 114, 98, 0.3) !important;
          border: 1px solid #D9A998 !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Toast Alert - Top Screen */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md bg-white/95 backdrop-blur-md border-2 border-[#dfa38f] shadow-[0_12px_36px_rgba(140,85,70,0.25)] rounded-[8px] p-4 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                toast.type === 'cancel'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {toast.type === 'cancel' ? 'warning' : 'check_circle'}
              </span>
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#3d2f28]">
                {toast.header}
              </h4>
              <p className="text-xs text-[#6e5448] leading-relaxed">
                {toast.body}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-[#967366] hover:text-[#45271d] p-1 rounded transition-colors bg-transparent border-none cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Main Container Card - Reduced border-radius to 8px */}
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md border-2 border-[#dfa38f] rounded-[8px] shadow-xl overflow-hidden">
        {/* Title Bar Header - Dashboard button removed */}
        <div className="px-6 sm:px-8 py-4 sm:py-5 border-b-2 border-[#dfa38f]/40 bg-gradient-to-r from-white/80 via-white/50 to-white/80 flex items-center justify-between">
          <h1
            className="text-lg sm:text-xl md:text-2xl font-bold text-[#3d2f28] tracking-tight flex items-center gap-2.5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="material-symbols-outlined text-[#805c51] text-2xl font-light select-none">
              manage_accounts
            </span>
            <span>MY PROFILE &amp; ACCOUNT SETTINGS</span>
          </h1>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6 sm:space-y-7">
          {/* Notification Alert */}
          {alertMessage && (
            <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-[6px] px-4 py-3 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in duration-200">
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

          {/* AVATAR SECTION - Direct upload only, URL input & placeholder removed */}
          <div className="bg-white/45 backdrop-blur-xs border border-[#dfa38f]/60 rounded-[6px] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
            {/* Left: Avatar Image with Rose Gold Metallic Frame */}
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
                    target.src = '/profile-photo.jpg';
                  }}
                />
              </div>
              <span
                className="mt-2 text-xs sm:text-sm font-bold text-[#3d2f28] text-center"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {fullName || displayName}
              </span>
            </div>

            {/* Right: Change Avatar Photo Upload */}
            <div className="flex-1 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#7a5446]">
                  Profile Photo
                </span>
                <p className="text-xs text-[#81756f]">
                  Upload a clean JPG or PNG photo to customize your student avatar.
                </p>
              </div>

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
                className="bg-[#8c675a] hover:bg-[#7b584c] text-white py-2 px-4 rounded-[6px] text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-colors duration-200 border-none shadow-none"
              >
                <span className="material-symbols-outlined text-sm">upload</span>
                <span>Upload Photo</span>
              </button>
            </div>
          </div>

          {/* -- PERSONAL DETAILS (Read-only / Non-editable) ------------------- */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#dfa38f]/40 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#805c51]">badge</span>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#7a5446]">
                  Personal Details
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="w-full bg-[#faf5f2]/90 border border-[#ebd5cc] rounded-[6px] px-3.5 py-2 text-xs text-[#52352b] font-bold cursor-default select-text">
                  {fullName || 'Stephanie Halim'}
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                  Email Address
                </label>
                <div className="w-full bg-[#faf5f2]/90 border border-[#ebd5cc] rounded-[6px] px-3.5 py-2 text-xs text-[#52352b] font-bold cursor-default select-text">
                  {email || 'stephanie@gmail.com'}
                </div>
              </div>

              {/* Learning Focus (Piano / Violin / ABRSM Theory) */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                  Learning:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLearningFocus('Piano');
                      localStorage.setItem('user_learning_focus', 'Piano');
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className={`py-2 px-2 rounded-[6px] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      learningFocus === 'Piano'
                        ? 'shop-btn-theme'
                        : 'shop-btn-outline'
                    }`}
                    title="Piano"
                  >
                    <span className="material-symbols-outlined text-[13px]">piano</span>
                    <span>Piano</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLearningFocus('Violin');
                      localStorage.setItem('user_learning_focus', 'Violin');
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className={`py-2 px-2 rounded-[6px] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      learningFocus === 'Violin'
                        ? 'shop-btn-theme'
                        : 'shop-btn-outline'
                    }`}
                    title="Violin"
                  >
                    <span className="material-symbols-outlined text-[13px]">music_note</span>
                    <span>Violin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLearningFocus('ABRSM Theory');
                      localStorage.setItem('user_learning_focus', 'ABRSM Theory');
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className={`py-2 px-2 rounded-[6px] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      learningFocus === 'ABRSM Theory'
                        ? 'shop-btn-theme'
                        : 'shop-btn-outline'
                    }`}
                    title="ABRSM Theory"
                  >
                    <span className="material-symbols-outlined text-[13px]">menu_book</span>
                    <span>ABRSM Theory</span>
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
                Membership &amp; Billing
              </span>
            </div>

            <div className="bg-white/45 backdrop-blur-xs border border-[#dfa38f]/60 rounded-[6px] p-4 sm:p-5 space-y-3">
              {subscriptionStatus === 'active' ? (
                <>
                  {/* Tampilan Sebelum Dibatalkan (ACTIVE) */}
                  {/* Row 1: Plan Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                    <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                      Plan Status
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[10px] tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        ACTIVE
                      </span>
                      <span className="text-[#3d2f28] font-bold">
                        Annual Membership
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

                  {/* Row 3: Next Payment */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs border-t border-[#dfa38f]/30 pt-2.5">
                    <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                      Next Payment
                    </span>
                    <span className="text-[#3d2f28] font-bold">
                      Billed $169.99 on Oct 03, 2026
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* Tampilan Setelah Dibatalkan (PENDING CANCELLATION) */}
                  {/* Row 1: Plan Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                    <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                      Plan Status
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        CANCELED
                      </span>
                      <span className="text-[#3d2f28] font-bold">
                        Access active until Oct 03, 2026
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Auto-Renew */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs border-t border-[#dfa38f]/30 pt-2.5">
                    <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                      Auto-Renew
                    </span>
                    <span className="text-[#805c51] font-bold">
                      Disabled (No future charges)
                    </span>
                  </div>

                  {/* Row 3: Next Payment */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs border-t border-[#dfa38f]/30 pt-2.5">
                    <span className="text-[#81756f] font-semibold text-[11px] uppercase tracking-wider">
                      Next Payment
                    </span>
                    <span className="text-[#3d2f28] font-bold">
                      $0.00
                    </span>
                  </div>
                </>
              )}

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

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {subscriptionStatus === 'active' ? (
                  <button
                    type="button"
                    onClick={() => openModal('subscription')}
                    style={{
                      background: 'linear-gradient(135deg, #A82E2E 0%, #8C1D24 50%, #6E121A 100%)',
                      boxShadow: 'inset 0 1.5px 1px rgba(255, 255, 255, 0.35), inset 0 -1.5px 2px rgba(40, 5, 8, 0.5), 0 2px 6px rgba(140, 29, 36, 0.25)',
                      border: '1px solid #B83A42',
                    }}
                    className="flex-1 py-2.5 px-3 rounded-[6px] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer active:scale-98 hover:brightness-115 hover:shadow-[0_4px_14px_rgba(140,29,36,0.35)] hover:scale-[1.01] transition-all duration-200 text-center"
                  >
                    Manage / Cancel Subscription
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSubscriptionStatus('active');
                      localStorage.setItem('user_subscription_status', 'active');
                      setToast({
                        header: 'Subscription Reactivated',
                        body: 'Your Annual Membership is active again. Auto-renew has been restored.',
                        type: 'success',
                      });
                    }}
                    className="flex-1 shop-btn-theme py-2.5 px-3 rounded-[6px] text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-98 hover:scale-[1.01] transition-all duration-200 text-center"
                  >
                    Reactivate Subscription
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => openModal('invoices')}
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F7 50%, #FAF0EB 100%)',
                    boxShadow: '0 1px 3px rgba(181, 114, 98, 0.08), inset 0 1px 0 #FFFFFF',
                    border: '1px solid #dfa38f',
                  }}
                  className="flex-1 py-2.5 px-3 rounded-[6px] text-[#7a493b] hover:text-[#4a2e25] text-[11px] font-bold uppercase tracking-wider cursor-pointer active:scale-98 hover:bg-white hover:border-[#c98e7e] hover:shadow-xs hover:scale-[1.01] transition-all duration-200 text-center"
                >
                  View Billing History
                </button>
              </div>
            </div>
          </div>

          {/* -- SECURITY (change password text link, no saved button) ----------- */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#dfa38f]/40 pb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="material-symbols-outlined text-sm text-[#805c51]">lock</span>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#7a5446]">
                  Security
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingSecurity(!isEditingSecurity)}
                  className="text-[10px] sm:text-[10.5px] font-medium text-[#8c5647] hover:text-[#4a2e25] underline decoration-[#c98e7e]/80 hover:decoration-[#8c5647] underline-offset-2 cursor-pointer bg-transparent border-none p-0 ml-1.5 transition-colors"
                >
                  {isEditingSecurity ? 'cancel' : 'change password'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                  Current Password
                </label>
                <input
                  type="password"
                  disabled={!isEditingSecurity}
                  value={isEditingSecurity ? currentPassword : '••••••••••••'}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={`w-full rounded-[6px] px-3 py-2 text-xs outline-none transition-all ${
                    isEditingSecurity
                      ? 'bg-white border border-[#dfa38f] focus:border-[#ab7e66] text-[#4a2e25] shadow-xs'
                      : 'bg-[#faf5f2]/85 border border-[#ebd5cc] text-[#805c51] font-mono cursor-not-allowed'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7a5446] ml-0.5">
                  New Password
                </label>
                <input
                  type="password"
                  disabled={!isEditingSecurity}
                  value={isEditingSecurity ? newPassword : '••••••••••••'}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 chars)"
                  className={`w-full rounded-[6px] px-3 py-2 text-xs outline-none transition-all ${
                    isEditingSecurity
                      ? 'bg-white border border-[#dfa38f] focus:border-[#ab7e66] text-[#4a2e25] shadow-xs'
                      : 'bg-[#faf5f2]/85 border border-[#ebd5cc] text-[#805c51] font-mono cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
            {!isEditingSecurity ? (
              <p className="text-[10.5px] text-[#81756f] italic">
                Password is encrypted and protected. Click &quot;change password&quot; above to update your credentials.
              </p>
            ) : (
              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)',
                    boxShadow: 'inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d',
                    border: '1px solid #D9A998',
                  }}
                  className="py-1.5 px-4 rounded-[5px] text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer active:scale-95 hover:brightness-115 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-sm">lock_reset</span>
                  <span>Update Password</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Smooth Modal Dialog (Fade & Scale In/Out) */}
      {renderedModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
            isModalOpen
              ? 'bg-black/45 backdrop-blur-xs opacity-100'
              : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className={`bg-white rounded-[8px] border-2 border-[#dfa38f] p-6 ${
              renderedModal === 'invoices' ? 'max-w-lg' : 'max-w-md'
            } w-full shadow-2xl space-y-4 transform transition-all duration-300 ease-out ${
              isModalOpen
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-3'
            }`}
          >
            {renderedModal === 'subscription' && (
              <>
                <div className="flex items-center justify-between border-b border-[#dfa38f]/30 pb-2">
                  <h3
                    className="text-lg font-bold text-[#3d2f28]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Cancel Your Membership?
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-[#8a675d] hover:text-[#45271d] p-1 rounded-full transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  <p className="text-xs text-[#52352b] font-semibold leading-relaxed">
                    Are you sure you want to cancel your Annual Membership?
                  </p>

                  <div className="bg-[#fff8f6] p-3.5 rounded-[6px] border border-[#dfa38f]/40 space-y-2.5 text-xs text-[#5a3b32]">
                    <div className="flex items-start gap-2">
                      <span className="text-[#805c51] font-bold text-sm leading-none mt-0.5">•</span>
                      <p className="text-xs text-[#5a3b32] leading-relaxed">
                        Your access remains active until <span className="font-bold text-[#3d2f28]">Oct 03, 2026</span>. You can still watch video lessons, download sheet music, and join live coaching sessions until then.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#805c51] font-bold text-sm leading-none mt-0.5">•</span>
                      <p className="text-xs text-[#5a3b32] leading-relaxed">
                        No future charges will be made after your current period ends.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  {/* Button 1 (Neutral) : Keep My Subscription */}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 shop-btn-theme py-2.5 px-3 rounded-[6px] text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Keep My Subscription
                  </button>

                  {/* Button 2 (Danger) : Yes, Cancel Subscription */}
                  <button
                    type="button"
                    onClick={() => {
                      setSubscriptionStatus('canceled');
                      localStorage.setItem('user_subscription_status', 'canceled');
                      setToast({
                        header: 'Subscription Canceled',
                        body: 'Your subscription has been canceled. You will retain full access until Oct 03, 2026. A confirmation email has been sent.',
                        type: 'cancel',
                      });
                      closeModal();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-[6px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer text-center active:scale-95"
                  >
                    Yes, Cancel Subscription
                  </button>
                </div>
              </>
            )}

            {renderedModal === 'invoices' && (
              <>
                <div className="flex items-center justify-between border-b border-[#dfa38f]/30 pb-2.5">
                  <div>
                    <h3
                      className="text-lg font-bold text-[#3d2f28]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Billing History &amp; Invoices
                    </h3>
                    <p className="text-[11px] text-[#81756f] mt-0.5">
                      Review payment history, active status, and download tax invoices.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-[#8a675d] hover:text-[#45271d] p-1 rounded-full transition-colors cursor-pointer bg-transparent border-none"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-0.5">
                  {invoicesList.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3.5 bg-[#fff8f6] rounded-[8px] border border-[#dfa38f]/50 hover:border-[#dfa38f] space-y-2 transition-all shadow-2xs"
                    >
                      {/* Row 1: INV-ID, Status Badge, Amount */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-[13px] text-[#3d2f28] tracking-tight font-mono">
                          {inv.id}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold tracking-wider inline-flex items-center gap-1 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {inv.status}
                          </span>
                          <span className="font-extrabold text-xs sm:text-[13px] text-[#3d2f28] ml-1">
                            {inv.amount}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Date & Description */}
                      <div className="text-[11px] text-[#6e5448]">
                        <span className="font-medium text-[#81756f]">{inv.date}</span>
                        <span className="mx-1.5 text-[#d9a998]">•</span>
                        <span className="font-semibold text-[#52352b]">{inv.item}</span>
                      </div>

                      {/* Row 3: Payment Method & Download PDF Button */}
                      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#dfa38f]/20 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#81756f]">
                          <span className="material-symbols-outlined text-[13px] text-[#805c51]">
                            credit_card
                          </span>
                          <span>{inv.paymentMethod}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(inv)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-white hover:bg-[#faf2ed] text-[#7a493b] hover:text-[#4a2e25] border border-[#dfa38f] text-[11px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all shadow-2xs hover:shadow-xs"
                        >
                          <span className="material-symbols-outlined text-xs text-[#805c51]">
                            download
                          </span>
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right pt-2 border-t border-[#dfa38f]/25">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="shop-btn-theme py-2 px-5 rounded-[6px] text-xs font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
