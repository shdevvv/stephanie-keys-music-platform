import React, { useState, useEffect } from 'react';
import { type Sheet, sheets } from './sheetsData';
import SearchableCountryDropdown from './SearchableCountryDropdown';
import type { ViewType } from './layout';

interface SheetPurchaseFlowProps {
  initialStep: number;
  onNavigate: (view: ViewType | string) => void;
  selectedSheetForBuyNow?: Sheet | null;
  clearBuyNowSheet?: () => void;
}

interface CartItem {
  sheet: Sheet;
  quantity: number;
}

interface CustomerInfo {
  fullName: string;
  email: string;
  country: string;
}

interface OrderDetails {
  orderId: string;
  transactionId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  customerInfo: CustomerInfo;
  purchaseDate: string;
  invoiceNumber: string;
  qrCodeUrl?: string;
  vaNumber?: string;
  bankName?: string;
  redirectUrl?: string;
  isSimulated?: boolean;
}

// --- Official Payment Method Brand Logos (SVG Vector Representations) ---
const QrisLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 120 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 4 14 V 6 H 14" stroke="#1d1b1a" strokeWidth="3.5" strokeLinecap="square" />
    <path d="M 116 31 V 39 H 106" stroke="#1d1b1a" strokeWidth="3.5" strokeLinecap="square" />
    <path d="M 16 14 H 36 V 34 H 26 V 40 H 16 V 14 Z" fill="#1d1b1a" />
    <rect x="22" y="20" width="8" height="8" fill="white" />
    <rect x="24" y="22" width="4" height="4" fill="#1d1b1a" />
    <path d="M 40 14 H 58 V 24 H 50 L 58 34 H 48 L 42 25 V 34 H 40 V 14 Z M 48 18 V 21 H 50 V 18 H 48 Z" fill="#1d1b1a" />
    <path d="M 62 14 H 70 V 34 H 62 V 14 Z" fill="#1d1b1a" />
    <path d="M 74 14 H 96 V 20 H 82 V 22 H 96 V 34 H 74 V 28 H 88 V 26 H 74 V 14 Z" fill="#1d1b1a" />
  </svg>
);

const BcaLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 140 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="36" height="36" rx="9" fill="#005CAA" />
    <path d="M 20 11 C 15 15 13 22 13 27 C 16 27 20 25 20 21 C 20 25 24 27 27 27 C 27 22 25 15 20 11 Z" fill="white" />
    <path d="M 20 27 V 33" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <text x="44" y="32" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontStyle="italic" fontSize="26" fill="#005CAA" letterSpacing="-0.5">BCA</text>
  </svg>
);

const MandiriLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 140 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 52 8 C 62 3 75 14 88 7 C 95 3 105 5 112 8 C 104 12 94 4 84 10 C 73 17 62 7 52 8 Z" fill="#F2AE1C" />
    <text x="2" y="33" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="24" fill="#003B73" letterSpacing="-0.8">mandırı</text>
  </svg>
);

const BniLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 110 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="30" height="30" rx="3" fill="#F15A24" />
    <path d="M 10 12 C 15 18 20 22 24 28 M 22 12 C 18 18 14 22 10 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <text x="38" y="31" fontFamily="Georgia, serif" fontWeight="900" fontSize="26" fill="#006680" letterSpacing="0.5">BNI</text>
  </svg>
);

const BriLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 100 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="96" height="30" rx="5" fill="#00529C" />
    <text x="48" y="26" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic" fontSize="20" fill="white" letterSpacing="0.5">BRI</text>
    <path d="M 86 4 L 78 34" stroke="#F37021" strokeWidth="3.5" />
  </svg>
);

const PermataLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 14 6 L 24 16 L 14 26 L 4 16 Z" fill="#00A859" />
    <path d="M 22 14 L 30 22 L 22 30 L 14 22 Z" fill="#ED1C24" opacity="0.85" />
    <path d="M 14 18 L 22 26 L 14 34 L 6 26 Z" fill="#FFC20E" opacity="0.85" />
    <text x="36" y="27" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="18" fill="#003C71">Permata</text>
  </svg>
);

const GoPayLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 115 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="30" height="30" rx="9" fill="#00AED6" />
    <circle cx="17" cy="20" r="7" fill="white" />
    <circle cx="17" cy="20" r="3" fill="#00AED6" />
    <text x="38" y="28" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="21" fill="#00AED6" letterSpacing="-0.5">gopay</text>
  </svg>
);

const ShopeePayLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="28" height="28" rx="6" fill="#EE4D2D" />
    <path d="M 10 12 C 10 8 22 8 22 12 V 14 H 10 V 12 Z" stroke="white" strokeWidth="2" fill="none" />
    <text x="16" y="25" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="14" fill="white">S</text>
    <text x="35" y="27" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="18" fill="#EE4D2D">ShopeePay</text>
  </svg>
);

const CreditCardLogo = ({ className = "h-4.5 w-auto" }: { className?: string }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 100 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="27" fontFamily="Arial Black, sans-serif" fontWeight="900" fontStyle="italic" fontSize="19" fill="#1A1F71">VISA</text>
    <circle cx="68" cy="20" r="11" fill="#EB001B" />
    <circle cx="82" cy="20" r="11" fill="#F79E1B" fillOpacity="0.88" />
  </svg>
);



export default function SheetPurchaseFlow({
  initialStep,
  onNavigate,
  selectedSheetForBuyNow,
  clearBuyNowSheet
}: SheetPurchaseFlowProps) {
  // --- Core States ---
  const [step, setStep] = useState<number>(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") !== "false";
    if (!loggedIn && initialStep >= 4 && initialStep <= 6) {
      return 3; // Redirect to inline auth step if not logged in
    }
    return initialStep;
  });

  const isDirectBuy = Boolean(selectedSheetForBuyNow) && step !== 2;
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('phanilie_cart');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.map((item: any) => {
      const freshSheet = sheets.find(s => s.title === item.sheet.title);
      return {
        ...item,
        sheet: freshSheet || item.sheet
      };
    });
  });

  const [purchasedSheetTitles, setPurchasedSheetTitles] = useState<string[]>(() => {
    const saved = localStorage.getItem('purchased_sheets');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep track of current step if redirecting through signin
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") !== "false";
    if (!loggedIn && initialStep >= 4 && initialStep <= 6) {
      setStep(3);
    } else {
      setStep(initialStep);
    }
  }, [initialStep]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('phanilie_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  }, [cart]);

  // Sync purchased sheets
  useEffect(() => {
    localStorage.setItem('purchased_sheets', JSON.stringify(purchasedSheetTitles));
    try {
      const saved = localStorage.getItem('purchased_sheets_dates');
      const dates = saved ? JSON.parse(saved) : {};
      const nowStr = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      let updated = false;
      purchasedSheetTitles.forEach(title => {
        if (!dates[title]) {
          dates[title] = nowStr;
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem('purchased_sheets_dates', JSON.stringify(dates));
      }
    } catch (e) {
      console.error(e);
    }
    window.dispatchEvent(new Event('storage'));
  }, [purchasedSheetTitles]);

  // --- Step 2: Cart States ---

  // --- Step 3: Auth States ---
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCountry, setAuthCountry] = useState('Indonesia');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');

  // --- Step 4: Checkout States ---
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    const savedName = localStorage.getItem('guest_name') || '';
    const savedEmail = localStorage.getItem('guest_email') || '';
    const savedCountry = localStorage.getItem('guest_country') || 'Indonesia';
    return {
      fullName: savedName,
      email: savedEmail,
      country: savedCountry
    };
  });
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // --- Step 5: Payment Method States ---
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentApiError, setPaymentApiError] = useState('');

  useEffect(() => {
    const isLocal = selectedCurrency === 'IDR' || customerInfo.country === 'Indonesia';
    if (!isLocal && paymentMethod !== 'Credit Card' && paymentMethod !== 'PayPal') {
      setPaymentMethod('Credit Card');
    } else if (isLocal && paymentMethod === 'PayPal') {
      setPaymentMethod('Credit Card');
    }
  }, [selectedCurrency, customerInfo.country, paymentMethod]);

  useEffect(() => {
    setSelectedCurrency('USD');
  }, [customerInfo.country]);

  // --- Step 6: Payment Screen States ---
  const [timeLeft, setTimeLeft] = useState(900); // 15:00 countdown in seconds
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verifying' | 'success'>('pending');
  const [orderInfo, setOrderInfo] = useState<OrderDetails | null>(() => {
    const saved = localStorage.getItem('phanilie_last_order');
    return saved ? JSON.parse(saved) : null;
  });

  // --- Step 9: Download Detail Page State ---
  const [selectedDownloadSheet] = useState<Sheet | null>(null);
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('download_counts');
    return saved ? JSON.parse(saved) : {};
  });

  // --- Step 10: Active Invoice State ---
  const [invoiceOrder, setInvoiceOrder] = useState<OrderDetails | null>(null);

  // --- Calculations ---
  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 5.00;
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return 5.00;
    if (num >= 1000) return num / 16000;
    return num;
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getSubtotal = () => {
    if (selectedSheetForBuyNow) {
      return parsePrice(selectedSheetForBuyNow.price);
    }
    return cart.reduce((acc, item) => acc + parsePrice(item.sheet.price) * item.quantity, 0);
  };

  const getDiscountAmount = () => 0;

  const getTotal = () => getSubtotal();

  // Timer Effect for Step 6 (Payment)
  useEffect(() => {
    if (step !== 6 || paymentStatus !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, paymentStatus]);

  // Formatter for timer minutes:seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };



  const [removingTitles, setRemovingTitles] = useState<string[]>([]);

  const removeFromCart = (title: string) => {
    setCart(prev => prev.filter(item => item.sheet.title !== title));
  };

  const handleAnimateRemoveFromCart = (title: string) => {
    if (removingTitles.includes(title)) return;
    setRemovingTitles(prev => [...prev, title]);
    setTimeout(() => {
      removeFromCart(title);
      setRemovingTitles(prev => prev.filter(t => t !== title));
    }, 350);
  };



  // Step 3 Auth Actions
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim()) {
      setAuthError('Email is required');
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('guest_email', authEmail);
    if (isSignUp) {
      if (authName.trim()) {
        localStorage.setItem('guest_name', authName);
      }
      setCustomerInfo(prev => ({
        ...prev,
        fullName: authName || 'New User',
        email: authEmail,
        country: authCountry
      }));
    } else {
      const parts = authEmail.split('@');
      const name = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      localStorage.setItem('guest_name', name);
      setCustomerInfo(prev => ({ ...prev, fullName: name, email: authEmail }));
    }
    window.dispatchEvent(new Event('storage')); // Sync layout headers
    setStep(4); // Advance to Checkout Form
  };

  const handleGuestCheckout = () => {
    localStorage.setItem('guest_email', 'guest@phaniliemusic.com');
    localStorage.setItem('guest_name', 'Guest Student');
    setCustomerInfo({
      fullName: 'Guest Student',
      email: 'guest@phaniliemusic.com',
      country: 'United States'
    });
    setStep(4);
  };

  // Step 4 Checkout Form submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!customerInfo.fullName.trim()) {
      setCheckoutError('Full Name is required');
      return;
    }
    if (!customerInfo.email.trim()) {
      setCheckoutError('Email Address is required');
      return;
    }
    if (!termsAccepted) {
      setCheckoutError('You must accept the Terms & Conditions to proceed');
      return;
    }

    setStep(5); // Proceed to Payment Method Selection
  };

  // Step 5 Continue to Payment instructions
  const handleSelectPaymentMethod = async () => {
    // If credit card, do a basic frontend check
    if (paymentMethod === 'Credit Card') {
      if (!ccNumber.trim() || !ccExpiry.trim() || !ccCvv.trim()) {
        setPaymentApiError('Please fill in all credit card details.');
        return;
      }
    }

    setIsProcessingPayment(true);
    setPaymentApiError('');

    const orderId = 'SK-' + Math.floor(100000 + Math.random() * 900000);
    const invoiceNum = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);

    const itemsToBuy = selectedSheetForBuyNow
      ? [{ sheet: selectedSheetForBuyNow, quantity: 1 }]
      : cart;

    const apiBaseUrl = localStorage.getItem('backend_api_url') || 'http://localhost:5013/api';

    try {
      const response = await fetch(`${apiBaseUrl}/payment/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          customerName: customerInfo.fullName || 'Guest User',
          customerEmail: customerInfo.email || 'guest@example.com',
          currency: selectedCurrency,
          amount: getTotal(),
          paymentMethod: paymentMethod,
          cardToken: paymentMethod === 'Credit Card' ? 'mock-cc-token-' + Math.floor(Math.random() * 10000000) : ''
        })
      });

      if (response.ok) {
        const result = await response.json();

        const newOrder: OrderDetails = {
          orderId: orderId,
          transactionId: result.transactionId || 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
          items: itemsToBuy,
          subtotal: getSubtotal(),
          discount: getDiscountAmount(),
          tax: 0,
          total: getTotal(),
          currency: selectedCurrency,
          paymentMethod: paymentMethod,
          customerInfo: customerInfo,
          purchaseDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          invoiceNumber: invoiceNum,
          qrCodeUrl: result.qrCodeUrl,
          vaNumber: result.vaNumber,
          bankName: result.bank || result.bankName || paymentMethod,
          redirectUrl: result.redirectUrl,
          isSimulated: result.isSimulated
        };

        setOrderInfo(newOrder);
        localStorage.setItem('phanilie_last_order', JSON.stringify(newOrder));
        setTimeLeft(900); // 15 minutes timer

        if (result.transactionStatus === 'success') {
          setPaymentStatus('success');
          // Add purchased sheet titles to library list immediately
          const newlyPurchased = newOrder.items.map(item => item.sheet.title);
          setPurchasedSheetTitles(prev => {
            const updated = [...prev];
            newlyPurchased.forEach(title => {
              if (!updated.includes(title)) {
                updated.push(title);
              }
            });
            return updated;
          });

          if (!selectedSheetForBuyNow) {
            setCart([]);
            localStorage.removeItem('phanilie_cart');
          } else {
            if (clearBuyNowSheet) clearBuyNowSheet();
          }
          setStep(7); // Go to success page immediately for credit card
        } else {
          setPaymentStatus('pending');
          setStep(6); // Go to payment instructions page for QRIS/VA/PayPal
        }
      } else {
        throw new Error('Payment response status error');
      }
    } catch (err) {
      console.warn("Backend checkout API connection failed. Falling back to local simulation...", err);
      const transactionId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);

      const newOrder: OrderDetails = {
        orderId,
        transactionId,
        items: itemsToBuy,
        subtotal: getSubtotal(),
        discount: getDiscountAmount(),
        tax: 0,
        total: getTotal(),
        currency: selectedCurrency,
        paymentMethod,
        customerInfo,
        purchaseDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        invoiceNumber: invoiceNum,
        qrCodeUrl: (paymentMethod === 'QRIS' || paymentMethod === 'GoPay' || paymentMethod === 'DANA' || paymentMethod === 'ShopeePay' || paymentMethod === 'OVO')
          ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MIDTRANS-QRIS-MOCK-${orderId}`
          : undefined,
        vaNumber: paymentMethod.toLowerCase().includes('va')
          ? "88301" + Math.floor(10000000 + Math.random() * 90000000)
          : undefined,
        bankName: paymentMethod.toLowerCase().includes('va') || paymentMethod.toLowerCase().includes('virtual') || paymentMethod.toLowerCase().includes('account')
          ? paymentMethod
          : undefined,
        redirectUrl: paymentMethod === 'PayPal'
          ? "https://www.sandbox.paypal.com/checkoutnow?token=mock-token-12345"
          : undefined,
        isSimulated: true
      };

      setOrderInfo(newOrder);
      localStorage.setItem('phanilie_last_order', JSON.stringify(newOrder));
      setTimeLeft(900);

      if (paymentMethod === 'Credit Card') {
        setPaymentStatus('success');
        const newlyPurchased = newOrder.items.map(item => item.sheet.title);
        setPurchasedSheetTitles(prev => {
          const updated = [...prev];
          newlyPurchased.forEach(title => {
            if (!updated.includes(title)) {
              updated.push(title);
            }
          });
          return updated;
        });
        if (!selectedSheetForBuyNow) {
          setCart([]);
          localStorage.removeItem('phanilie_cart');
        } else {
          if (clearBuyNowSheet) clearBuyNowSheet();
        }
        setStep(7);
      } else {
        setPaymentStatus('pending');
        setStep(6);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Step 6 Trigger Simulated Payment Completion
  const simulatePaymentSuccess = () => {
    setPaymentStatus('verifying');
    setTimeout(() => {
      setPaymentStatus('success');

      // Add purchased sheet titles to library list
      if (orderInfo) {
        const newlyPurchased = orderInfo.items.map(item => item.sheet.title);
        setPurchasedSheetTitles(prev => {
          const updated = [...prev];
          newlyPurchased.forEach(title => {
            if (!updated.includes(title)) {
              updated.push(title);
            }
          });
          return updated;
        });

        // Clear Cart if we checked out the cart items
        if (!selectedSheetForBuyNow) {
          setCart([]);
          localStorage.removeItem('phanilie_cart');
        } else {
          if (clearBuyNowSheet) clearBuyNowSheet();
        }
      }

      setStep(7); // Redirect to success screen
    }, 1500);
  };

  // Handle download simulation
  const handleDownloadFile = (title: string, fileType: string) => {
    // Increment download count
    setDownloadCounts(prev => {
      const nextCount = (prev[title] || 0) + 1;
      const updated = { ...prev, [title]: nextCount };
      localStorage.setItem('download_counts', JSON.stringify(updated));
      return updated;
    });

    // Trigger browser file download of public/Over the Rainbow.pdf as temporary dummy sheet music
    const link = document.createElement('a');
    link.href = '/Over the Rainbow.pdf';
    link.download = `${title.replace(/[^a-zA-Z0-9\s]/g, '')} - ${fileType}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter sheets for Step 8: Library
  const getLibrarySheets = () => {
    return sheets.filter(sheet => purchasedSheetTitles.includes(sheet.title));
  };

  return (
    <div
      className="w-full flex-grow-0 relative overflow-hidden py-8 md:py-10 px-4 md:px-8 min-h-0 bg-transparent"
    >
      <div className="max-w-5xl mx-auto relative z-10">

        {/* Stepper Timeline 1234 Standalone Luxury Box */}
        {step >= 2 && step <= 7 && (
          <div className="bg-white/18 backdrop-blur-xs border-2 border-[#dfa38f] border-b-0 rounded-t-2xl p-4 md:p-5 max-w-5xl mx-auto relative overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* Stepper Timeline (Shifted Left) */}
              <div className="relative flex-grow w-full max-w-3xl px-2 sm:px-4">
                <div className="relative flex items-center justify-between w-full">

                  {/* Background Connecting Track (Ultra-Thin Metallic Line starting & ending at node centers) */}
                  <div
                    className={`absolute top-[18px] md:top-[20px] -translate-y-1/2 h-[2px] bg-[#e2cdc4]/60 rounded-full z-0 ${!isDirectBuy ? 'left-[12.5%] right-[12.5%]' : 'left-[16.66%] right-[16.66%]'
                      }`}
                  />

                  {/* Active Progress Line (Ultra-Thin Luxury Rose Gold Gradient Track) */}
                  <div
                    className={`absolute top-[18px] md:top-[20px] -translate-y-1/2 h-[2px] rounded-full z-0 transition-all duration-500 shadow-[0_0_8px_rgba(217,169,152,0.6)] ${!isDirectBuy ? 'left-[12.5%]' : 'left-[16.66%]'
                      }`}
                    style={{
                      background: "linear-gradient(90deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 40%, #CB9E8A 70%, #9C3B29 100%)",
                      width: `${!isDirectBuy ? (
                        step === 2 ? 0 :
                          step === 3 || step === 4 ? 25 :
                            step === 5 || step === 6 ? 50 : 75
                      ) : (
                        step === 3 || step === 4 ? 0 :
                          step === 5 || step === 6 ? 33.33 : 66.66
                      )}%`
                    }}
                  />

                  {!isDirectBuy ? (
                    // 4-Step Flow (Cart): 1. Cart -> 2. Details -> 3. Payment -> 4. Complete
                    [
                      { num: 1, label: '1. Shopping Cart', active: step >= 2, isCurrent: step === 2 },
                      { num: 2, label: '2. Checkout Details', active: step >= 3, isCurrent: step === 3 || step === 4 },
                      { num: 3, label: '3. Payment Method', active: step >= 5, isCurrent: step === 5 || step === 6 },
                      { num: 4, label: '4. Order Complete', active: step >= 7, isCurrent: step === 7 }
                    ].map((s) => (
                      <div key={s.num} className="relative z-10 flex flex-col items-center group">
                        <div
                          style={s.isCurrent ? {
                            background: "linear-gradient(135deg, #FFF0EB 0%, #F5D5C8 25%, #E8B9A7 55%, #D49987 80%, #B87664 100%)",
                            boxShadow: "inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 3px rgba(139, 65, 47, 0.35), 0 4px 14px rgba(212, 153, 135, 0.5)",
                            border: "2px solid #FFF8F5",
                          } : s.active ? {
                            background: "linear-gradient(135deg, #FFF0EB 0%, #F5D5C8 25%, #E8B9A7 55%, #D49987 80%, #B87664 100%)",
                            boxShadow: "inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 3px rgba(139, 65, 47, 0.35), 0 2px 8px rgba(212, 153, 135, 0.4)",
                            border: "1.5px solid #FFF8F5",
                          } : undefined}
                          className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-extrabold text-xs md:text-sm transition-all duration-300 ${s.isCurrent
                            ? 'text-white border-2 border-[#FFF8F5] scale-110 shadow-md ring-2 ring-[#E8B9A7]/60'
                            : s.active
                              ? 'text-white border-1.5 border-[#FFF8F5] shadow-xs'
                              : 'bg-white/95 text-[#8c675a] border border-[#e5c3b6] shadow-2xs'
                            }`}
                        >
                          {s.active && !s.isCurrent ? (
                            <span className="material-symbols-outlined text-sm font-black text-white drop-shadow-xs">check</span>
                          ) : (
                            <span>{s.num}</span>
                          )}
                        </div>
                        <span
                          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                          className={`mt-2 text-[10px] md:text-xs tracking-wider uppercase transition-all ${s.isCurrent
                            ? 'text-[#7a493b] font-black'
                            : s.active
                              ? 'text-[#8c5647] font-extrabold'
                              : 'text-[#a37f72] font-semibold'
                            }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))
                  ) : (
                    // 3-Step Flow (Direct Buy): 1. Details -> 2. Payment -> 3. Complete
                    [
                      { num: 1, label: '1. Checkout Details', active: step >= 3, isCurrent: step === 3 || step === 4 },
                      { num: 2, label: '2. Payment Method', active: step >= 5, isCurrent: step === 5 || step === 6 },
                      { num: 3, label: '3. Order Complete', active: step >= 7, isCurrent: step === 7 }
                    ].map((s) => (
                      <div key={s.num} className="relative z-10 flex flex-col items-center group">
                        <div
                          style={s.isCurrent ? {
                            background: "linear-gradient(135deg, #FFF0EB 0%, #F5D5C8 25%, #E8B9A7 55%, #D49987 80%, #B87664 100%)",
                            boxShadow: "inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 3px rgba(139, 65, 47, 0.35), 0 4px 14px rgba(212, 153, 135, 0.5)",
                            border: "2px solid #FFF8F5",
                          } : s.active ? {
                            background: "linear-gradient(135deg, #FFF0EB 0%, #F5D5C8 25%, #E8B9A7 55%, #D49987 80%, #B87664 100%)",
                            boxShadow: "inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 3px rgba(139, 65, 47, 0.35), 0 2px 8px rgba(212, 153, 135, 0.4)",
                            border: "1.5px solid #FFF8F5",
                          } : undefined}
                          className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-extrabold text-xs md:text-sm transition-all duration-300 ${s.isCurrent
                            ? 'text-white border-2 border-[#FFF8F5] scale-110 shadow-md ring-2 ring-[#E8B9A7]/60'
                            : s.active
                              ? 'text-white border-1.5 border-[#FFF8F5] shadow-xs'
                              : 'bg-white/95 text-[#8c675a] border border-[#e5c3b6] shadow-2xs'
                            }`}
                        >
                          {s.active && !s.isCurrent ? (
                            <span className="material-symbols-outlined text-sm font-black text-white drop-shadow-xs">check</span>
                          ) : (
                            <span>{s.num}</span>
                          )}
                        </div>
                        <span
                          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                          className={`mt-2 text-[10px] md:text-xs tracking-wider uppercase transition-all ${s.isCurrent
                            ? 'text-[#7a493b] font-black'
                            : s.active
                              ? 'text-[#8c5647] font-extrabold'
                              : 'text-[#a37f72] font-semibold'
                            }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    ))
                  )}

                </div>
              </div>

              {/* Right side: 'My Library' Button (Thin Outline, Clear Light Fill, Medium Brown Font, Flush to Card Edge) */}
              <div className="shrink-0 ml-auto pt-1 sm:pt-0 -mr-1 sm:-mr-2.5">
                <button
                  type="button"
                  onClick={() => setStep(8)}
                  className="py-1.5 px-3 rounded-md bg-white/40 hover:bg-white/75 backdrop-blur-xs border border-[#dfa38f]/70 text-[#7a4b3d] text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shadow-2xs outline-none focus:outline-none ring-0 focus:ring-0 select-none shrink-0"
                  aria-label="Go to My Library"
                >
                  <span className="material-symbols-outlined text-sm text-[#8c5647] select-none">library_music</span>
                  <span>My Library</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Step Content Container Box (Matches top timeline box translucency) */}
        {step >= 2 && step <= 7 && (
          <div
            className="bg-white/18 backdrop-blur-xs border-2 border-[#dfa38f] border-t-0 rounded-b-2xl p-5 md:p-8 max-w-5xl mx-auto relative overflow-hidden transition-all duration-300 shadow-sm"
          >

            {/* -------------------- STEP 2: SHOPPING CART -------------------- */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                {cart.length === 0 ? (
                  <div className="text-center py-14 bg-white/18 backdrop-blur-xs rounded-2xl p-8 md:p-12 border-2 border-[#dfa38f]">
                      {/* Hotel Glass Circle with Softened Specular Metallic Outline */}
                      <div className="w-16 h-16 rounded-full p-[3px] bg-[linear-gradient(135deg,#FFFFFF_0%,#F9DFD6_18%,#E29381_40%,#C45A45_65%,#FDF0EC_82%,#A84A37_100%)] mx-auto mb-4 group transition-all duration-500 hover:scale-105 shadow-none">
                        <div className="w-full h-full bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-[inset_0_2.5px_5px_#ffffff]">
                          {/* Multi-Tonal Soft Specular Rose Gold SVG Shopping Cart Icon */}
                          <svg className="w-7 h-7 transition-transform duration-500 group-hover:scale-110 select-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="luxEmptyCartMultiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#E29381" />
                                <stop offset="50%" stopColor="#C45A45" />
                                <stop offset="100%" stopColor="#9C3B29" />
                              </linearGradient>
                              <linearGradient id="luxEmptyCartWheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFFFF" />
                                <stop offset="100%" stopColor="#C45A45" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                              fill="url(#luxEmptyCartMultiGrad)"
                            />
                            <circle cx="7" cy="20" r="1.3" fill="url(#luxEmptyCartWheelGrad)" />
                            <circle cx="17" cy="20" r="1.3" fill="url(#luxEmptyCartWheelGrad)" />
                          </svg>
                        </div>
                      </div>
                      <p className="font-serif text-xl text-[#4a2e25] font-extrabold tracking-wide">Your Cart is Empty</p>
                      <p className="font-serif italic text-xs md:text-sm text-[#7c6356] mt-2 max-w-md mx-auto leading-relaxed font-normal">
                        Explore our exclusive collection of arrangement sheet music for piano, solos, and ensembles.
                      </p>

                      {/* Go to Sheet Music Shop Button with Thin Outline & Clear Light Background (No Gradient) */}
                      <button
                        onClick={() => onNavigate('sheets')}
                        className="mt-6 py-2.5 px-6 bg-white/40 hover:bg-white/75 backdrop-blur-xs border border-[#dfa38f]/70 rounded-md text-[#7a4b3d] hover:text-[#4a2e25] font-extrabold text-xs uppercase tracking-widest cursor-pointer inline-flex items-center justify-center gap-2 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95 shadow-2xs group outline-none focus:outline-none ring-0 focus:ring-0"
                      >
                        <svg className="w-4 h-5 fill-current text-[#8c5647] shrink-0 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 140">
                          <path d="M 54.7 115.5 C 50.5 119.3 45.3 121.2 39.7 120.7 C 33.2 120.1 27.7 116.5 24.9 110.6 C 22.2 104.9 22.8 98.3 26.4 93 C 30.5 87 37.3 83.2 44.6 82.8 L 44.6 45.8 C 41.5 47 38.6 48.9 36.1 51.3 C 30.2 57.1 27.1 64.8 27.5 73 C 27.9 81.5 32.2 89 39.3 93.4 C 41.4 94.7 42 97.5 40.7 99.6 C 39.4 101.7 36.6 102.3 34.5 101 C 25.2 95.2 19.5 85.3 19 74.2 C 18.5 63.5 22.5 53.5 30.2 45.9 C 34.2 41.9 39 39 44.3 37.4 L 44.3 25 C 44.3 20.4 46.3 16.1 49.7 13.2 C 53.5 10 58.4 8.5 63.4 9.1 C 68.4 9.7 72.8 12.5 75.5 16.7 C 78.2 20.9 78.9 26.1 77.4 30.9 C 76.1 35.1 73.2 38.6 69.3 40.6 C 67.1 41.7 64.5 41 63.4 38.8 C 62.3 36.6 63 34 65.2 32.9 C 67.7 31.6 69.6 29.4 70.4 26.7 C 71.3 23.6 70.9 20.2 69.2 17.5 C 67.5 14.8 64.6 13 61.4 12.6 C 58.1 12.2 54.9 13.2 52.4 15.3 C 50.3 17.1 49 19.8 49 22.7 L 49 36.2 C 53.7 37.3 58.1 39.6 61.8 42.9 C 67.7 48.2 71 55.5 71 63.3 C 71 71.4 67.4 78.9 61.1 83.9 C 55.3 88.5 48 90.7 40.7 90 C 42.7 87.4 46.1 85.6 49.8 84.8 L 49.8 110.7 C 53.7 110.5 57.4 108.9 60.1 106.2 C 63.8 102.6 65.9 97.6 65.9 92.4 C 65.9 88 63.6 83.8 59.7 81 C 57.5 79.4 57 76.6 58.6 74.4 C 60.2 72.2 63 71.7 65.2 73.3 C 70.7 77.3 73.9 83.5 73.9 90.1 C 73.9 99 69.9 107.5 63 113.5 C 60.6 115.6 57.7 116.5 54.7 115.5 Z M 39.7 112.5 C 43.5 112.5 46.5 109.5 46.5 105.7 C 46.5 101.9 43.5 98.9 39.7 98.9 C 35.9 98.9 32.9 101.9 32.9 105.7 C 32.9 109.5 35.9 112.5 39.7 112.5 Z" />
                        </svg>
                        <span>Go to Sheet Music Shop</span>
                      </button>
                    </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h1 className="font-display-lg text-xl md:text-2xl text-[#7a493b] font-black tracking-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        1. Shopping Cart Selection
                      </h1>
                      <p className="text-[#5a372c] text-xs font-bold">Review your selected arrangements before proceeding to checkout.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-stretch">
                      {/* Left Column: Product List + Find More Sheet Music Box */}
                      <div className="space-y-4 flex flex-col justify-between h-full">
                        <div className="bg-white/25 backdrop-blur-md border border-[#dfa38f] rounded-lg p-5 space-y-3.5">
                          <h3 className="text-xs font-black text-[#3d231b] uppercase tracking-wider border-b-2 border-[#b85b40]/50 pb-2.5 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-[#d68c78]">shopping_bag</span>
                            Cart Selection ({cart.length})
                          </h3>

                          <div className="space-y-3">
                            {cart.map((item, idx) => {
                              const isRemoving = removingTitles.includes(item.sheet.title);
                              return (
                                <div
                                  key={item.sheet.title || idx}
                                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 bg-white/40 backdrop-blur-xs border border-[#dfa38f] hover:border-[#b85b40] rounded-md shadow-2xs transition-all duration-350 ease-in-out group ${isRemoving
                                    ? 'opacity-0 scale-95 -translate-x-6 max-h-0 py-0 overflow-hidden border-transparent'
                                    : 'opacity-100 scale-100 translate-x-0'
                                    }`}
                                >
                                  <div className="flex items-center gap-3.5">
                                    <div className="p-0.5 bg-gradient-to-br from-[#e5b3a3] to-[#c97b63] rounded-md shadow-xs shrink-0">
                                      <img
                                        src={item.sheet.image}
                                        alt={item.sheet.title}
                                        className="w-14 h-14 object-cover rounded-[5px] border border-white bg-[#faf6f4] flex-shrink-0"
                                      />
                                    </div>
                                    <div>
                                      <h3 style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} className="text-sm font-black text-[#3d231b] tracking-tight">
                                        {item.sheet.title}
                                      </h3>
                                      <p className="text-xs text-[#5a372c] mt-0.5 font-bold line-clamp-1">{item.sheet.description}</p>
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {item.sheet.genres.map((g, i) => (
                                          <span key={i} className="bg-white/50 backdrop-blur-xs text-[#8c3b26] px-2 py-0.5 rounded-md text-[10px] font-black border border-[#dfa38f]/60">
                                            {g}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-solid border-[#dfa38f]/60 pt-3 sm:pt-0">
                                    <div className="flex items-center gap-3">
                                      <div className="text-right">
                                        <div className="text-sm font-serif font-black text-[#8c3b26]">
                                          {formatPrice(parsePrice(item.sheet.price))}
                                        </div>
                                      </div>

                                      <button
                                        onClick={() => handleAnimateRemoveFromCart(item.sheet.title)}
                                        className="px-2.5 py-1.5 rounded-md bg-white/60 hover:bg-[#fceee8] text-[#8c3b26] border border-[#dfa38f] hover:border-[#c58270] text-[10px] font-black tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 flex items-center justify-center shrink-0"
                                        title="Remove item"
                                      >
                                        REMOVE
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Find More Sheet Music Box inside Left Column */}
                        <button
                          onClick={() => onNavigate('sheets')}
                          className="w-full py-3 px-4 bg-white/35 hover:bg-[#81594F] hover:text-white backdrop-blur-md border border-[#b85b40] text-[#3d231b] font-black text-xs uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer shadow-2xs text-center"
                        >
                          Find More Sheet Music
                        </button>
                      </div>

                      {/* Right Column: Order Summary Sideboard (Matches timeline 2 style) */}
                      <div className="bg-white/25 backdrop-blur-md border border-[#dfa38f] rounded-lg p-5 space-y-4 flex flex-col justify-between h-full">
                        <div className="space-y-3.5">
                          <h3 className="text-xs font-black text-[#3d231b] uppercase tracking-wider border-b-2 border-[#b85b40]/50 pb-2.5 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-[#d68c78]">receipt_long</span>
                            Order Summary
                          </h3>

                          <div className="space-y-2.5 text-xs text-[#5a372c]">
                            <div className="flex justify-between font-extrabold">
                              <span>Subtotal</span>
                              <span className="font-black text-[#3d231b]">{formatPrice(getSubtotal())}</span>
                            </div>
                            <div className="flex justify-between font-extrabold">
                              <span>Instant Digital Delivery</span>
                              <span className="font-black text-[#23783e]">FREE</span>
                            </div>
                            <div className="h-px bg-[#dfa38f]/40 my-2" />
                            <div className="flex justify-between items-baseline text-sm font-black text-[#3d231b]">
                              <span>Total</span>
                              <span className="text-[#8c3b26] text-lg font-serif font-black">
                                {formatPrice(getTotal())}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const loggedIn = localStorage.getItem("isLoggedIn") !== "false";
                            if (loggedIn) {
                              setStep(4);
                            } else {
                              setStep(3);
                            }
                          }}
                          style={{
                            background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                            boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                            border: "1px solid #D9A998",
                          }}
                          className="w-full text-white text-xs font-extrabold uppercase tracking-widest py-3.5 px-5 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 group mt-4 shadow-none"
                        >
                          <span>Proceed to Checkout</span>
                          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">east</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* -------------------- STEP 3: SIGN IN / CREATE ACCOUNT -------------------- */}
            {step === 3 && (
              <div className="bg-white/35 backdrop-blur-md border-2 border-[#b85b40] rounded-xl p-6 md:p-8 max-w-lg mx-auto animate-in fade-in duration-300 space-y-5 shadow-xs">
                <div className="text-center space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/50 backdrop-blur-xs text-[#8c3b26] text-[10px] font-black uppercase tracking-widest border border-[#b85b40]">
                    <span className="material-symbols-outlined text-xs mr-1 align-middle">lock</span>
                    Checkout Security
                  </span>
                  <h2 className="font-display-lg text-xl text-[#3d231b] font-black text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {isSignUp ? 'Create an Account' : 'Sign In to Proceed'}
                  </h2>
                  <p className="text-[#5a372c] text-xs font-extrabold">Access your purchased sheet music in your personal library instantly.</p>
                </div>

                {authError && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 40%, #FECDD3 100%)",
                      boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px rgba(153, 27, 27, 0.15), 0 4px 15px rgba(225, 29, 72, 0.12)",
                      border: "1.5px solid #F43F5E",
                    }}
                    className="rounded-md px-4 py-2.5 text-xs font-black text-[#881337] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F43F5E] to-[#991B1B] text-white flex items-center justify-center shrink-0 shadow-xs border border-white/40">
                        <span className="material-symbols-outlined text-[13px] font-black select-none">priority_high</span>
                      </div>
                      <span className="tracking-wide">{authError}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                  {isSignUp && (
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#3d231b] ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-white/50 backdrop-blur-xs border-2 border-[#b85b40]/70 rounded-xl px-3.5 py-2.5 text-xs text-[#3d231b] font-bold placeholder-[#8c5243] focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#d68c78]"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#3d231b] ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="yourname@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-xs border-2 border-[#b85b40]/70 rounded-xl px-3.5 py-2.5 text-xs text-[#3d231b] font-bold placeholder-[#8c5243] focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#d68c78]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#3d231b] ml-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-xs border-2 border-[#b85b40]/70 rounded-xl px-3.5 py-2.5 text-xs text-[#3d231b] font-bold placeholder-[#8c5243] focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#d68c78]"
                    />
                  </div>

                  {isSignUp && (
                    <SearchableCountryDropdown
                      value={authCountry}
                      onChange={(country) => {
                        setAuthCountry(country);
                        setCustomerInfo(prev => ({ ...prev, country }));
                      }}
                    />
                  )}

                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                      boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                      border: "1px solid #D9A998",
                    }}
                    className="w-full text-white text-xs font-extrabold uppercase tracking-widest py-3.5 px-6 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.03] active:scale-95 flex items-center justify-center shadow-none mt-3"
                  >
                    {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
                  </button>
                </form>

                <div className="flex items-center my-4">
                  <div className="flex-grow h-px bg-[#b85b40]/40" />
                  <span className="px-3 text-[10px] font-black text-[#5a372c] uppercase tracking-wider">or</span>
                  <div className="flex-grow h-px bg-[#b85b40]/40" />
                </div>

                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('guest_name', 'Google Student');
                        localStorage.setItem('guest_email', 'google.student@gmail.com');
                        window.dispatchEvent(new Event('storage'));
                        setCustomerInfo({ fullName: 'Google Student', email: 'google.student@gmail.com', country: 'United States' });
                        setStep(4);
                      }}
                      className="py-2.5 px-3 bg-white/40 hover:bg-white/60 backdrop-blur-xs border-2 border-[#b85b40]/70 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-xs text-[#3d231b] font-extrabold"
                    >
                      <img src="https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=32&h=32&q=80" alt="Google" className="w-4 h-4 rounded-full object-cover" />
                      Google
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('guest_name', 'Apple Musician');
                        localStorage.setItem('guest_email', 'apple.musician@icloud.com');
                        window.dispatchEvent(new Event('storage'));
                        setCustomerInfo({ fullName: 'Apple Musician', email: 'apple.musician@icloud.com', country: 'United States' });
                        setStep(4);
                      }}
                      className="py-2.5 px-3 bg-white/40 hover:bg-white/60 backdrop-blur-xs border-2 border-[#b85b40]/70 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-xs text-[#3d231b] font-extrabold"
                    >
                      <span className="material-symbols-outlined text-base text-[#c97b63]">music_note</span>
                      Apple
                    </button>
                  </div>

                  <button
                    onClick={handleGuestCheckout}
                    className="w-full py-3 bg-white/20 hover:bg-white/40 backdrop-blur-xs border-2 border-solid border-[#d48b77] hover:border-[#b85b40] text-[#5a372c] font-black text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Continue as Guest (No Password Required)
                  </button>
                </div>

                <div className="text-center pt-4 border-t border-[#b85b40]/40 mt-4">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[#5a372c] font-extrabold text-xs hover:text-[#9c5443] hover:underline bg-transparent border-none cursor-pointer"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- STEP 4: CHECKOUT FORM -------------------- */}
            {step === 4 && (
              <div className="animate-in fade-in duration-300 space-y-6">
                <div>
                  <h1 className="font-display-lg text-xl md:text-2xl text-[#7a493b] font-black tracking-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {!isDirectBuy ? '2. Checkout Details' : '1. Checkout Details'}
                  </h1>
                  <p className="text-[#5a372c] text-xs font-bold">Enter your delivery email and select payment parameters.</p>
                </div>

                {checkoutError && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 40%, #FECDD3 100%)",
                      boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px rgba(153, 27, 27, 0.15), 0 4px 15px rgba(225, 29, 72, 0.12)",
                      border: "1.5px solid #F43F5E",
                    }}
                    className="rounded-md px-4 py-2.5 text-xs font-black text-[#881337] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F43F5E] to-[#991B1B] text-white flex items-center justify-center shrink-0 shadow-xs border border-white/40">
                        <span className="material-symbols-outlined text-[13px] font-black select-none">priority_high</span>
                      </div>
                      <span className="tracking-wide">{checkoutError}</span>
                    </div>
                    <button
                      onClick={() => setCheckoutError('')}
                      className="text-[#991B1B]/60 hover:text-[#991B1B] p-0.5 rounded transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-stretch">
                  {/* Form Info */}
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="bg-white/25 backdrop-blur-md border border-[#dfa38f] rounded-xl p-5 space-y-3.5">
                        <h3 className="text-xs font-black text-[#7a493b] uppercase tracking-wider border-b-2 border-[#b85b40]/50 pb-2.5 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#d68c78]">badge</span>
                          Customer Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#7a493b] ml-1">Full Name</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={customerInfo.fullName}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                              className="w-full bg-white/40 backdrop-blur-xs border border-[#dfa38f] rounded-xl px-3.5 py-2.5 text-xs text-[#5a372c] font-semibold placeholder:text-[#c4a69c] placeholder:font-normal placeholder:text-[11px] focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#d68c78]"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#7a493b] ml-1">Email Address (For PDF Delivery)</label>
                            <input
                              type="email"
                              placeholder="john.doe@example.com"
                              value={customerInfo.email}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                              className="w-full bg-white/40 backdrop-blur-xs border border-[#dfa38f] rounded-xl px-3.5 py-2.5 text-xs text-[#5a372c] font-semibold placeholder:text-[#c4a69c] placeholder:font-normal placeholder:text-[11px] focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#d68c78]"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Terms and Conditions Glossy Rose Gold Checkbox */}
                      <div className="flex items-start gap-3 bg-white/25 backdrop-blur-md border border-[#dfa38f] rounded-xl p-4">
                        <div
                          onClick={() => setTermsAccepted(!termsAccepted)}
                          className={`w-5 h-5 rounded-md border-2 transition-all cursor-pointer flex items-center justify-center shrink-0 mt-0.5 ${termsAccepted
                            ? 'bg-gradient-to-br from-[#d68c78] via-[#c97b63] to-[#9c5443] border-white text-white shadow-2xs'
                            : 'bg-white/50 border-[#b85b40] hover:bg-white/70'
                            }`}
                        >
                          {termsAccepted && <span className="material-symbols-outlined text-xs font-black">check</span>}
                        </div>
                        <label
                          onClick={() => setTermsAccepted(!termsAccepted)}
                          className="text-xs text-[#5a372c] font-bold leading-relaxed cursor-pointer select-none"
                        >
                          I agree to the <span className="font-black text-[#3d231b] hover:underline">Terms & Conditions</span>. I understand that since this is a digital purchase, sheet music downloads will be available immediately and are non-refundable.
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (clearBuyNowSheet) clearBuyNowSheet();
                          if (isDirectBuy) {
                            onNavigate('sheets');
                          } else {
                            setStep(2);
                          }
                        }}
                        className="py-3 px-5 bg-white/35 hover:bg-[#81594F] hover:text-white hover:border-[#81594F] backdrop-blur-md border-2 border-[#b85b40] text-[#3d231b] font-black text-xs rounded-xl transition-all duration-200 cursor-pointer"
                      >
                        {isDirectBuy ? "Back to Shop" : "Back to Cart"}
                      </button>
                      <button
                        type="submit"
                        style={{
                          background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                          boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                          border: "1px solid #D9A998",
                        }}
                        className="flex-grow text-white text-xs font-extrabold uppercase tracking-widest py-3.5 px-5 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 shadow-none"
                      >
                        Continue to Payment Method
                      </button>
                    </div>
                  </form>

                  {/* Order Summary Sideboard */}
                  <div className="bg-white/25 backdrop-blur-md border border-[#dfa38f] rounded-xl p-5 space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-[#3d231b] uppercase tracking-wider border-b-2 border-[#b85b40]/50 pb-2.5">
                        Order Summary
                      </h3>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {selectedSheetForBuyNow ? (
                          <div className="flex justify-between items-center gap-2 text-xs">
                            <div>
                              <span className="font-extrabold text-[#3d231b] block">{selectedSheetForBuyNow.title}</span>
                            </div>
                            <span className="font-extrabold text-[#9c5443]">{formatPrice(parsePrice(selectedSheetForBuyNow.price))}</span>
                          </div>
                        ) : (
                          cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-2 text-xs">
                              <div>
                                <span style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} className="font-extrabold text-[#3d231b] block truncate max-w-[150px] tracking-tight">{item.sheet.title}</span>
                              </div>
                              <span className="font-extrabold text-[#9c5443]">{formatPrice(parsePrice(item.sheet.price))}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-[#5a372c] border-t border-[#b85b40]/40 pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Subtotal</span>
                        <span className="font-extrabold text-[#3d231b]">{formatPrice(getSubtotal())}</span>
                      </div>
                      <div className="h-px bg-[#b85b40]/40 my-1.5" />
                      <div className="flex justify-between text-sm font-extrabold text-[#3d231b]">
                        <span>Total Paid</span>
                        <span className="text-base text-[#8c3b26] font-serif font-black">{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- STEP 5: PAYMENT METHOD SELECTOR -------------------- */}
            {step === 5 && (
              <div className="bg-white/35 backdrop-blur-md border-2 border-[#dfa38f] rounded-xl p-4 sm:p-5 w-full max-w-xl mx-auto relative overflow-hidden animate-in fade-in duration-300 space-y-4 shadow-xs">
                {isProcessingPayment && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center gap-3 z-50">
                    <span className="material-symbols-outlined text-3xl text-[#d68c78] animate-spin">sync</span>
                    <span className="text-xs font-black text-[#3d231b] tracking-widest uppercase">Contacting Payment Gateway...</span>
                  </div>
                )}

                <div className="text-left space-y-0.5">
                  <h2 className="font-display-lg text-base md:text-lg text-[#7a493b] font-black" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {!isDirectBuy ? '3. Select Payment Method' : '2. Select Payment Method'}
                  </h2>
                  <p className="text-[#5a372c] text-[11px] font-bold">
                    Select your preferred payment method below to complete your digital order.
                  </p>
                </div>

                {paymentApiError && paymentMethod === 'Credit Card' && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 40%, #FECDD3 100%)",
                      boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px rgba(153, 27, 27, 0.15), 0 4px 15px rgba(225, 29, 72, 0.12)",
                      border: "1.5px solid #F43F5E",
                    }}
                    className="rounded-md px-3.5 py-2 text-xs font-black text-[#881337] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-md text-left"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#F43F5E] to-[#991B1B] text-white flex items-center justify-center shrink-0 shadow-xs border border-white/40">
                      <span className="material-symbols-outlined text-[13px] font-black select-none">priority_high</span>
                    </div>
                    <span className="tracking-wide">{paymentApiError}</span>
                  </div>
                )}

                {/* 9 Payment Method Icon Buttons (No text next to icons) */}
                {(() => {
                  const localMethods: { name: string; logo: React.ReactNode }[] = [
                    { name: 'QRIS', logo: <QrisLogo className="w-full h-auto max-h-5 object-contain" /> },
                    { name: 'BCA Virtual Account', logo: <BcaLogo className="w-full h-auto max-h-5 object-contain" /> },
                    { name: 'Mandiri Virtual Account', logo: <MandiriLogo className="w-full h-auto max-h-5 object-contain" /> },
                    { name: 'BNI Virtual Account', logo: <BniLogo className="w-full h-auto max-h-5 object-contain" /> },
                    { name: 'BRI Virtual Account', logo: <BriLogo className="w-full h-auto max-h-5 object-contain" /> },
                    { name: 'Permata Virtual Account', logo: <PermataLogo className="w-full h-auto max-h-5 object-contain" /> },
                    { name: 'GoPay', logo: <GoPayLogo className="w-full h-auto max-h-5 object-contain" /> },
                    { name: 'ShopeePay', logo: <ShopeePayLogo className="w-full h-auto max-h-5 object-contain" /> },
                    { name: 'Credit Card', logo: <CreditCardLogo className="w-full h-auto max-h-5 object-contain" /> }
                  ];
                  return (
                    <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 items-center">
                      {localMethods.map((method) => {
                        const isSelected = paymentMethod === method.name;
                        return (
                          <button
                            key={method.name}
                            type="button"
                            title={method.name}
                            onClick={() => {
                              setPaymentMethod(method.name);
                              setPaymentApiError('');
                            }}
                            className={`h-11 w-full rounded-xl p-1.5 flex items-center justify-center cursor-pointer transition-all duration-200 select-none ${isSelected
                              ? 'border-2 border-[#b85b40] bg-gradient-to-br from-[#ffffff] via-[#fceee8] to-[#f8ded6] shadow-md scale-105 ring-2 ring-[#b85b40]/30'
                              : 'border border-[#dfa38f]/60 bg-white/60 hover:bg-white hover:border-[#c58270] shadow-2xs'
                              }`}
                          >
                            {method.logo}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* BOTTOM: Summary, Credit Card Form, Action Buttons */}
                <div className="space-y-3 pt-1">
                  {/* Conditional Credit Card Form */}
                  {paymentMethod === 'Credit Card' && (
                    <div className="bg-white/40 backdrop-blur-md border border-[#dfa38f] rounded-xl p-3 space-y-2 text-left animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-[#dfa38f]/50 pb-1">
                        <span className="text-[10px] font-black uppercase text-[#3d231b] tracking-wider block">
                          Secure Credit Card Details
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#3d231b] ml-0.5">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="4111 1111 1111 1111"
                            value={ccNumber}
                            onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19))}
                            className="w-full bg-white/60 backdrop-blur-xs border border-[#dfa38f] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#3d231b] font-bold placeholder-[#8c5243] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d68c78]"
                          />
                          <span className="material-symbols-outlined absolute left-2 top-2 text-[#8c3b26] text-sm">credit_card</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#3d231b] ml-0.5">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={ccExpiry}
                            onChange={(e) => setCcExpiry(e.target.value.replace(/[^0-9/]/g, '').substring(0, 5))}
                            className="w-full bg-white/60 backdrop-blur-xs border border-[#dfa38f] rounded-lg px-2.5 py-1.5 text-xs text-[#3d231b] font-bold placeholder-[#8c5243] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d68c78]"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#3d231b] ml-0.5">CVV / CVN</label>
                          <input
                            type="password"
                            placeholder="123"
                            value={ccCvv}
                            onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                            className="w-full bg-white/60 backdrop-blur-xs border border-[#dfa38f] rounded-lg px-2.5 py-1.5 text-xs text-[#3d231b] font-bold placeholder-[#8c5243] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d68c78]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Method Selected & Amount Summary */}
                  <div className="bg-white/40 backdrop-blur-md border border-[#dfa38f] rounded-xl p-3.5 flex items-center justify-between text-xs text-[#3d231b]">
                    <div className="text-left">
                      <span className="font-extrabold text-[#5a372c] text-[10px] block leading-none uppercase tracking-wider mb-1">Method Selected</span>
                      <span className="font-black text-[#3d231b] text-xs leading-tight">{paymentMethod}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#5a372c] text-[10px] block leading-none uppercase tracking-wider mb-1">Amount to Pay</span>
                      <span className="font-black text-[#8c3b26] text-sm font-serif leading-tight">{formatPrice(getTotal())}</span>
                    </div>
                  </div>

                  {/* Navigation / Action Buttons */}
                  <div className="flex gap-2.5 pt-1">
                    <button
                      onClick={() => setStep(4)}
                      className="py-3 px-4 bg-white/40 hover:bg-[#81594F] hover:text-white hover:border-[#81594F] backdrop-blur-md border border-[#dfa38f] text-[#3d231b] font-black text-xs rounded-xl transition-all duration-200 cursor-pointer shrink-0"
                    >
                      Back to Details
                    </button>
                    <button
                      onClick={handleSelectPaymentMethod}
                      style={{
                        background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                        boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                        border: "1px solid #D9A998",
                      }}
                      className="flex-grow text-white text-xs font-extrabold uppercase tracking-widest py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-none"
                    >
                      Pay Now ({formatPrice(getTotal())})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- STEP 6: PAYMENT SCREEN -------------------- */}
            {step === 6 && orderInfo && (
              <div className="bg-white/35 backdrop-blur-md border-2 border-[#dfa38f] rounded-2xl p-5 sm:p-6 max-w-md mx-auto text-center animate-in fade-in duration-300 space-y-4 shadow-sm">
                {/* Header */}
                <div className="space-y-1">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-white/70 text-[#8c3b26] text-[10px] font-extrabold uppercase tracking-widest border border-[#dfa38f]">
                    Awaiting Payment
                  </span>
                  <h2 className="font-display-lg text-lg sm:text-xl text-[#7a493b] font-black text-center pt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {!isDirectBuy ? '3. Complete Your Payment' : '2. Complete Your Payment'}
                  </h2>
                  <p className="text-[#6e5448] text-xs font-medium">Please follow the instructions below to complete your transaction.</p>
                </div>

                {/* Timer Badge */}
                <div className="inline-flex items-center justify-center gap-2 bg-white/60 backdrop-blur-xs border border-[#dfa38f]/80 rounded-full px-4 py-1.5 text-xs">
                  <span className="material-symbols-outlined text-[#8c3b26] text-base animate-spin" style={{ animationDuration: '3s' }}>
                    schedule
                  </span>
                  <span className="text-[10px] font-extrabold uppercase text-[#8c3b26] tracking-wider">Payment Timer:</span>
                  <span className="text-xs font-mono font-black text-[#3d231b]">{formatTime(timeLeft)}</span>
                </div>

                {/* Instructions & Details Box */}
                <div className="bg-white/50 backdrop-blur-md border border-[#dfa38f] rounded-xl p-4 text-xs text-[#3d231b] space-y-3.5 text-left shadow-2xs">
                  {(orderInfo.qrCodeUrl || ['QRIS', 'GoPay', 'DANA', 'ShopeePay', 'OVO'].some(m => paymentMethod.includes(m))) ? (
                    <div className="flex flex-col items-center gap-2.5">
                      <p className="text-[#6e5448] font-medium text-center text-xs leading-relaxed">
                        Scan the QR code below using your mobile banking or e-wallet app.
                      </p>
                      <div className="p-2.5 bg-white rounded-xl border border-[#dfa38f]/60 shadow-2xs">
                        {orderInfo.qrCodeUrl ? (
                          <img
                            src={orderInfo.qrCodeUrl}
                            alt="Midtrans QRIS QR Code"
                            className="w-32 h-32 object-contain"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-[#1d1b1a] relative flex items-center justify-center p-2 rounded-lg">
                            <div className="absolute top-1.5 left-1.5 w-6 h-6 border-t-2 border-l-2 border-white" />
                            <div className="absolute top-1.5 right-1.5 w-6 h-6 border-t-2 border-r-2 border-white" />
                            <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-b-2 border-l-2 border-white" />
                            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 border-b-2 border-r-2 border-white" />
                            <div className="w-9 h-9 bg-white rounded flex items-center justify-center font-bold text-[7.5px] text-[#3d231b] tracking-widest uppercase select-none">
                              STEPHANIE
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#8b7368]">QR ID: {orderInfo.orderId}</span>
                    </div>
                  ) : (paymentMethod.toLowerCase().includes('va') || paymentMethod.toLowerCase().includes('virtual') || orderInfo.vaNumber) ? (
                    <div className="space-y-2.5">
                      <p className="text-[#6e5448] font-medium text-center text-xs leading-relaxed">
                        Transfer to the Virtual Account number below from your mobile banking app or ATM.
                      </p>
                      <div className="bg-white/80 p-3 rounded-xl border border-[#dfa38f]/70 flex items-center justify-between gap-2 shadow-2xs">
                        <div className="text-left">
                          <span className="text-[10px] font-bold uppercase text-[#8b7368] block tracking-wider">VA Bank Target:</span>
                          <span className="font-extrabold text-[#3d231b] text-xs">{orderInfo.bankName || orderInfo.paymentMethod || 'Virtual Account'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase text-[#8b7368] block tracking-wider">VA Account Number:</span>
                          <span className="font-mono font-black text-xs sm:text-sm text-[#8c3b26] tracking-wider">{orderInfo.vaNumber || '8830129840284920'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (paymentMethod === 'PayPal' || orderInfo.redirectUrl) ? (
                    <div className="flex flex-col items-center gap-2 py-1">
                      <p className="text-[#6e5448] font-medium text-center text-xs leading-relaxed">
                        Click below to complete your checkout using PayPal.
                      </p>
                      <a
                        href={orderInfo.redirectUrl || 'https://www.sandbox.paypal.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 bg-[#0079c1] hover:bg-[#00457c] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 border-none no-underline shadow-xs"
                      >
                        <span className="material-symbols-outlined text-sm">payments</span>
                        Pay with PayPal
                      </a>
                    </div>
                  ) : (
                    <p className="text-[#6e5448] font-medium text-center text-xs leading-relaxed">
                      Transfer exact amount to target account or click simulated pay button. Target: <span className="font-bold text-[#3d231b]">{paymentMethod}</span>.
                    </p>
                  )}

                  <div className="h-px bg-[#dfa38f]/30 my-2" />

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#6e5448] font-medium">Billing Order ID</span>
                      <span className="font-bold font-mono text-[#3d231b]">{orderInfo.orderId}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#3d231b] font-extrabold">Total Amount Due</span>
                      <span className="font-black text-[#8c3b26] text-sm font-serif">
                        {formatPrice(orderInfo.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  {paymentStatus === 'verifying' ? (
                    <div className="py-3 px-4 bg-white/60 backdrop-blur-md rounded-xl flex items-center justify-center gap-2.5 border border-[#dfa38f]">
                      <span className="material-symbols-outlined text-base text-[#8c3b26] animate-spin">
                        progress_activity
                      </span>
                      <span className="text-xs font-bold text-[#3d231b]">Verifying transaction, please wait...</span>
                    </div>
                  ) : (
                    <button
                      onClick={simulatePaymentSuccess}
                      style={{
                        background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                        boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                        border: "1px solid #D9A998",
                      }}
                      className="w-full text-white text-xs font-extrabold uppercase tracking-widest py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.02] active:scale-95 flex items-center justify-center shadow-none"
                    >
                      Simulate Payment Success (Demo)
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel the checkout?')) {
                        if (isDirectBuy) {
                          onNavigate('sheets');
                        } else {
                          setStep(2);
                        }
                      }
                    }}
                    className="w-full py-1.5 bg-transparent hover:bg-[#81594F] hover:text-white text-[#8c3b26] font-bold text-xs rounded-lg transition-all border-none cursor-pointer"
                  >
                    {isDirectBuy ? 'Cancel Payment / Back to Shop' : 'Cancel Payment / Back to Cart'}
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- STEP 7: PAYMENT SUCCESSFUL -------------------- */}
            {step === 7 && orderInfo && (
              <div className="bg-white/35 backdrop-blur-md border-2 border-[#b85b40] rounded-xl p-6 md:p-8 max-w-lg mx-auto text-center animate-in fade-in duration-300 space-y-5 shadow-xs">
                <div className="flex justify-center mb-2">
                  <img
                    src="/stephanie-s-logo.png"
                    alt="Stephanie Keys Logo"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_2px_10px_rgba(181,114,98,0.3)] animate-in zoom-in-75 duration-500 hover:scale-105 transition-transform"
                  />
                </div>

                <div className="space-y-1 mb-5">
                  <span className="text-xs font-black tracking-widest text-[#8c3b26] uppercase">
                    {!isDirectBuy ? '✓ 4. PURCHASE COMPLETE' : '✓ 3. PURCHASE COMPLETE'}
                  </span>
                  <h2 className="font-display-lg text-xl text-[#7a493b] font-black" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Thank you for your purchase!
                  </h2>
                  <p className="text-[#5a372c] text-xs font-bold">Your sheet music is ready to download.</p>
                </div>

                <div className="space-y-3 mb-6 text-left">
                  {orderInfo.items.map((item, idx) => (
                    <div key={idx} className="bg-white/40 backdrop-blur-md border-2 border-[#b85b40] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} className="font-black text-sm text-[#3d231b] tracking-tight">{item.sheet.title}</h3>
                        <p className="text-xs text-[#5a372c] font-bold mt-0.5">Advanced Gospel Arrangement • PDF Format</p>
                      </div>
                      <button
                        onClick={() => handleDownloadFile(item.sheet.title, 'PDF')}
                        style={{
                          background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                          boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                          border: "1px solid #D9A998",
                        }}
                        className="w-full sm:w-auto text-white text-xs font-extrabold uppercase tracking-wider py-2.5 px-4 rounded-md cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-1.5 shrink-0 shadow-none outline-none focus:outline-none ring-0 focus:ring-0"
                      >
                        <span className="material-symbols-outlined text-sm select-none">download</span>
                        Download PDF
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-white/40 backdrop-blur-md border-2 border-[#b85b40] rounded-xl p-4 mb-5 text-xs text-left space-y-2 text-[#3d231b]">
                  <div className="flex justify-between">
                    <span className="text-[#5a372c] font-bold">Order Number</span>
                    <span className="font-mono font-black text-[#3d231b]">{orderInfo.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5a372c] font-bold">Invoice Number</span>
                    <span className="font-mono font-black text-[#3d231b]">{orderInfo.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5a372c] font-bold">Purchase Date</span>
                    <span className="font-black text-[#3d231b]">{orderInfo.purchaseDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5a372c] font-bold">Total Paid</span>
                    <span className="font-serif font-black text-[#8c3b26] text-sm">{formatPrice(orderInfo.total)}</span>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 pt-2 select-none">
                  <button
                    type="button"
                    onClick={() => {
                      if (clearBuyNowSheet) clearBuyNowSheet();
                      onNavigate('sheets');
                    }}
                    style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                    className="group relative inline-flex items-center justify-center py-1 px-2 text-[#5a372c] hover:text-[#8c3b26] font-extrabold italic text-xs md:text-[13px] tracking-wide cursor-pointer border-none bg-transparent transition-colors outline-none focus:outline-none"
                  >
                    <span className="relative">
                      Continue Shopping
                      <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full bg-gradient-to-r from-[#b57262] via-[#ffe2d8] to-[#b57262] shadow-[0_0_8px_rgba(232,180,162,0.6)] transition-all duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(8)}
                    style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                    className="group relative inline-flex items-center justify-center py-1 px-2 text-[#5a372c] hover:text-[#8c3b26] font-extrabold italic text-xs md:text-[13px] tracking-wide cursor-pointer border-none bg-transparent transition-colors outline-none focus:outline-none"
                  >
                    <span className="relative">
                      Library
                      <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full bg-gradient-to-r from-[#b57262] via-[#ffe2d8] to-[#b57262] shadow-[0_0_8px_rgba(232,180,162,0.6)] transition-all duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100" />
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceOrder(orderInfo);
                      setStep(10);
                    }}
                    style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                    className="group relative inline-flex items-center justify-center py-1 px-2 text-[#5a372c] hover:text-[#8c3b26] font-extrabold italic text-xs md:text-[13px] tracking-wide cursor-pointer border-none bg-transparent transition-colors outline-none focus:outline-none"
                  >
                    <span className="relative">
                      View Invoice
                      <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full bg-gradient-to-r from-[#b57262] via-[#ffe2d8] to-[#b57262] shadow-[0_0_8px_rgba(232,180,162,0.6)] transition-all duration-300 ease-out origin-center scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100" />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- STEP 8: MY LIBRARY -------------------- */}
        {step === 8 && (
          <div className="bg-transparent border-2 border-[#dfa38f] shadow-sm rounded-2xl p-6 md:p-8 flex flex-col gap-6 animate-in fade-in duration-300">

            {/* Library Header (Just text + Back button, no rectangular banner box) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dfa38f]/40">
              <h1 className="font-display-lg text-2xl md:text-3xl text-[#3d231b] font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                My Sheet Music Library
              </h1>
              <button
                type="button"
                onClick={() => {
                  if (orderInfo) {
                    setStep(7);
                  } else {
                    onNavigate('sheets');
                  }
                }}
                className="py-1.5 px-3.5 bg-white/40 hover:bg-white/75 backdrop-blur-xs border border-[#dfa38f]/70 rounded-md text-[#7a4b3d] hover:text-[#4a2e25] font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition-all outline-none focus:outline-none shrink-0 self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back</span>
              </button>
            </div>

            {/* Library Grid */}
            {getLibrarySheets().length === 0 ? (
              <div className="text-center py-20 bg-white/40 backdrop-blur-md border-2 border-solid border-[#dfa38f]/60 rounded-xl">
                <span className="material-symbols-outlined text-4xl text-[#ab7e66]/40">library_books</span>
                <p className="font-sans text-sm text-[#4a372e] mt-3 font-bold">No sheet music found</p>
                <p className="font-sans text-xs text-[#8b7368] mt-1 max-w-xs mx-auto leading-relaxed">
                  Make sure you have completed the order, or try typing a different search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {getLibrarySheets().map((sheet, index) => (
                  <div
                    key={index}
                    className="group bg-white/45 backdrop-blur-md border-2 border-[#dfa38f]/60 rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                  >
                    {/* Cover Art Layer */}
                    <div className="relative aspect-[4/3] bg-[#faf6f4] overflow-hidden border-b border-[#e8cdc1]/10">
                      <img
                        src={sheet.image}
                        alt={sheet.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/95 text-[#856758] font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded shadow border border-[#e8cdc1]/20">
                        {(() => {
                          try {
                            const saved = localStorage.getItem('purchased_sheets_dates');
                            const dates = saved ? JSON.parse(saved) : {};
                            const dStr = dates[sheet.title];
                            if (dStr) return `Date: ${dStr}`;
                          } catch (e) { }
                          const nowStr = new Date().toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          });
                          return `Date: ${nowStr}`;
                        })()}
                      </span>
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="font-sans text-sm font-bold text-[#4a372e] group-hover:text-[#856758] transition-colors truncate">
                          {sheet.title}
                        </h3>
                        <p className="text-[10px] text-[#8b7368] mt-1 line-clamp-2 leading-relaxed">
                          {sheet.description}
                        </p>
                      </div>

                      {/* Download PDF button */}
                      <div className="border-t border-solid border-[#d48b77]/40 pt-3.5 mt-auto">
                        <button
                          onClick={() => handleDownloadFile(sheet.title, 'PDF')}
                          style={{
                            background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                            boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                            border: "1px solid #D9A998",
                          }}
                          className="w-full py-2.5 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-md cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-1.5 shadow-none outline-none focus:outline-none ring-0 focus:ring-0"
                        >
                          <span className="material-symbols-outlined text-xs">file_download</span>
                          Download Sheet Music (PDF)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------- STEP 9: DOWNLOAD DETAIL PAGE -------------------- */}
        {step === 9 && selectedDownloadSheet && (
          <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-2xl p-6 md:p-10 animate-in fade-in duration-300">
            <button
              onClick={() => setStep(8)}
              className="mb-6 py-2 px-3 hover:bg-[#e8cdc1]/20 text-[#6e5a51] font-bold text-xs rounded-lg transition-colors cursor-pointer border-none bg-transparent flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Library
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
              {/* Cover Artwork Column */}
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-[#faf6f4] rounded-xl overflow-hidden shadow-md border border-[#e8cdc1]/30 relative">
                  <img
                    src={selectedDownloadSheet.image}
                    alt={selectedDownloadSheet.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                    <span className="bg-white/95 text-[#856758] font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                      Official Transcribed Arrangement
                    </span>
                  </div>
                </div>
                <div className="bg-[#fcfaf9] border border-[#e8cdc1]/20 rounded-xl p-4 text-[11px] text-[#8b7368] space-y-2.5">
                  <div className="flex justify-between border-b border-[#e8cdc1]/10 pb-1.5">
                    <span>File Format:</span>
                    <span className="font-bold text-[#4a372e]">PDF</span>
                  </div>
                  <div className="flex justify-between border-b border-[#e8cdc1]/10 pb-1.5">
                    <span>Sheet Size:</span>
                    <span className="font-bold text-[#4a372e]">1.8 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span className="font-bold text-[#4a372e]">{downloadCounts[selectedDownloadSheet.title] || 0} times</span>
                  </div>
                </div>
              </div>

              {/* Details & Download Options */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-display-lg text-2xl md:text-3xl text-[#4a372e] font-bold tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {selectedDownloadSheet.title}
                  </h1>
                  <p className="text-[#5a4740] text-xs leading-relaxed">{selectedDownloadSheet.description}</p>
                </div>

                {/* Download Formats Grid */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#4a372e] uppercase tracking-wider border-b border-[#e8cdc1]/20 pb-2">Available File Formats</h3>

                  <div className="space-y-3">
                    {[
                      { type: 'PDF', icon: 'picture_as_pdf', name: 'Printable Sheet Music PDF', size: '1.8 MB', desc: 'Note-for-note transcription score with chord badges' }
                    ].map((format) => (
                      <div
                        key={format.type}
                        className="p-4 bg-[#faf6f4] border border-[#e8cdc1]/20 rounded-xl flex items-center justify-between gap-4 hover:border-[#dfa38f]/30 transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="material-symbols-outlined text-2xl text-[#856758] bg-white p-2 rounded-lg border border-[#e8cdc1]/10">
                            {format.icon}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-[#4a372e]">{format.name}</div>
                            <div className="text-[9px] text-[#8b7368] mt-0.5">{format.desc} • {format.size}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadFile(selectedDownloadSheet.title, format.type)}
                          className="py-2.5 px-4 bg-white border border-[#dfa38f]/40 hover:bg-[#dfa38f]/10 text-[#856758] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return button */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      // Seed an invoice with this sheet if user wants to see it
                      const defaultOrder: OrderDetails = {
                        orderId: 'SK-100293',
                        transactionId: 'TXN-82738192',
                        items: [{ sheet: selectedDownloadSheet, quantity: 1 }],
                        subtotal: parsePrice(selectedDownloadSheet.price),
                        discount: 0,
                        tax: parsePrice(selectedDownloadSheet.price) * 0.1,
                        total: parsePrice(selectedDownloadSheet.price) * 1.1,
                        currency: 'USD',
                        paymentMethod: 'Credit Card',
                        customerInfo: { fullName: 'Phanilie Student', email: 'student@example.com', country: 'United States' },
                        purchaseDate: 'July 23, 2026',
                        invoiceNumber: 'INV-2026-1029'
                      };
                      setInvoiceOrder(defaultOrder);
                      setStep(10);
                    }}
                    className="py-2 px-3 bg-transparent text-[#8b7368] hover:underline font-bold text-xs border-none cursor-pointer"
                  >
                    View Purchase Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- STEP 10: INVOICE -------------------- */}
        {step === 10 && invoiceOrder && (
          <div className="bg-white border border-[#dfa38f]/20 shadow-xl rounded-2xl p-6 md:p-10 max-w-2xl mx-auto animate-in fade-in duration-300 invoice-print-container">

            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-[#e8cdc1]/30 pb-6 mb-6">
              <div>
                <div className="inline-block border-b-2 border-[#dfa38f] pb-1">
                  <span className="font-display-lg text-lg md:text-xl font-black text-[#5a372c]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Stephanie Keys Receipt
                  </span>
                </div>
                <span className="text-[10px] text-[#8b7368] block mt-1 font-bold">Premium Piano Sheets</span>
              </div>
              <div className="text-left sm:text-right">
                <h2 className="text-base font-bold text-[#4a372e] uppercase tracking-wider">Invoice / Receipt</h2>
                <div className="font-mono text-xs text-[#8b7368] mt-0.5">Invoice: {invoiceOrder.invoiceNumber}</div>
                <div className="font-mono text-xs text-[#8b7368]">Order ID: {invoiceOrder.orderId}</div>
              </div>
            </div>

            {/* Bill details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-8 text-[#5a4740]">
              <div className="space-y-1">
                <span className="font-bold text-[#8b7368] uppercase tracking-wider block text-[9px]">Billed To:</span>
                <span className="font-bold text-[#4a372e] text-sm block">{invoiceOrder.customerInfo.fullName}</span>
                <span>{invoiceOrder.customerInfo.email}</span>
                <span className="block mt-1 font-semibold">{invoiceOrder.customerInfo.country}</span>
              </div>
              <div className="space-y-1 text-left sm:text-right">
                <span className="font-bold text-[#8b7368] uppercase tracking-wider block text-[9px]">Payment Metadata:</span>
                <div><span className="text-[#8b7368]">Purchase Date:</span> <span className="font-semibold">{invoiceOrder.purchaseDate}</span></div>
                <div><span className="text-[#8b7368]">Payment Method:</span> <span className="font-semibold">{invoiceOrder.paymentMethod}</span></div>
                <div><span className="text-[#8b7368]">Transaction ID:</span> <span className="font-mono">{invoiceOrder.transactionId}</span></div>
              </div>
            </div>

            {/* Item List Table */}
            <div className="border border-[#e8cdc1]/35 rounded-xl overflow-hidden mb-6">
              <table className="w-full border-collapse text-xs text-left text-[#5a4740]">
                <thead className="bg-[#fbf5f1]/60 text-[#8a6858] font-bold border-b border-[#e8cdc1]/30">
                  <tr>
                    <th className="py-3 px-4">Item Title</th>
                    <th className="py-3 px-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8cdc1]/15">
                  {invoiceOrder.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fcf8f6]/30">
                      <td className="py-3.5 px-4 font-bold text-[#4a372e]">{item.sheet.title}</td>
                      <td className="py-3.5 px-4 text-right font-bold">{formatPrice(parsePrice(item.sheet.price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Box */}
            <div className="max-w-xs ml-auto text-xs text-[#5a4740] space-y-2 mb-8 bg-[#fcfaf9] border border-[#e8cdc1]/25 rounded-xl p-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(invoiceOrder.subtotal)}</span>
              </div>
              {invoiceOrder.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount Applied</span>
                  <span>-{formatPrice(invoiceOrder.discount)}</span>
                </div>
              )}
              <div className="h-px bg-[#e8cdc1]/20 my-2" />
              <div className="flex justify-between font-bold text-sm text-[#4a372e]">
                <span>Total Paid</span>
                <span className="text-[#856758]">{formatPrice(invoiceOrder.total)}</span>
              </div>
            </div>

            {/* Invoice Footer / Action Buttons */}
            <div className="flex justify-between items-center border-t border-[#e8cdc1]/30 pt-6 gap-4 no-print">
              <button
                onClick={() => setStep(8)}
                className="py-2.5 px-4 bg-transparent hover:bg-[#e8cdc1]/10 text-[#856758] border border-[#856758]/35 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Back to Library
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    alert('Simulating PDF invoice generation...');
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = `Invoice-${invoiceOrder.invoiceNumber}.pdf`;
                    // Mock click
                    alert(`Invoice ${invoiceOrder.invoiceNumber}.pdf has been compiled and downloaded.`);
                  }}
                  style={{
                    background: "linear-gradient(135deg, #F8E8DF 0%, #EAC4B1 20%, #D9A998 42%, #CB9E8A 62%, #B58474 82%, #81594F 100%)",
                    boxShadow: "inset 0 1.5px 1px #FFFFFF, inset 0 -1.5px 2px #905c4d",
                    border: "1px solid #D9A998",
                  }}
                  className="text-white text-xs font-extrabold uppercase tracking-widest py-2.5 px-5 rounded-md cursor-pointer transition-all duration-300 ease-out hover:brightness-115 hover:scale-[1.03] active:scale-95 flex items-center gap-1.5 shadow-none outline-none focus:outline-none ring-0 focus:ring-0"
                >
                  <span className="material-symbols-outlined text-base">file_download</span>
                  Download Invoice (PDF)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styled printable view logic */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-print-container, .invoice-print-container * {
            visibility: visible;
          }
          .invoice-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
