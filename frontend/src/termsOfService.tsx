import { useEffect } from 'react'

function TermsOfService() {
  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-transparent font-sans overflow-hidden py-4 sm:py-6">
      {/* Background Image Layer with exactly 50% Opacity */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none z-0"
        style={{ backgroundImage: "url('/legal-bg.jpg')", opacity: 0.5 }}
      />

      {/* Main Content Area - Wide layout, Medium Brown text, Justified alignment */}
      <main className="relative z-10 max-w-[1400px] w-full mx-auto py-12 px-4 sm:px-10 lg:px-16 space-y-8 text-[#85523b] selection:bg-[#f9ece6] selection:text-[#5a3a2e]">
        
        {/* Header Title Section */}
        <header className="border-b border-[#c8a08d]/60 pb-5 space-y-1.5">
          <h1 className="font-display-lg text-2xl sm:text-3xl lg:text-4xl font-bold text-[#70422b] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94634c]">
            Last Updated: September 2026
          </p>
        </header>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            1. Agreement to Terms
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            By accessing or using the Stephanie Keys platform, website, courses, sheet music shop, or community features, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from accessing or using our services.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            2. Intellectual Property Rights
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            All educational content, video lessons, downloadable sheet music (PDFs/MIDIs), practice guides, drum tracks, reharmonization charts, live session replays, and custom branding materials on Stephanie Keys are owned by or licensed to Stephanie Keys.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            You are granted a limited, non-exclusive, non-transferable, personal license to access video lessons, download purchased sheet music, and use course materials for personal, non-commercial educational study only. You are strictly prohibited from:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <li>Reselling, redistribution, sublicensing, or sharing any digital downloads or video content.</li>
            <li>Publicly performing or uploading recorded course materials to third-party platforms.</li>
            <li>Sharing account access or credentials with other individuals.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            3. Subscriptions, Pricing & Free Trial
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <strong className="text-[#6b3b24] font-semibold">Free Trial:</strong> New members accessing membership plans (Monthly or Annual) are eligible for a 14-Day Free Trial. Unless canceled before the 14-day trial period expires, your account will automatically convert into a paid subscription billed according to your selected plan ($18.99/month for Monthly Plan or $169.99/year for Annual Plan).
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <strong className="text-[#6b3b24] font-semibold">Automatic Renewal:</strong> Subscriptions automatically renew at the end of each billing cycle unless canceled prior to the renewal date.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <strong className="text-[#6b3b24] font-semibold">Cancellation:</strong> You may cancel your subscription at any time with 1-click via your Account Settings. Upon cancellation, your subscription will remain active until the end of your current paid billing cycle, and you will not be charged for the subsequent cycle.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            4. Sheet Music Shop & Digital Product Refunds
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            Due to the instant-access nature of downloadable digital assets (Sheet Music, PDFs, MIDI files, and online course access):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <li>All one-time purchases made via the Sheet Music Shop are final and non-refundable.</li>
            <li>Subscription fees and partial billing cycles are non-refundable once billed.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            5. Live Coaching, Zoom & Community Guidelines
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <strong className="text-[#6b3b24] font-semibold">Live Studio & Zoom Sessions:</strong> Members gain access to interactive live coaching sessions. By joining these Zoom sessions, you agree to engage respectfully with instructors and fellow students. Live sessions may be recorded and stored on secure cloud storage (e.g., Google Drive) for past video replays within the platform.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <strong className="text-[#6b3b24] font-semibold">Community Forum:</strong> You agree not to post spam, promotional content, offensive material, or copyrighted content owned by third parties within the community forum. Stephanie Keys reserves the right to remove any content or terminate accounts that violate community standards.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            6. User Account Security
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. We reserve the right to suspend or terminate accounts without prior notice if we detect account sharing, unauthorized distribution of sheet music, or any violation of these Terms.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            7. Limitation of Liability & Disclaimers
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            The platform, courses, and digital materials are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. Stephanie Keys is not liable for technical interruptions, third-party service outages (including Zoom, Google Drive, or payment gateways), or system incompatibilities.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            8. Changes to Terms
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            We reserve the right to update or modify these Terms of Service at any time. Updates will be reflected by the &quot;Last Updated&quot; date at the top of this page. Your continued use of Stephanie Keys after revisions are posted constitutes acceptance of the updated terms.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2 pt-3 border-t border-[#c8a08d]/60">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b]">
            9. Contact Us
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            For any legal inquiries, support, or billing questions, please contact us at:
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b]">
            Email: <a href="mailto:stephanie.halim06@gmail.com" className="font-semibold text-[#6b3b24] hover:underline">stephanie.halim06@gmail.com</a>
          </p>
        </section>

      </main>
    </div>
  )
}

export default TermsOfService
