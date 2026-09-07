import { useState } from 'react'

function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="w-full flex-grow relative overflow-hidden bg-gradient-to-br from-[#a38777] via-[#94786d] to-[#c4a296] py-24 px-6 animate-in fade-in duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes faqSparkle1 {
          0% { transform: translate(0, 15px) scale(0.3) rotate(0deg); opacity: 0; }
          35% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 8px #ffd89b); }
          75% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 8px #ffd89b); }
          100% { transform: translate(10px, -45px) scale(0.85) rotate(90deg); opacity: 0; }
        }
        @keyframes faqSparkle2 {
          0% { transform: translate(0, 8px) scale(0.2) rotate(0deg); opacity: 0; }
          50% { opacity: 1; filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 9px #ffffff); }
          100% { transform: translate(-15px, -55px) scale(0.95) rotate(-120deg); opacity: 0; }
        }
        @keyframes faqSparkle3 {
          0% { transform: translate(0, 12px) scale(0.25) rotate(0deg); opacity: 0; }
          30% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 7px #ffd89b); }
          80% { opacity: 1; filter: drop-shadow(0 0 3px #ffd89b) drop-shadow(0 0 7px #ffd89b); }
          100% { transform: translate(20px, -50px) scale(0.9) rotate(140deg); opacity: 0; }
        }
      `}} />

      {/* Background Piano Grand Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none select-none opacity-[0.16]"
        style={{
          backgroundImage: "url('/pianogrand.jpg')",
        }}
      />

      {/* Floating Sparkle Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '8%', left: '4%', width: '10px', height: '10px', animation: 'faqSparkle1 5s infinite ease-in-out' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-white fill-current" style={{ top: '12%', left: '94%', width: '8px', height: '8px', animation: 'faqSparkle2 4s infinite ease-in-out', animationDelay: '1.2s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '22%', left: '10%', width: '12px', height: '12px', animation: 'faqSparkle3 6s infinite ease-in-out', animationDelay: '0.5s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-white fill-current" style={{ top: '30%', left: '90%', width: '9px', height: '9px', animation: 'faqSparkle1 5.5s infinite ease-in-out', animationDelay: '2s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '42%', left: '3%', width: '11px', height: '11px', animation: 'faqSparkle2 4.8s infinite ease-in-out', animationDelay: '1s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-white fill-current" style={{ top: '50%', left: '95%', width: '8px', height: '8px', animation: 'faqSparkle3 5.2s infinite ease-in-out', animationDelay: '2.5s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '65%', left: '12%', width: '10px', height: '10px', animation: 'faqSparkle1 6.2s infinite ease-in-out', animationDelay: '0.2s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-white fill-current" style={{ top: '70%', left: '88%', width: '12px', height: '12px', animation: 'faqSparkle2 5s infinite ease-in-out', animationDelay: '1.8s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-[#ffd89b] fill-current" style={{ top: '80%', left: '6%', width: '8px', height: '8px', animation: 'faqSparkle3 4.5s infinite ease-in-out', animationDelay: '3s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        <svg className="absolute text-white fill-current" style={{ top: '88%', left: '92%', width: '11px', height: '11px', animation: 'faqSparkle1 5.8s infinite ease-in-out', animationDelay: '0.7s' }} viewBox="0 0 24 24">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 
            className="font-display-lg text-3xl md:text-4xl text-white font-bold leading-tight tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-[#ffebe6] font-sans text-xs font-bold uppercase tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
            Click each number to understand everything about the membership
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Column 1 */}
          <div className="space-y-4">
            {[
              {
                idx: 0,
                question: "Why choose this membership over free tutorials on YouTube?",
                answer: "While YouTube has plenty of quick tutorials, it lacks a structured path. Free videos often leave you guessing what to practice next, leading to bad habits or gaps in your playing. This platform provides a step-by-step, organized curriculum that guarantees steady progress without the confusion.",
              },
              {
                idx: 2,
                question: "Are the video lessons available for download?",
                answer: "No, the video lessons are streaming-only and require an internet connection to watch. This allows us to constantly update our library and ensure you always have access to the highest-quality video playback on any device.",
              },
              {
                idx: 4,
                question: "How easy is it to cancel my subscription?",
                answer: "Very easy. You have complete control over your subscription and can cancel at any time directly from your account settings with just a few clicks. There are no hidden fees, contracts, or cancellation penalties.",
              },
              {
                idx: 6,
                question: "Am I allowed to keep the downloaded PDF resources forever?",
                answer: "Yes! Any sheet music, chord charts, or practice worksheets you download during your active membership period are yours to keep and use offline forever.",
              },
              {
                idx: 8,
                question: "Are private, 1-on-1 coaching sessions included?",
                answer: "If private 1-on-1 lessons are preferred, please reach out to the support team for upgrade options.",
              },
            ].map((item) => (
              <div
                key={item.idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-lg ${
                  openFaq === item.idx
                    ? "border-[#cda195] shadow-[0_12px_30px_rgba(0,0,0,0.15)] bg-black/50"
                    : "border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-black/20 hover:bg-black/30 hover:border-white/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === item.idx ? null : item.idx)}
                  className="w-full py-4.5 px-5 flex items-center justify-between gap-4 cursor-pointer text-left bg-transparent border-none focus:outline-none"
                >
                  <span
                    className={`font-sans text-[13px] md:text-sm font-bold transition-colors duration-200 ${
                      openFaq === item.idx ? "text-[#ffdcd3]" : "text-white"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-white/70 text-lg transition-transform duration-300 select-none ${
                      openFaq === item.idx ? "rotate-180 text-[#cda195]" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{
                    gridTemplateRows: openFaq === item.idx ? "1fr" : "0fr",
                    opacity: openFaq === item.idx ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-white/10 py-4 px-5 bg-black/10">
                      <p className="font-sans text-[12.5px] text-[#f5e1d8] leading-relaxed font-semibold">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            {[
              {
                idx: 1,
                question: "Is it possible to buy a single course instead of a membership?",
                answer: "Our courses are designed to work together as a complete learning ecosystem, which is why we offer them exclusively through our all-access membership. This gives you the freedom to move between foundations, skills, and various styles at your own pace without paying for individual packages.",
              },
              {
                idx: 3,
                question: "What is the core learning approach of Stephanie Keys?",
                answer: "Stephanie Keys bridges the gap between structured music theory and creative expression. We guide you through essential keyboard foundations first, immediately showing you how to turn those concepts into practical improvisation, and applying them across a rich variety of gospel and jazz at your own comfortable pace.",
              },
              {
                idx: 5,
                question: "Do you provide a lifetime access option?",
                answer: "We currently focus on monthly, 3 months, and annual membership plans to ensure we can continually support our community, host live events, and release fresh course content for our active members.",
              },
              {
                idx: 7,
                question: "What happens when my free trial period finishes?",
                answer: "Once your trial ends, your selected membership plan (monthly or annual) will automatically begin using the payment method you provided. If you choose to cancel before the trial period is up, you will not be charged a single cent.",
              },
              {
                idx: 9,
                question: "Will I lose access to the platform immediately after canceling?",
                answer: "No, you will retain full access to all courses, live sessions, and downloadable resources until the final day of your current billing cycle. After that date, your account will simply pause, and you won't be billed again.",
              },
            ].map((item) => (
              <div
                key={item.idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-lg ${
                  openFaq === item.idx
                    ? "border-[#cda195] shadow-[0_12px_30px_rgba(0,0,0,0.15)] bg-black/50"
                    : "border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-black/20 hover:bg-black/30 hover:border-white/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === item.idx ? null : item.idx)}
                  className="w-full py-4.5 px-5 flex items-center justify-between gap-4 cursor-pointer text-left bg-transparent border-none focus:outline-none"
                >
                  <span
                    className={`font-sans text-[13px] md:text-sm font-bold transition-colors duration-200 ${
                      openFaq === item.idx ? "text-[#ffdcd3]" : "text-white"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-white/70 text-lg transition-transform duration-300 select-none ${
                      openFaq === item.idx ? "rotate-180 text-[#cda195]" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{
                    gridTemplateRows: openFaq === item.idx ? "1fr" : "0fr",
                    opacity: openFaq === item.idx ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-white/10 py-4 px-5 bg-black/10">
                      <p className="font-sans text-[12.5px] text-[#f5e1d8] leading-relaxed font-semibold">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default FAQ;
