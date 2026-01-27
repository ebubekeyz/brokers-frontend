// src/pages/TermsAndConditions.tsx
import React, { useMemo } from "react";

type TermsProps = {
  onAccept?: () => void;
  onDecline?: () => void;
  companyName?: string; // defaults to "Barick Gold"
  lastUpdated?: string; // e.g. "2025-08-01"
};

const Terms: React.FC<TermsProps> = ({
  onAccept,
  onDecline,
  companyName = "Barick Gold",
  lastUpdated = new Date().toISOString().slice(0, 10),
}) => {
  const sections = useMemo(
    () => [
      {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        body: (
          <>
            By creating an account, accessing, or using {companyName}’s products,
            services, websites, mobile apps, APIs, and related tools (collectively,
            the “Services”), you agree to these Terms & Conditions (“Terms”).
            If you do not agree, do not use the Services.
          </>
        ),
      },
      {
        id: "eligibility",
        title: "2. Eligibility & Account Registration",
        body: (
          <>
            You must be at least 18 years old (or the age of majority in your
            jurisdiction) and legally permitted to use the Services. You agree to
            provide accurate information and keep it current. You are responsible
            for maintaining the confidentiality of your credentials and for all
            activity on your account.
          </>
        ),
      },
      {
        id: "kyc-aml",
        title: "3. KYC/AML Compliance",
        body: (
          <>
            {companyName} may require identity verification (KYC) and apply
            anti-money-laundering and sanctions screening (AML/CFT). We may
            request additional documentation, place limits, or suspend access
            to comply with applicable laws and regulatory obligations.
          </>
        ),
      },
      {
        id: "risk",
        title: "4. Risk Disclosure (Crypto & Gold)",
        body: (
          <>
            Trading and investing in digital assets and precious metals involves
            substantial risk, including market volatility, liquidity constraints,
            and potential loss of principal. Past performance is not indicative
            of future results. You acknowledge that you are solely responsible
            for your decisions and that {companyName} does not guarantee profits
            or the future value of any asset.
          </>
        ),
      },
      {
        id: "no-advice",
        title: "5. No Investment or Tax Advice",
        body: (
          <>
            Information, market insights, research, prices, and analytics provided
            via the Services are strictly educational/informational and do not
            constitute investment, legal, accounting, or tax advice. Consult your
            professional advisors before making decisions.
          </>
        ),
      },
      {
        id: "trading-execution",
        title: "6. Orders, Pricing & Execution",
        body: (
          <>
            Orders (market, limit, stop, etc.) are executed on a best-efforts
            basis and may be delayed, rejected, partially filled, or repriced due
            to market conditions, system availability, slippage, spreads, or
            third-party venues. Displayed prices are indicative until execution.
          </>
        ),
      },
      {
        id: "custody",
        title: "7. Custody & Storage",
        body: (
          <>
            Digital assets may be held in hot, warm, or cold wallets, with a mix
            of omnibus and segregated arrangements through {companyName} and/or
            qualified custodians. Physical gold may be vaulted with accredited
            storage providers. While we apply industry-standard security,
            no system is invulnerable and you accept residual risk.
          </>
        ),
      },
      {
        id: "deposits-withdrawals",
        title: "8. Deposits, Withdrawals & Settlement",
        body: (
          <>
            Funding and withdrawals (fiat, crypto, or metal) may be subject to
            network fees, bank fees, withdrawal windows, compliance checks,
            blockchain congestion, and vaulting/transport schedules. Settlement
            timelines are estimates only.
          </>
        ),
      },
      {
        id: "fees",
        title: "9. Fees",
        body: (
          <>
            You agree to pay all applicable fees, including trading spreads,
            commissions, custody/vaulting fees, storage, network, and withdrawal
            fees. Fees may change; the then-current schedule on our website
            applies when you place or hold positions.
          </>
        ),
      },
      {
        id: "security-2fa",
        title: "10. Security & Two-Factor Authentication",
        body: (
          <>
            You are responsible for enabling and maintaining 2FA and for securing
            devices, keys, and recovery codes. Report suspected compromise
            immediately. {companyName} is not liable for losses arising from
            compromised credentials or devices under your control.
          </>
        ),
      },
      {
        id: "market-data",
        title: "11. Market Data & Third-Party Content",
        body: (
          <>
            Quotes, charts, news, and analytics may be delayed, incomplete, or
            provided by third parties on an “as-is” basis without warranties.
            {companyName} is not responsible for errors, delays, or interruptions.
          </>
        ),
      },
      {
        id: "tax",
        title: "12. Taxes",
        body: (
          <>
            You are solely responsible for determining and paying any taxes
            arising from your use of the Services. We may provide records, but we
            do not offer tax advice.
          </>
        ),
      },
      {
        id: "prohibited",
        title: "13. Prohibited Activities",
        body: (
          <>
            You agree not to engage in fraud, market manipulation, wash trading,
            sanctions evasion, money laundering, hacking, scraping, reverse
            engineering, or any unlawful activity. We may investigate, freeze,
            or close accounts to comply with law or protect the platform.
          </>
        ),
      },
      {
        id: "ip",
        title: "14. Intellectual Property",
        body: (
          <>
            The Services, including logos, trademarks, designs, software, and
            content, are owned by {companyName} or our licensors and protected by
            IP laws. You receive a limited, revocable, non-transferable license
            to access and use the Services for personal, lawful purposes.
          </>
        ),
      },
      {
        id: "termination",
        title: "15. Suspension & Termination",
        body: (
          <>
            We may suspend or terminate access, freeze assets, or cancel orders
            for suspected violations, risk, or legal requirements. You may close
            your account, subject to settling all obligations and fees.
          </>
        ),
      },
      {
        id: "liability",
        title: "16. Disclaimer & Limitation of Liability",
        body: (
          <>
            THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT
            WARRANTIES. TO THE MAXIMUM EXTENT PERMITTED BY LAW, {companyName} AND
            ITS AFFILIATES ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR
            CONSEQUENTIAL DAMAGES, LOST PROFITS, DATA, OR GOODWILL.
          </>
        ),
      },
      {
        id: "arbitration",
        title: "17. Dispute Resolution & Arbitration",
        body: (
          <>
            You agree to resolve disputes through binding arbitration on an
            individual basis (no class actions). You and {companyName} waive
            the right to a jury trial, to the extent permitted by law. Some
            jurisdictions may provide non-waivable rights.
          </>
        ),
      },
      {
        id: "law",
        title: "18. Governing Law & Venue",
        body: (
          <>
            These Terms are governed by the laws applicable at {companyName}’s
            principal place of business, without regard to conflicts-of-law
            rules. Subject to the arbitration clause, exclusive venue lies in
            those courts.
          </>
        ),
      },
      {
        id: "changes",
        title: "19. Changes to the Terms",
        body: (
          <>
            We may update these Terms at any time by posting a revised version.
            Changes are effective upon posting unless otherwise stated. Your
            continued use of the Services after changes constitutes acceptance.
          </>
        ),
      },
      {
        id: "contact",
        title: "20. Contact",
        body: (
          <>
            Questions about these Terms? Contact our support team at
            <span className="mx-1 underline">support@barickgold.example</span>.
          </>
        ),
      },
    ],
    [companyName]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
        {/* Sidebar TOC */}
        <aside className="lg:sticky lg:top-8 h-max bg-gray-800/60 border border-gray-700 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">On this page</h2>
          <nav className="space-y-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-sm text-gray-300 hover:text-yellow-400 transition"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="space-y-8">
          <header className="border-b border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-yellow-400">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Last updated: {lastUpdated}
            </p>
            <p className="mt-4 text-gray-300">
              Please read these Terms carefully before using the Services. This
              document contains important information about your rights and
              obligations, risk disclosures, and limitations of liability.
            </p>
          </header>

          <section className="space-y-6">
            {sections.map((s) => (
              <article
                key={s.id}
                id={s.id}
                className="bg-gray-800/60 border border-gray-700 rounded-xl p-5"
              >
                <h2 className="text-lg font-semibold text-yellow-300 mb-2">
                  {s.title}
                </h2>
                <div className="leading-relaxed text-gray-200">{s.body}</div>
              </article>
            ))}
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onAccept}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-yellow-400 text-black font-semibold hover:brightness-95"
            >
              I Agree
            </button>
            <button
              onClick={onDecline}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              Decline
            </button>
          </div>

          <p className="text-xs text-gray-400 pt-4">
            Note: This page is provided for product implementation purposes and
            is not legal advice. Have your counsel review and adapt to your
            jurisdiction(s).
          </p>
        </main>
      </div>
    </div>
  );
};

export default Terms;
