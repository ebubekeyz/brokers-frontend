// src/pages/Services.tsx
import React from "react";

const Services: React.FC = () => {
  const services = [
    {
      title: "Gold Investment Plans",
      desc: "Secure your wealth with long-term gold investment portfolios tailored to your financial goals.",
      img: "https://upload.wikimedia.org/wikipedia/commons/a/af/Gold_bullion_bars.jpg", // Stable Wikimedia
    },
    {
      title: "Crypto Trading",
      desc: "Leverage the fast-growing cryptocurrency market with our expert-guided trading solutions.",
      img: "https://images.pexels.com/photos/7712570/pexels-photo-7712570.jpeg", // Stable Wikimedia
    },
    {
      title: "Hybrid Investment Strategy",
      desc: "Combine the stability of gold with the growth of crypto for a balanced, high-potential portfolio.",
      img: "https://images.pexels.com/photos/4960464/pexels-photo-4960464.jpeg", // Stable Wikimedia
    },
    {
      title: "Wealth Management",
      desc: "Our experts provide customized strategies to manage and grow your assets securely.",
      img: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg", // Stable Wikimedia
    },
  ];

  const benefits = [
    { title: "Trusted Advisors", desc: "Experienced financial experts in gold and crypto investments." },
    { title: "Secure Transactions", desc: "Top-tier encryption and safe asset custody solutions." },
    { title: "Global Access", desc: "Invest from anywhere in the world with our online platform." },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-20"
        style={{
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/commons/c/c5/Bitcoin_and_gold.jpg')",
        }}
      >
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">
            Our Services
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-200">
            At Barick Gold, we blend the security of gold with the innovation of cryptocurrency
            to deliver unmatched investment opportunities.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mb-12">
          What We Offer
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transform transition"
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-10">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gray-700 p-6 rounded-2xl shadow-lg border border-yellow-500"
              >
                <h4 className="text-xl font-semibold text-yellow-400 mb-3">
                  {benefit.title}
                </h4>
                <p className="text-gray-300">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-yellow-500 text-black py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Your Investment Journey
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied investors who trust Barick Gold for secure and profitable investments.
        </p>
        <a
          href="/register"
          className="inline-block px-8 py-4 bg-black text-yellow-500 rounded-lg font-semibold hover:bg-gray-900 transition"
        >
          Get Started
        </a>
      </section>
    </div>
  );
};

export default Services;
