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

// Exchange rates relative to USD
const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'IDR', symbol: 'Rp ', rate: 15500 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.77 }
];

export default function SheetPurchaseFlow({
  initialStep,
  onNavigate,
  selectedSheetForBuyNow,
  clearBuyNowSheet
}: SheetPurchaseFlowProps) {
  const isDirectBuy = Boolean(selectedSheetForBuyNow);

  // --- Core States ---
  const [step, setStep] = useState<number>(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") !== "false";
    if (!loggedIn && initialStep >= 4 && initialStep <= 6) {
      return 3; // Redirect to inline auth step if not logged in
    }
    return initialStep;
  });
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
    if (customerInfo.country === 'Indonesia') {
      setSelectedCurrency('IDR');
    } else {
      setSelectedCurrency('USD');
    }
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
  const parsePrice = (_priceStr?: string): number => {
    return 5.00;
  };

  const formatPrice = (usdAmount: number) => {
    return `$${usdAmount.toFixed(2)}`;
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



  const removeFromCart = (title: string) => {
    setCart(prev => prev.filter(item => item.sheet.title !== title));
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

    const orderId = 'PH-' + Math.floor(100000 + Math.random() * 900000);
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
          bankName: result.bank || result.bankName,
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
        bankName: paymentMethod.toLowerCase().includes('va') 
          ? paymentMethod.replace("Virtual Account ", "").toUpperCase() 
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
      className="w-full flex-grow relative overflow-hidden py-12 px-4 md:px-8 min-h-[calc(100vh-80px)]"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255, 248, 243, 0.25), rgba(248, 233, 224, 0.38)), url('/vintage-desk-bg.jpg')",
        backgroundSize: '135%',
        backgroundPosition: '65% 45%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Visual background marble/glow overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#dfa38f]/15 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ffd0ab]/15 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Progress Bar (Visible steps 2-7) */}
        {step >= 2 && step <= 7 && (
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-[9px] md:text-[10px] text-[#6e463b] font-bold uppercase tracking-wider mb-2">
              {!isDirectBuy ? (
                <>
                  <span className={step >= 2 ? 'text-[#6e463b] font-extrabold' : 'text-[#8b7368]/60'}>1. Shopping Cart</span>
                  <span className={step >= 3 ? 'text-[#6e463b] font-extrabold' : 'text-[#8b7368]/60'}>2. Checkout Details</span>
                  <span className={step >= 5 ? 'text-[#6e463b] font-extrabold' : 'text-[#8b7368]/60'}>3. Payment Method</span>
                  <span className={step >= 7 ? 'text-[#6e463b] font-extrabold' : 'text-[#8b7368]/60'}>4. Order Successful</span>
                </>
              ) : (
                <>
                  <span className={step >= 3 ? 'text-[#6e463b] font-extrabold' : 'text-[#8b7368]/60'}>1. Checkout Details</span>
                  <span className={step >= 5 ? 'text-[#6e463b] font-extrabold' : 'text-[#8b7368]/60'}>2. Payment Method</span>
                  <span className={step >= 7 ? 'text-[#6e463b] font-extrabold' : 'text-[#8b7368]/60'}>3. Order Successful</span>
                </>
              )}
            </div>
            <div className="h-1 bg-[#dfa38f]/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#dfa38f] to-[#ab7e66] transition-all duration-500 rounded-full"
                style={{
                  width: `${
                    !isDirectBuy ? (
                      step === 2 ? 25 :
                      step === 3 || step === 4 ? 50 :
                      step === 5 || step === 6 ? 75 : 100
                    ) : (
                      step === 3 || step === 4 ? 33 :
                      step === 5 || step === 6 ? 66 : 100
                    )
                  }%`
                }}
              />
            </div>
          </div>
        )}

        {/* -------------------- STEP 2: SHOPPING CART -------------------- */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Main Outer Cart Card Container with Rose Gold Border */}
            <div className="bg-white/90 backdrop-blur-md border-2 border-[#dfa38f] shadow-[0_12px_40px_rgba(223,163,143,0.18)] rounded-2xl p-6 md:p-10 flex flex-col gap-6 relative">
              {cart.length === 0 ? (
                <div className="text-center py-16 bg-white/50 border-2 border-dashed border-[#dfa38f]/60 rounded-xl">
                  <span className="material-symbols-outlined text-5xl text-[#ab7e66]/40 select-none">shopping_cart</span>
                  <p className="font-sans text-sm text-[#4a372e] mt-3 font-bold">Your cart is empty</p>
                  <p className="font-sans text-xs text-[#8b7368] mt-1 max-w-xs mx-auto leading-relaxed">
                    Browse our selection of beautiful gospel, jazz, and classical crossover sheets to add them to your cart.
                  </p>
                  <button 
                    onClick={() => onNavigate('sheets')}
                    className="mt-6 py-2.5 px-6 bg-[#856758] text-white font-bold text-xs rounded-xl hover:bg-[#785b4c] transition-colors border-2 border-[#dfa38f] cursor-pointer shadow-md"
                  >
                    Go to Sheet Music Shop
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {cart.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4.5 bg-[#fffcfb] border-2 border-[#dfa38f] hover:border-[#c58270] rounded-xl shadow-[0_3px_12px_rgba(223,163,143,0.1)] transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.sheet.image} 
                            alt={item.sheet.title} 
                            className="w-16 h-16 object-cover rounded-lg border-2 border-[#dfa38f] bg-[#faf6f4] flex-shrink-0 shadow-2xs"
                          />
                          <div>
                            <h3 style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} className="text-sm font-bold text-[#4a2c20] tracking-tight">{item.sheet.title}</h3>
                            <p className="text-[10px] text-[#8b7368] mt-0.5 line-clamp-1">{item.sheet.description}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {item.sheet.genres.map((g, i) => (
                                <span key={i} className="bg-[#fff8f5] text-[#7a4e40] px-2 py-0.5 rounded-md text-[9px] font-bold border-2 border-[#dfa38f] shadow-2xs">
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-dashed border-[#dfa38f]/40 pt-3 sm:pt-0">
                          {/* Pricing and Action */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-bold text-[#4a372e]">
                                {formatPrice(parsePrice(item.sheet.price))}
                              </div>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item.sheet.title)}
                              className="w-7.5 h-7.5 rounded-full bg-[#faf0eb] hover:bg-[#f2dbd2] text-[#ab7e66] hover:text-[#5a3d31] flex items-center justify-center transition-all border-2 border-[#dfa38f] cursor-pointer shadow-xs"
                              title="Remove item"
                            >
                              <span className="material-symbols-outlined text-xs font-bold">close</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Card with Rose Gold Border */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#fffdfc] via-[#fcf6f3] to-[#f9ece6] border-2 border-[#dfa38f] rounded-xl p-6 shadow-[0_4px_20px_rgba(223,163,143,0.15)] space-y-5">
                      <h4 className="text-xs font-bold text-[#4a372e] uppercase tracking-wider border-b-2 border-[#dfa38f]/60 pb-2">Order Summary</h4>
                      <div className="space-y-2 text-xs text-[#8b7368]">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-bold text-[#4a372e]">{formatPrice(getSubtotal())}</span>
                        </div>
                        <div className="h-px bg-[#dfa38f]/40 my-2" />
                        <div className="flex justify-between text-sm font-bold text-[#4a372e]">
                          <span>Total</span>
                          <span className="text-[#856758] text-base">{formatPrice(getTotal())}</span>
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
                          backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                        }}
                        className="w-full text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl border-2 border-[#f5d5cb] cursor-pointer shadow-[0_4px_12px_rgba(223,163,143,0.35)] transition-all hover:scale-[1.01] active:scale-[0.98]"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Find More Sheet Music Button - Positioned OUTSIDE of the Main Card Box with Rose Gold Outline Border */}
            <div className="flex items-center justify-start">
              <button 
                onClick={() => onNavigate('sheets')}
                className="py-3 px-6 bg-white/90 hover:bg-[#fff9f6] text-[#6e463b] hover:text-[#522f25] border-2 border-[#dfa38f] hover:border-[#c58270] font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2 group shrink-0 outline-none"
              >
                <span className="material-symbols-outlined text-base text-[#dfa38f] group-hover:text-[#c58270] transition-colors">west</span>
                Find More Sheet Music
              </button>
            </div>
          </div>
        )}

        {/* -------------------- STEP 3: SIGN IN / CREATE ACCOUNT -------------------- */}
        {step === 3 && (
          <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-2xl p-6 md:p-10 max-w-xl mx-auto animate-in fade-in duration-300">
            <div className="text-center space-y-2 mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#dfa38f]/15 text-[#8a6858] text-[9px] font-bold uppercase tracking-widest border border-[#dfa38f]/20">
                Checkout Security
              </span>
              <h2 className="font-display-lg text-2xl text-[#4a372e] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                {isSignUp ? 'Create an Account' : 'Sign In to Proceed'}
              </h2>
              <p className="text-[#8b7368] text-xs">Access your purchased sheet music in your personal library instantly.</p>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200/50 text-red-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-sm">error</span>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-lg px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="yourname@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-lg px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-white/80 border border-[#dfa38f]/30 rounded-lg px-4 py-3 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
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
                  backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                }}
                className="w-full text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-lg border border-white/20 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all mt-4"
              >
                {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-[#e8cdc1]/30" />
              <span className="px-3 text-[10px] font-bold text-[#8b7368] uppercase tracking-wider">or</span>
              <div className="flex-grow h-px bg-[#e8cdc1]/30" />
            </div>

            <div className="space-y-3">
              {/* Google / Apple Sign Ins */}
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
                  className="py-3 px-4 bg-white hover:bg-[#faf6f4] border border-[#dfa38f]/35 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-[#5a4740] font-bold"
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
                  className="py-3 px-4 bg-white hover:bg-[#faf6f4] border border-[#dfa38f]/35 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs text-[#5a4740] font-bold"
                >
                  <span className="material-symbols-outlined text-base">music_note</span>
                  Apple
                </button>
              </div>

              {/* Guest Option */}
              <button 
                onClick={handleGuestCheckout}
                className="w-full py-3.5 bg-transparent border border-dashed border-[#856758]/40 hover:bg-[#856758]/5 text-[#856758] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Continue as Guest (No Password Required)
              </button>
            </div>

            <div className="text-center pt-6 border-t border-[#e8cdc1]/30 mt-6">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#6a564d] font-bold text-xs hover:underline bg-transparent border-none cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        )}

        {/* -------------------- STEP 4: CHECKOUT FORM -------------------- */}
        {step === 4 && (
          <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-2xl p-6 md:p-10 flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h1 className="font-display-lg text-2xl md:text-3xl text-[#4a372e] font-bold tracking-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Checkout Details
              </h1>
              <p className="text-[#8b7368] text-xs">Enter your delivery email and select payment parameters.</p>
            </div>

            {checkoutError && (
              <div className="bg-red-50 border border-red-200/50 text-red-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {checkoutError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* Form Info */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                <div className="bg-[#fcfaf9] border border-[#e8cdc1]/20 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-[#4a372e] uppercase tracking-wider border-b border-[#e8cdc1]/25 pb-2">
                    Customer Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={customerInfo.fullName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                        className="w-full bg-white border border-[#dfa38f]/30 rounded-lg px-4 py-3 text-xs text-[#5a4740] focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Email Address (For PDF Delivery)</label>
                      <input
                        type="email"
                        placeholder="john.doe@example.com"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full bg-white border border-[#dfa38f]/30 rounded-lg px-4 py-3 text-xs text-[#5a4740] focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SearchableCountryDropdown
                      value={customerInfo.country}
                      onChange={(country) => setCustomerInfo({ ...customerInfo, country })}
                    />
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Currency</label>
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="w-full bg-white border border-[#dfa38f]/30 rounded-lg px-4 py-3 text-xs text-[#5a4740] focus:outline-none focus:ring-1 focus:ring-[#dfa38f] font-bold"
                      >
                        {CURRENCIES.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.symbol.trim()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3 bg-[#fcfaf9] border border-[#e8cdc1]/20 rounded-xl p-4">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded text-[#dfa38f] border-[#dfa38f]/50 mt-0.5 focus:ring-[#dfa38f] cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] text-[#8b7368] leading-relaxed cursor-pointer select-none">
                    I agree to the <span className="font-bold text-[#4a372e] hover:underline">Terms & Conditions</span>. I understand that since this is a digital purchase, sheet music downloads will be available immediately and are non-refundable.
                  </label>
                </div>

                <div className="flex gap-4">
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
                    className="py-3 px-5 bg-white border border-[#856758]/30 hover:bg-[#e8cdc1]/10 text-[#856758] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {isDirectBuy ? "Back to Shop" : "Back to Cart"}
                  </button>
                  <button 
                    type="submit"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                    }}
                    className="flex-grow text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-lg border border-white/20 cursor-pointer shadow-md hover:scale-[1.01]"
                  >
                    Continue to Payment Method
                  </button>
                </div>
              </form>

              {/* Order Summary Sideboard */}
              <div className="bg-[#fcfaf9] border border-[#dfa38f]/20 rounded-xl p-5 space-y-5 h-fit">
                <h3 className="text-xs font-bold text-[#4a372e] uppercase tracking-wider border-b border-[#e8cdc1]/25 pb-2">
                  Order Summary
                </h3>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {selectedSheetForBuyNow ? (
                    <div className="flex justify-between items-center gap-2 text-xs">
                      <div>
                        <span className="font-bold text-[#4a372e] block">{selectedSheetForBuyNow.title}</span>
                      </div>
                      <span className="font-bold text-[#4a372e]">{formatPrice(parsePrice(selectedSheetForBuyNow.price))}</span>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-2 text-xs">
                        <div>
                          <span style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} className="font-bold text-[#4a2c20] block truncate max-w-[150px] tracking-tight">{item.sheet.title}</span>
                        </div>
                        <span className="font-bold text-[#4a372e]">{formatPrice(parsePrice(item.sheet.price))}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="h-px bg-[#e8cdc1]/20 my-2" />

                <div className="space-y-2 text-xs text-[#8b7368]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="h-px bg-[#e8cdc1]/20 my-2" />
                  <div className="flex justify-between text-sm font-bold text-[#4a372e]">
                    <span>Total Paid</span>
                    <span className="text-base text-[#856758]">{formatPrice(getTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- STEP 5: PAYMENT METHOD SELECTOR -------------------- */}
        {step === 5 && (
          <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-2xl p-6 md:p-10 max-w-2xl mx-auto relative overflow-hidden animate-in fade-in duration-300">
            {/* Loading progress overlay */}
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-white/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3.5 z-50">
                <span className="material-symbols-outlined text-4xl text-[#dfa38f] animate-spin">sync</span>
                <span className="text-xs font-bold text-[#4a372e] tracking-widest uppercase animate-pulse">Contacting Midtrans Secure Gateway...</span>
              </div>
            )}

            <div className="mb-6 text-left">
              <h2 className="font-display-lg text-2xl text-[#4a372e] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Select Payment Method
              </h2>
              <p className="text-[#8b7368] text-xs">
                {selectedCurrency === 'IDR' || customerInfo.country === 'Indonesia'
                  ? 'We support complete local bank transfers, QRIS, and credit cards.'
                  : 'We support secure worldwide credit cards and PayPal checkout.'}
              </p>
            </div>

            {paymentApiError && (
              <div className="bg-red-50 border border-red-200/50 text-red-600 rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2 mb-5 text-left">
                <span className="material-symbols-outlined text-sm">error</span>
                {paymentApiError}
              </div>
            )}

            {(() => {
              const isLocal = selectedCurrency === 'IDR' || customerInfo.country === 'Indonesia';
              if (isLocal) {
                const localMethods = [
                  { name: 'Credit Card', icon: 'credit_card', desc: 'Visa, Mastercard, JCB' },
                  { name: 'Virtual Account BCA', icon: 'account_balance', desc: 'BCA Bank Transfer' },
                  { name: 'Virtual Account Mandiri', icon: 'account_balance', desc: 'Mandiri Transfer' },
                  { name: 'Virtual Account BNI', icon: 'account_balance', desc: 'BNI Transfer' },
                  { name: 'Virtual Account BRI', icon: 'account_balance', desc: 'BRI Transfer' },
                  { name: 'GoPay', icon: 'account_balance_wallet', desc: 'Gojek E-Wallet' },
                  { name: 'DANA', icon: 'wallet', desc: 'Dana E-Wallet' },
                  { name: 'ShopeePay', icon: 'shopping_bag', desc: 'Shopee E-Wallet' },
                  { name: 'QRIS', icon: 'qr_code_2', desc: 'GPN Unified QR' }
                ];
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-8 text-left">
                    {localMethods.map((method) => {
                      const isSelected = paymentMethod === method.name;
                      return (
                        <button
                          key={method.name}
                          type="button"
                          onClick={() => setPaymentMethod(method.name)}
                          className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-[#dfa38f] bg-[#dfa38f]/10 shadow-[0_4px_12px_rgba(223,163,143,0.15)] ring-1 ring-[#dfa38f]' 
                              : 'border-[#e8cdc1]/40 bg-white hover:bg-[#fcf8f6] hover:border-[#dfa38f]/30'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-2xl ${isSelected ? 'text-[#856758]' : 'text-[#8b7368]/60'}`}>
                            {method.icon}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-[#4a372e]">{method.name}</div>
                            <div className="text-[9px] text-[#8b7368] mt-0.5 leading-snug">{method.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              } else {
                const foreignMethods = [
                  { name: 'Credit Card', icon: 'credit_card', desc: 'Visa, Mastercard, AMEX' },
                  { name: 'PayPal', icon: 'payments', desc: 'PayPal Checkout' }
                ];
                return (
                  <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                    {foreignMethods.map((method) => {
                      const isSelected = paymentMethod === method.name;
                      return (
                        <button
                          key={method.name}
                          type="button"
                          onClick={() => setPaymentMethod(method.name)}
                          className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-[#dfa38f] bg-[#dfa38f]/10 shadow-[0_4px_12px_rgba(223,163,143,0.15)] ring-1 ring-[#dfa38f]' 
                              : 'border-[#e8cdc1]/40 bg-white hover:bg-[#fcf8f6] hover:border-[#dfa38f]/30'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-2xl ${isSelected ? 'text-[#856758]' : 'text-[#8b7368]/60'}`}>
                            {method.icon}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-[#4a372e]">{method.name}</div>
                            <div className="text-[9px] text-[#8b7368] mt-0.5 leading-snug">{method.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              }
            })()}

            {/* Credit Card Input Form (rendered inline if Credit Card is selected) */}
            {paymentMethod === 'Credit Card' && (
              <div className="bg-[#fcfaf9] border border-[#e8cdc1]/45 rounded-xl p-5 mb-8 space-y-4 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between border-b border-[#e8cdc1]/20 pb-2">
                  <span className="text-[10px] font-bold uppercase text-[#856758] tracking-widest block">
                    Secure Credit Card details
                  </span>
                  <div className="flex gap-1.5">
                    <span className="text-[8px] bg-white border border-[#e8cdc1]/30 text-[#8b7368] font-bold px-1.5 py-0.5 rounded">VISA</span>
                    <span className="text-[8px] bg-white border border-[#e8cdc1]/30 text-[#8b7368] font-bold px-1.5 py-0.5 rounded">MASTERCARD</span>
                    <span className="text-[8px] bg-white border border-[#e8cdc1]/30 text-[#8b7368] font-bold px-1.5 py-0.5 rounded">JCB</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4111 1111 1111 1111"
                      value={ccNumber}
                      onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19))}
                      className="w-full bg-white border border-[#dfa38f]/30 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8b7368]/60 text-lg">credit_card</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={ccExpiry}
                      onChange={(e) => setCcExpiry(e.target.value.replace(/[^0-9/]/g, '').substring(0, 5))}
                      className="w-full bg-white border border-[#dfa38f]/30 rounded-lg px-4 py-2.5 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8b7368] ml-1">CVV / CVN</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={ccCvv}
                      onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      className="w-full bg-white border border-[#dfa38f]/30 rounded-lg px-4 py-2.5 text-xs text-[#5a4740] placeholder-[#ab7e66]/40 focus:outline-none focus:ring-1 focus:ring-[#dfa38f]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Redirection Note */}
            {paymentMethod === 'PayPal' && (
              <div className="bg-[#fbf5f1] border border-[#e8cdc1]/35 rounded-xl p-5 mb-8 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-600 text-2xl">info</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#4a372e]">PayPal Redirection Sandbox</h4>
                    <p className="text-[10px] text-[#8b7368] mt-0.5">Upon clicking Proceed to Checkout, you will be securely redirected to the PayPal sandbox checkout page to finalize your purchase.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Summary details */}
            <div className="bg-[#fbf5f1] border border-[#e8cdc1]/30 rounded-xl p-4 flex items-center justify-between mb-8 text-xs text-[#5a4740]">
              <div className="text-left">
                <span className="font-semibold text-[#8b7368] block">Method Selected:</span>
                <span className="font-bold text-[#4a372e] text-sm">{paymentMethod}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-[#8b7368] block">Amount to Pay:</span>
                <span className="font-bold text-[#856758] text-base">{formatPrice(getTotal())}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(4)}
                className="py-3 px-5 bg-white border border-[#856758]/30 hover:bg-[#e8cdc1]/10 text-[#856758] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Back to Details
              </button>
              <button 
                onClick={handleSelectPaymentMethod}
                style={{
                  backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                }}
                className="flex-grow text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-lg border border-white/20 cursor-pointer shadow-md hover:scale-[1.01]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/* -------------------- STEP 6: PAYMENT SCREEN -------------------- */}
        {step === 6 && orderInfo && (
          <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-2xl p-6 md:p-10 max-w-xl mx-auto text-center animate-in fade-in duration-300">
            
            {/* Payment Header */}
            <div className="space-y-2 mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-widest border border-amber-200 animate-pulse">
                Awaiting Payment
              </span>
              <h2 className="font-display-lg text-2xl text-[#4a372e] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Complete Your Payment
              </h2>
              <p className="text-[#8b7368] text-xs">Please follow the instructions below to complete your transaction.</p>
            </div>

            {/* Timer Countdown */}
            <div className="mb-6 bg-red-50/60 border border-red-200/40 rounded-xl py-3 px-6 max-w-xs mx-auto flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-red-500 text-lg animate-spin" style={{ animationDuration: '3s' }}>
                schedule
              </span>
              <div className="text-left">
                <span className="text-[9px] font-bold uppercase text-red-400 block tracking-wider">Payment Timer</span>
                <span className="text-lg font-mono font-bold text-red-600">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Instructions specific to payment method */}
            <div className="bg-[#fcfaf9] border border-[#e8cdc1]/20 rounded-xl p-6 mb-6 text-xs text-[#5a4740] space-y-4">
              <h4 className="font-bold text-[#4a372e] uppercase tracking-wider text-center border-b border-[#e8cdc1]/20 pb-2">
                {paymentMethod} Instructions
              </h4>

              {(orderInfo.qrCodeUrl || ['QRIS', 'GoPay', 'DANA', 'ShopeePay', 'OVO'].some(m => paymentMethod.includes(m))) ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-[#8b7368] text-center leading-relaxed">
                    Scan the QR code below using GoPay, OVO, ShopeePay, DANA, LinkAja, or your mobile banking app.
                  </p>
                  <div className="p-4 bg-white rounded-xl border border-[#dfa38f]/30 shadow-md">
                    {orderInfo.qrCodeUrl ? (
                      <img 
                        src={orderInfo.qrCodeUrl} 
                        alt="Midtrans QRIS QR Code" 
                        className="w-44 h-44 object-contain"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-[#1d1b1a] relative flex items-center justify-center p-2 rounded-lg">
                        <div className="absolute top-2 left-2 w-10 h-10 border-t-4 border-l-4 border-white" />
                        <div className="absolute top-2 right-2 w-10 h-10 border-t-4 border-r-4 border-white" />
                        <div className="absolute bottom-2 left-2 w-10 h-10 border-b-4 border-l-4 border-white" />
                        <div className="absolute bottom-2 right-2 w-10 h-10 border-b-4 border-r-4 border-white" />
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-[8px] text-[#4a372e] tracking-widest uppercase select-none">
                          PHANILIE
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-[#8b7368]">QR ID: {orderInfo.orderId}</span>
                </div>
              ) : (paymentMethod.toLowerCase().includes('va') || paymentMethod.toLowerCase().includes('virtual') || orderInfo.vaNumber) ? (
                <div className="space-y-3">
                  <p className="text-[#8b7368] text-center leading-relaxed">
                    Transfer to the Virtual Account number below from your mobile banking app or ATM.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-[#e8cdc1]/40 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[9px] text-[#8b7368] block">VA Bank Target:</span>
                      <span className="font-bold text-[#4a372e]">{orderInfo.bankName || 'Virtual Account'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#8b7368] block">VA Account Number:</span>
                      <span className="font-mono font-bold text-sm text-[#856758]">{orderInfo.vaNumber || '8830129840284920'}</span>
                    </div>
                  </div>
                </div>
              ) : (paymentMethod === 'PayPal' || orderInfo.redirectUrl) ? (
                <div className="flex flex-col items-center gap-3.5 py-2">
                  <p className="text-[#8b7368] text-center leading-relaxed">
                    Click the button below to complete your checkout using PayPal's secure checkout page.
                  </p>
                  <a
                    href={orderInfo.redirectUrl || 'https://www.sandbox.paypal.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-6 bg-[#0079c1] hover:bg-[#00457c] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 border-none no-underline shadow-md"
                  >
                    <span className="material-symbols-outlined text-sm">payments</span>
                    Pay with PayPal
                  </a>
                </div>
              ) : (
                <p className="text-[#8b7368] text-center leading-relaxed">
                  Transfer exact amount to target account or click simulated pay button. Target billing partner: <span className="font-bold text-[#4a372e]">{paymentMethod}</span>.
                </p>
              )}

              <div className="h-px bg-[#e8cdc1]/20 my-4" />

              {/* Amount detail */}
              <div className="flex justify-between items-center text-xs border-b border-dashed border-[#e8cdc1]/20 pb-2">
                <span className="text-[#8b7368]">Billing Order ID</span>
                <span className="font-bold font-mono text-[#4a372e]">{orderInfo.orderId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8b7368]">Total Amount Due</span>
                <span className="font-bold text-[#856758] text-sm">{formatPrice(orderInfo.total)}</span>
              </div>
            </div>

            {/* Simulating actions */}
            <div className="space-y-3">
              {paymentStatus === 'verifying' ? (
                <div className="py-3 px-6 bg-[#dfa38f]/10 rounded-xl flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-xl text-[#dfa38f] animate-spin">
                    progress_activity
                  </span>
                  <span className="text-xs font-bold text-[#856758]">Verifying your transaction, please wait...</span>
                </div>
              ) : (
                <button
                  onClick={simulatePaymentSuccess}
                  style={{
                    backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                  }}
                  className="w-full text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-lg border border-white/20 cursor-pointer shadow-md hover:scale-[1.01]"
                >
                  Simulate Payment Success (Demo)
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel the checkout?')) {
                    setStep(2);
                  }
                }}
                className="w-full py-2 bg-transparent text-red-500 hover:bg-red-50 font-bold text-xs rounded-lg transition-colors border-none cursor-pointer"
              >
                Cancel Payment / Back to Cart
              </button>
            </div>
          </div>
        )}

        {/* -------------------- STEP 7: PAYMENT SUCCESSFUL -------------------- */}
        {step === 7 && orderInfo && (
          <div className="bg-white border border-[#dfa38f]/25 shadow-xl rounded-2xl p-6 md:p-10 max-w-xl mx-auto text-center animate-in scale-in duration-300">
            {/* Custom Checkmark Animation */}
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
              <span className="material-symbols-outlined text-3xl select-none" style={{ fontVariationSettings: "'wght' 700" }}>
                check
              </span>
            </div>

            <div className="space-y-1.5 mb-6">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">✓ PURCHASE COMPLETE</span>
              <h2 className="font-display-lg text-2xl text-[#4a372e] font-extrabold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Thank you for your purchase!
              </h2>
              <p className="text-[#8b7368] text-xs font-medium">Your sheet music is ready to download.</p>
            </div>

            {/* Purchased Items Download Cards */}
            <div className="space-y-3.5 mb-8 text-left">
              {orderInfo.items.map((item, idx) => (
                <div key={idx} className="bg-[#fcfaf9] border border-[#e8cdc1]/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }} className="font-bold text-sm md:text-base text-[#4a2c20] tracking-tight">{item.sheet.title}</h3>
                    <p className="text-[11px] text-[#856758] font-semibold mt-0.5">Advanced Gospel Arrangement • PDF Format</p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(item.sheet.title, 'PDF')}
                    style={{
                      backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                    }}
                    className="w-full sm:w-auto text-white text-xs font-extrabold py-2.5 px-4 rounded-lg border border-white/20 cursor-pointer shadow-sm hover:scale-[1.02] flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-base select-none">download</span>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>

            {/* Receipt Summary Metadata */}
            <div className="bg-[#fcfaf9] border border-[#e8cdc1]/30 rounded-xl p-4 mb-6 text-xs text-left space-y-2 text-[#5a4740]">
              <div className="flex justify-between">
                <span className="text-[#8b7368]">Order Number</span>
                <span className="font-mono font-bold text-[#4a372e]">{orderInfo.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b7368]">Invoice Number</span>
                <span className="font-mono font-bold text-[#4a372e]">{orderInfo.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b7368]">Purchase Date</span>
                <span className="font-bold text-[#4a372e]">{orderInfo.purchaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b7368]">Total Paid</span>
                <span className="font-extrabold text-[#856758]">{formatPrice(orderInfo.total)}</span>
              </div>
            </div>

            {/* Navigation actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (clearBuyNowSheet) clearBuyNowSheet();
                  onNavigate('sheets');
                }}
                className="flex-grow py-3 px-6 bg-white hover:bg-[#fbf3ef] text-[#856758] border-2 border-[#dfa38f]/60 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => setStep(8)}
                className="py-3 px-5 bg-transparent hover:bg-[#e8cdc1]/10 text-[#856758] font-bold text-xs rounded-xl transition-colors cursor-pointer border border-[#856758]/30"
              >
                Go to My Library
              </button>
              <button
                onClick={() => {
                  setInvoiceOrder(orderInfo);
                  setStep(10);
                }}
                className="py-3 px-4 bg-transparent hover:underline text-[#8b7368] font-bold text-xs border-none cursor-pointer"
              >
                View Invoice
              </button>
            </div>
          </div>
        )}

        {/* -------------------- STEP 8: MY LIBRARY -------------------- */}
        {step === 8 && (
          <div className="bg-white/80 backdrop-blur-md border border-[#dfa38f]/25 shadow-xl rounded-2xl p-6 md:p-10 flex flex-col gap-8 animate-in fade-in duration-300">
            
            {/* Library Header */}
            <div 
              className="relative overflow-hidden rounded-xl p-6 md:p-8 border border-[#e8cdc1]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(255, 248, 246, 0.94) 0%, rgba(255, 248, 246, 0.82) 100%), url('/library-sheet3.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-[#dfa38f]/20 text-[#856758] text-[9px] font-extrabold uppercase tracking-widest border border-[#dfa38f]/30 mb-2">
                  Personal Collection
                </span>
                <h1 className="font-display-lg text-2xl md:text-3xl text-[#4a372e] font-bold tracking-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  My Sheet Music Library
                </h1>
                <p className="text-[#8b7368] text-xs font-semibold">Access and download your note-for-note piano transcripts.</p>
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl border border-[#e8cdc1]/40 shadow-xs flex items-center gap-2 text-xs font-bold text-[#856758]">
                  <span className="material-symbols-outlined text-base">library_music</span>
                  <span>{getLibrarySheets().length} Sheet{getLibrarySheets().length !== 1 ? 's' : ''} Owned</span>
                </div>
              </div>
            </div>

            {/* Library Grid */}
            {getLibrarySheets().length === 0 ? (
              <div className="text-center py-20 bg-white/50 border border-dashed border-[#e8cdc1]/30 rounded-xl">
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
                    className="group bg-white/80 border border-[#e8cdc1]/20 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
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
                          } catch (e) {}
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
                      <div className="border-t border-dashed border-[#e8cdc1]/30 pt-3.5 mt-auto">
                        <button 
                          onClick={() => handleDownloadFile(sheet.title, 'PDF')}
                          style={{
                            backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                          }}
                          className="w-full py-2.5 text-white font-bold text-[10px] rounded-xl border border-white/20 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
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
                        orderId: 'PH-100293',
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
                <div className="font-display-lg text-lg font-bold bg-gradient-to-r from-[#805c51] to-[#ab7e66] bg-clip-text text-transparent">
                  Phanilie Music Receipt
                </div>
                <div className="h-[2px] bg-[#dfa38f] w-16 mt-0.5 rounded" />
                <span className="text-[10px] text-[#8b7368] block mt-1.5">Premium Piano Transcriptions</span>
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
                    backgroundImage: "linear-gradient(135deg, #dfa38f 0%, #ab7e66 50%, #856758 100%)",
                  }}
                  className="text-white text-xs font-bold uppercase tracking-widest py-2.5 px-5 rounded-lg border border-white/20 cursor-pointer shadow-md hover:scale-[1.01] flex items-center gap-1.5"
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
      <style dangerouslySetInnerHTML={{__html: `
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
