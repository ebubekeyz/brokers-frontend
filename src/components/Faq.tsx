// src/pages/FAQ.tsx
import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is the minimum investment amount?",
    answer:
      "Our minimum investment amount starts at $100 for cryptocurrency portfolios and $500 for gold investments.",
  },
  {
    question: "How secure is my investment?",
    answer:
      "We use multi-layered security including cold storage for crypto assets, insured vaults for gold, and strict compliance with global financial regulations.",
  },
  {
    question: "Can I invest in both gold and crypto at the same time?",
    answer:
      "Yes! We offer hybrid investment portfolios that balance gold's stability with crypto's growth potential.",
  },
  {
    question: "How do I withdraw my funds?",
    answer:
      "Withdrawals can be made through your dashboard. Crypto withdrawals are processed instantly, while gold-related transactions take 1–3 business days.",
  },
  {
    question: "Do you provide market insights?",
    answer:
      "Yes, our experts publish weekly market reports and send personalized alerts to help you make informed investment decisions.",
  },
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-900 min-h-screen py-16 px-6 text-gray-200 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          Everything you need to know about investing in cryptocurrency and gold with us.
        </p>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-md border border-gray-700"
            >
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <span
                  className={`transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
