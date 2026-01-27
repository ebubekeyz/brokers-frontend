// src/pages/About.tsx
import React from "react";

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "David Carter",
      role: "Founder & CEO",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sarah Johnson",
      role: "Chief Investment Officer",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Lee",
      role: "Blockchain Specialist",
      img: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    {
      name: "Emily Brown",
      role: "Head of Client Relations",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-600 to-yellow-400 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            About Barick Gold
          </h1>
          <p className="mt-4 text-lg text-gray-800 max-w-2xl mx-auto">
            Combining the timeless value of gold with the innovation of cryptocurrency.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">Our Story</h2>
          <p className="text-gray-300 mb-4">
            Founded with a vision to bridge traditional wealth preservation and modern financial growth,
            Barick Gold offers a balanced investment strategy by combining the stability of gold and the
            high-growth potential of cryptocurrency.
          </p>
          <p className="text-gray-400">
            Our team consists of experts in finance, blockchain technology, and global economics, ensuring
            that our clients receive the best insights and strategies for wealth creation.
          </p>
        </div>
        <img
         src="https://upload.wikimedia.org/wikipedia/commons/a/af/Gold_bullion_bars.jpg"
  alt="Gold and finance imagery"
  className="rounded-2xl shadow-lg"
        />
      </section>

      {/* Mission and Vision */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div className="bg-gray-700 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">Our Mission</h3>
            <p className="text-gray-300">
              To empower individuals and institutions to grow and secure their wealth
              through a hybrid investment approach that blends gold and cryptocurrency.
            </p>
          </div>

          <div className="bg-gray-700 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-yellow-400 mb-3">Our Vision</h3>
            <p className="text-gray-300">
              To be the world’s most trusted investment platform for wealth stability
              and exponential growth in the digital era.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-yellow-400">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Trust", desc: "We operate with full transparency and integrity." },
            { title: "Innovation", desc: "We embrace technology to enhance wealth creation." },
            { title: "Security", desc: "We prioritize the safety of your assets." },
          ].map((value, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-yellow-500"
            >
              <h4 className="text-xl font-semibold text-yellow-400 mb-3">{value.title}</h4>
              <p className="text-gray-300">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-yellow-400">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-gray-700 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-yellow-500"
                />
                <h4 className="mt-4 text-xl font-semibold text-yellow-400">
                  {member.name}
                </h4>
                <p className="text-gray-300">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-yellow-500 text-black py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Grow Your Wealth?
        </h2>
        <p className="mb-6">
          Join Barick Gold today and experience the future of investing.
        </p>
        <a
          href="/register"
          className="inline-block px-8 py-4 bg-black text-yellow-500 rounded-lg font-semibold hover:bg-gray-900"
        >
          Get Started
        </a>
      </section>
    </div>
  );
};

export default About;
