import React, { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000"
        : "https://brokers-backend-hbq6.onrender.com";

const Contact: React.FC = () => {
 


  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${productionUrl}/api/settings`, );
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setPhone(data?.settings.phone || "");
        setEmail(data?.settings.email || "");
        setCompanyAddress(data?.settings.companyAddress || "");
      } catch (err) {
        console.error(err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <>
      {/* Map */}
      <div className="rounded overflow-hidden shadow-md">
        <iframe
          title="Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.4697202397684!2d-74.01025328459207!3d40.70749697933245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x90bb1d7d0e70b30b!2sWall%20Street!5e0!3m2!1sen!2sus!4v1660000000000!5m2!1sen!2sus"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      <div className="bg-gray-50 text-gray-800 font-sans min-h-screen py-10 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">Get in Touch</h2>
            <p className="text-gray-600">
              We’re here to answer your questions and guide you through your financial journey.
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <FaPhoneAlt className="text-blue-600 text-3xl mb-3" />
              <h4 className="font-semibold text-lg mb-1">Call Us</h4>
              <p>{phone || "Loading..."}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaEnvelope className="text-blue-600 text-3xl mb-3" />
              <h4 className="font-semibold text-lg mb-1">Email</h4>
              <p>{email || "Loading..."}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaMapMarkerAlt className="text-blue-600 text-3xl mb-3" />
              <h4 className="font-semibold text-lg mb-1">Visit Us</h4>
              <p>{companyAddress || "Loading..."}</p>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-white shadow rounded-lg p-6 md:p-10">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Support Hours</h3>
            <ul className="space-y-2 text-gray-700">
              <li>📅 Monday – Friday: 9:00 AM – 6:00 PM</li>
              <li>📅 Saturday: 10:00 AM – 4:00 PM</li>
              <li>🚫 Sunday: Closed</li>
            </ul>
          </div>

          {/* Quick Help */}
          <div className="bg-white shadow rounded-lg p-6 md:p-10">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Need Quick Help?</h3>
            <p className="mb-4 text-gray-700">
              Our support team is ready to assist you with account inquiries, brokerage services,
              investment guidance, and more. Reach out via phone or email, and we’ll respond promptly.
            </p>
            <p className="text-gray-700">
              For frequently asked questions, visit our{" "}
              <a href="/faqs" className="text-blue-600 font-semibold hover:underline">
                FAQ page
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
