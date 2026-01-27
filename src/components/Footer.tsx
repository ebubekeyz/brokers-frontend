import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import axios from "axios";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000"
        : "https://brokers-backend-hbq6.onrender.com";


interface SettingsData {
  companyName: string,
  companyAddress: string;
  email: string;
  phone: string;
}



const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
      companyName: "",
    companyAddress: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${productionUrl}/api/settings`);
       
        setSettings({
          companyName: res.data?.settings.companyName || "",
          companyAddress: res.data?.settings.companyAddress || "",
          email: res.data?.settings.email || "",
          phone: res.data?.settings.phone || "",
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  
  return (
    <footer className="bg-gray-900 text-gray-200 px-6 py-10 lg:px-24 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">{settings.companyName || "Loading companyName..."}</h2>
          <p className="text-sm text-gray-400">
            We are committed to helping individuals and businesses make smart
            financial decisions. Your trusted partner in investment, brokerage,
            and wealth growth.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                About
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-white transition">
                Services
              </a>
            </li>
            <li>
              <a href="/faqs" className="hover:text-white transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
  <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
  <ul className="space-y-2 text-sm">
    <li>
      <a href="#" className="hover:text-white transition">
        Gold Investment Portfolios
      </a>
    </li>
    <li>
      <a href="#" className="hover:text-white transition">
        Cryptocurrency Trading & Analysis
      </a>
    </li>
    <li>
      <a href="#" className="hover:text-white transition">
        Precious Metals Storage & Security
      </a>
    </li>
    <li>
      <a href="#" className="hover:text-white transition">
        Hybrid Gold-Crypto Investment Strategies
      </a>
    </li>
    <li>
      <a href="#" className="hover:text-white transition">
        Market Insights & Investment Advisory
      </a>
    </li>
  </ul>
</div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <p className="text-sm text-gray-400">
            {settings.companyAddress || "Loading address..."}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Email: {settings.email || "Loading email..."}
            <br />
            Phone: {settings.phone || "Loading phone..."}
          </p>

          {/* Social Icons */}
          {/* <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-300 hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaInstagram />
            </a>
          </div> */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {settings.companyName || "Loading companyName..."}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
