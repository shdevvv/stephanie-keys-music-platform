import { useEffect } from 'react'

function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94634c]">
            Last Updated: September 2026
          </p>
        </header>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            1. Introduction & Overview
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            Welcome to Stephanie Keys. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, enroll in our courses, purchase sheet music, or participate in our live sessions and community forums.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            2. Information We Collect
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            To provide our premium piano and music education services, we collect the following types of information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <li>
              <strong className="text-[#6b3b24] font-semibold">Account & Profile Data:</strong> Name, email address (<a href="mailto:stephanie.halim06@gmail.com" className="font-semibold text-[#6b3b24] hover:underline">stephanie.halim06@gmail.com</a>), password, and profile preferences when you register or subscribe.
            </li>
            <li>
              <strong className="text-[#6b3b24] font-semibold">Billing & Transaction Information:</strong> Payment status, active subscription plan details (Monthly or Annual), and purchase history from the Sheet Music Shop. (Note: Financial transactions are processed securely via third-party payment gateways; we do not store full credit card numbers on our servers).
            </li>
            <li>
              <strong className="text-[#6b3b24] font-semibold">Learning & Practice Progress:</strong> Completed lesson tracking, unlocked level badges, certificates earned, weekly practice intensity metrics, and sheet music download logs.
            </li>
            <li>
              <strong className="text-[#6b3b24] font-semibold">Community & Live Session Data:</strong> Interactions, messages, or comments posted in the Community Forum, as well as attendance during live Zoom coaching sessions.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            3. How We Use Your Information
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            We use the collected information to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <li>Deliver and manage your active membership access, course roadmap, and sheet music library.</li>
            <li>Personalize your dashboard, track lesson progress, and award level badges/certificates.</li>
            <li>Host interactive live coaching sessions and provide access to past video replays.</li>
            <li>Send essential account notifications, billing updates, and weekly Piano Tips newsletter updates (if subscribed).</li>
            <li>Prevent fraudulent access and maintain platform security.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            4. Third-Party Services & Integrations
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            We partner with trusted third-party service providers to power our platform features:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <li><strong className="text-[#6b3b24] font-semibold">Zoom:</strong> Used to host monthly Live Studio coaching sessions.</li>
            <li><strong className="text-[#6b3b24] font-semibold">Google Drive:</strong> Used for storing and providing access to past live session video replays.</li>
            <li><strong className="text-[#6b3b24] font-semibold">Payment Processors:</strong> Used to process subscription and shop transactions securely.</li>
            <li><strong className="text-[#6b3b24] font-semibold">Analytics & Cloud Hosting:</strong> Used to maintain site performance, uptime, and database management.</li>
          </ul>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal pt-1">
            These providers only have access to the information necessary to perform their specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            5. Data Retention & Security
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            We retain your personal information only for as long as your account remains active or as needed to fulfill our educational services and legal obligations. We implement appropriate technical and organizational security measures to protect your data against unauthorized access, loss, or alteration.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            6. Your Rights & Choices
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            You have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            <li>Access, update, or correct your personal account details at any time via your Account Settings.</li>
            <li>Request the deletion of your account and associated personal data.</li>
            <li>Unsubscribe from Piano Tips newsletter communications at any time by clicking the unsubscribe link in our emails or updating your preferences.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b] border-b border-[#c8a08d]/50 pb-1">
            7. Changes to This Policy
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            We may update this Privacy Policy from time to time to reflect changes in our services or legal requirements. The latest version will always be available on our website with the updated &quot;Last Updated&quot; date.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2 pt-3 border-t border-[#c8a08d]/60">
          <h2 className="font-display-lg text-base sm:text-lg font-bold text-[#70422b]">
            8. Contact Us
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b] text-justify font-normal">
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-[#85523b]">
            Email: <a href="mailto:stephanie.halim06@gmail.com" className="font-semibold text-[#6b3b24] hover:underline">stephanie.halim06@gmail.com</a>
          </p>
        </section>

      </main>
    </div>
  )
}

export default PrivacyPolicy
