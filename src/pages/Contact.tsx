// src/pages/Contact.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-hbq6.onrender.com/api";

interface SettingsData {
  companyName: string;
  companyAddress: string;
  email: string;
  phone: string;
}

const Contact: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    companyName: "",
    companyAddress: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios(`${productionUrl}/settings`);
        setSettings({
          companyName: res.data?.settings.companyName || "",
          companyAddress: res.data?.settings.companyAddress || "",
          email: res.data?.settings.email || "",
          phone: res.data?.settings.phone || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white">Loading contact details...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-red-400">Failed to load contact details.</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-6">
          Contact {settings.companyName}
        </h1>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-10">
          Get in touch with us for all your crypto and gold investment inquiries.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Head Office */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 text-center">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">
              Head Office
            </h3>
            <p className="text-gray-300">{settings.companyAddress}</p>
          </div>

          {/* Phone */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 text-center">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">
              Phone
            </h3>
            <p className="text-gray-300">{settings.phone}</p>
          </div>

          {/* Email */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 text-center">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">
              Email
            </h3>
            <p className="text-gray-300">{settings.email}</p>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-12 rounded-lg overflow-hidden shadow-md border border-gray-700">
          <iframe
            title="Company Location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              settings.companyAddress
            )}&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
