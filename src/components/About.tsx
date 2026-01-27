import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const About = () => {
  const team = [
    { name: 'Michael Thompson', role: 'Founder & CEO', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Sarah Johnson', role: 'Head of Strategy', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'David Chen', role: 'Chief Financial Officer', img: 'https://randomuser.me/api/portraits/men/65.jpg' },
    { name: 'Emily Davis', role: 'Operations Manager', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'James Lee', role: 'Marketing Director', img: 'https://randomuser.me/api/portraits/men/81.jpg' },
  ];

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center py-24 px-6 text-white" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3')`,
      }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold inline-block relative z-10 after:content-[''] after:block after:h-1 after:w-32 after:bg-blue-500 after:mx-auto after:mt-3">
            About Us
          </h1>
          <p className="mt-4 text-lg relative z-10">
            Trusted Finance Brokers Delivering Transparent & Tailored Investment Solutions.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
        <p className="text-lg leading-relaxed">
          At CapitalTrust Brokers, we pride ourselves on being a premier brokerage firm dedicated to helping individuals and businesses navigate the complex world of finance.
          With a decade of industry experience, we offer expert services in investment planning, wealth management, forex trading, and portfolio diversification.
          <br /><br />
          Our team of certified professionals combines data-driven insights with a client-first approach, ensuring you receive personalized strategies designed for sustainable growth.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg leading-relaxed">
              To empower clients with innovative financial solutions that enable them to achieve long-term stability and success.
              We are committed to transparency, integrity, and continuous growth in a rapidly evolving financial world.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg leading-relaxed">
              To become the most trusted and respected finance brokerage firm globally by consistently delivering value, trust, and top-tier investment services.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-10">Our Core Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Integrity', text: 'We maintain honesty and transparency in every transaction.' },
              { title: 'Client Focus', text: 'Your financial success is at the core of everything we do.' },
              { title: 'Innovation', text: 'We embrace change and utilize modern tools to serve you better.' },
              { title: 'Excellence', text: 'We deliver consistent, high-quality results every time.' },
              { title: 'Education', text: 'We empower clients with the knowledge they need to grow.' },
              { title: 'Accountability', text: 'We take full responsibility for our actions and outcomes.' },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded shadow hover:shadow-xl hover:scale-105 transition-transform duration-300"
              >
                <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team - Swiper Carousel */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-10 text-center">Meet Our Leadership</h3>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Pagination, Navigation]}
        >
          {team.map((member, idx) => (
            <SwiperSlide key={idx}>
              <div className="text-center bg-white p-6 rounded shadow">
                <img src={member.img} alt={member.name} className="w-24 h-24 mx-auto rounded-full mb-4" />
                <h4 className="text-xl font-semibold">{member.name}</h4>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Footer CTA */}
      <section className="bg-blue-900 text-white py-12 px-6 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Achieve Your Financial Goals?</h3>
        <p className="mb-6 text-lg">
          Join thousands of satisfied clients who trust us with their financial journey.
        </p>
        <a
          href="/contact"
          className="bg-white text-blue-900 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default About;
