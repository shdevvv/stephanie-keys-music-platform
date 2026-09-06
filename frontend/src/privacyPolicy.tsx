import { useEffect } from 'react'

function PrivacyPolicy() {
  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <main className="pt-8 pb-24 px-6 max-w-[900px] mx-auto w-full flex-grow space-y-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 py-8">
        <span className="inline-block px-3 py-1 rounded-full bg-[#e8cdc1]/20 text-[#6e5a51] text-xs font-semibold uppercase tracking-wider">
          Legal Documents
        </span>
        <h1 className="font-display-lg text-display-lg text-[#6e5a51] font-bold">Privacy Policy</h1>
        <p className="text-[#81756f] text-xs uppercase tracking-widest">
          Last Updated: June 2026
        </p>
      </div>

      {/* Policy Content */}
      <div className="glossy-thick-rose-gold-gradient-border rounded-[16px] p-8 md:p-10 space-y-8 text-[#4f4540] text-sm md:text-base leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            1. Introduction & Overview
          </h2>
          <p>
            Welcome to Stephanie Keys. We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
            our web application, purchase sheet music, enroll in courses, or connect with our local API Gateway.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            2. Information We Collect
          </h2>
          <p>
            To provide our premium gospel and jazz piano education services, we may collect the following types of information:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm">
            <li>
              <strong>Account Data:</strong> Information provided during registration, sign-in, or profile configuration, including email address and billing status.
            </li>
            <li>
              <strong>Educational Progress:</strong> Course enrollment details, cover library purchases, sheets download history, and practice checklist records.
            </li>
            <li>
              <strong>Technical Integrations:</strong> Database connection parameters configured in the Dashboard to synchronize practice metadata with your local C# API Gateway.
            </li>
            <li>
              <strong>Communication Data:</strong> Name, email, and message contents submitted securely through our Contact form to maintain administrative records without exposing backend email details.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            3. How We Use Your Information
          </h2>
          <p>
            We use the collected information to maintain our service standard, including:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm">
            <li>Delivering, managing, and updating our piano courses and sheet music downloads.</li>
            <li>Enabling secure user login state synchronization across browser tabs and active sessions.</li>
            <li>Delivering weekly practical piano tips and newsletter updates directly to your inbox.</li>
            <li>Providing security controls, preventing fraud, and resolving API synchronization issues.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            4. Data Retention & Secure Integrations
          </h2>
          <p>
            We retain your data only for as long as necessary to fulfill the purposes detailed in this policy. All local practice data 
            relied upon by the C# backend remains stored on your system. We do not transmit your local SQL or gateway database contents 
            to external host servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            5. Your Rights & Choices
          </h2>
          <p>
            You have the right to access, correct, or request deletion of your account details at any time. You can opt out of weekly 
            newsletter deliveries by adjusting your subscription preferences or contacting our admin desk via the secure contact card.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#6e5a51] font-display-lg border-b border-[#e8cdc1]/20 pb-2">
            6. Contacting Us
          </h2>
          <p>
            For any inquiries regarding this policy, please open our secure Contact popup form from the Legal & Support column in the 
            footer. Your message will be securely routed directly to our admin staff.
          </p>
        </section>

      </div>

    </main>
  )
}

export default PrivacyPolicy
