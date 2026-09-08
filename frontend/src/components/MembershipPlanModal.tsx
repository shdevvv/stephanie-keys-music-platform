import React from 'react';

interface MembershipPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: any) => void;
}

export const MembershipPlanModal: React.FC<MembershipPlanModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleSubscribeNow = (planName: string) => {
    onClose();
    localStorage.setItem('selected_membership_plan', planName);

    if (!isLoggedIn) {
      // Unauthenticated guest -> redirect to sign in / sign up first
      onNavigate('signin');
    } else {
      // Logged-in user -> proceed directly to membership checkout
      onNavigate('checkout');
    }
  };

  const plans = [
    {
      name: 'Monthly Plan',
      badge: 'Popular',
      priceIDR: 'Rp 149.000',
      priceUSD: '$9.99',
      period: '/ month',
      description: '1 Month Full Access to Gospel & Jazz piano curriculum & sheet music downloads.',
      popular: false,
    },
    {
      name: 'Quarterly Plan',
      badge: 'Best Value',
      priceIDR: 'Rp 399.000',
      priceUSD: '$26.99',
      period: '/ 3 months',
      description: '3 Months Full Access with 15% discount on all masterclass sessions.',
      popular: true,
    },
    {
      name: 'Annual Plan',
      badge: 'Save 30%',
      priceIDR: 'Rp 1.299.000',
      priceUSD: '$89.99',
      period: '/ year',
      description: '12 Months Unlimited Access with exclusive PDF score downloads.',
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-[#ffe5db] to-[#fff8f6] border border-[#dfa38f]/40 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 border border-[#dfa38f]/30 flex items-center justify-center text-[#6a564d] hover:bg-[#dfa38f]/20 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#dfa38f] to-[#ab7e66] text-white flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <h2 className="font-display-lg text-2xl md:text-3xl font-bold text-[#4a372e]">
            Unlock Full Academy Access
          </h2>
          <p className="text-xs text-[#8b7368] leading-relaxed">
            Lesson videos and downloadable sheet music scores are reserved for active members. Choose a plan to continue your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/90 backdrop-blur-md border rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 ${
                plan.popular
                  ? 'border-[#dfa38f] ring-2 ring-[#dfa38f]/40 scale-[1.02]'
                  : 'border-[#dfa38f]/30 hover:border-[#dfa38f]/60'
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 right-4 px-3 py-0.5 rounded-full font-sans text-[9px] font-black uppercase tracking-wider shadow-sm ${
                  plan.badge === 'Best Value'
                    ? 'bg-white text-[#81594F] border border-[#d9a998]'
                    : 'bg-gradient-to-r from-[#dfa38f] to-[#ab7e66] text-white'
                }`}>
                  {plan.badge}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-display-sm text-lg font-bold text-[#4a372e]">{plan.name}</h3>
                  <p className="text-[11px] text-[#8b7368] leading-relaxed mt-1">{plan.description}</p>
                </div>

                <div className="py-2 border-y border-[#dfa38f]/20">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[#4a372e]">{plan.priceIDR}</span>
                    <span className="text-xs text-[#8b7368] font-medium">({plan.priceUSD})</span>
                  </div>
                  <span className="text-[10px] text-[#ab7e66] font-semibold">{plan.period}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSubscribeNow(plan.name)}
                style={{
                  background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                  boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d, 0 4px 14px rgba(129, 89, 79, 0.22)",
                  border: "1px solid #D9A998",
                }}
                className="w-full text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-[7px] cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all shadow-md mt-6"
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#ab7e66] hover:text-[#4a372e] underline cursor-pointer font-medium"
          >
            Continue Browsing Catalog Metadata
          </button>
        </div>
      </div>
    </div>
  );
};
