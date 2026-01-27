// import React, { useEffect, useState } from "react";
// import { Mail, Phone, MapPin, Globe } from "lucide-react";
// import { FaBitcoin } from "react-icons/fa6"; // crypto & gold icons
// import axios from "axios";

// const productionUrl =
//   process.env.NODE_ENV !== "production"
//     ? "http://localhost:7000/api"
//     : "https://brokers-backend-hbq6.onrender.com/api";

// interface SettingsData {
//   email: string;
//   phone: string;
//   address: string;
// }

// const TopHeader: React.FC = () => {
//   const [settings, setSettings] = useState<SettingsData>({
//     email: "",
//     phone: "",
//     address: "",
//   });

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const res = await axios.get(`${productionUrl}/settings`);
//         setSettings({
//           email: res.data?.settings.email || "",
//           phone: res.data?.settings.phone || "",
//           address: res.data?.settings.companyAddress || "",
//         });
//       } catch (err) {
//         console.error("Error fetching settings:", err);
//       }
//     };

//     fetchSettings();
//   }, []);

//   return (
//     <div className="bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white text-sm shadow-lg border-b border-yellow-500">
//       <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-4">

//         {/* Left: Logo/Brand Vibe */}
//         {/* <div className="flex items-center gap-2 text-lg font-bold tracking-wide">
//           <FaBitcoin className="text-yellow-400" />
//           <FaBitcoin className="text-yellow-300" />
//           <span className="text-yellow-200">Barick Gold Investments</span>
//         </div> */}

//         {/* Contact Info */}
//         <div className="flex flex-wrap items-center gap-4">
//           {/* Email */}
//           <div className="flex items-center gap-1">
//             <Mail size={16} className="text-yellow-300" />
//             <span className="font-semibold">Email:</span>
//             <a href={`mailto:${settings.email}`} className="hover:underline text-yellow-200">
//               {settings.email || "Loading..."}
//             </a>
//           </div>

//           {/* Phone */}
//           <div className="flex items-center gap-1 hidden lg:flex">
//             <Phone size={16} className="text-yellow-300" />
//             <span className="font-semibold">Phone:</span>
//             <a href={`tel:${settings.phone}`} className="hover:underline text-yellow-200">
//               {settings.phone || "Loading..."}
//             </a>
//           </div>

//           {/* Address */}
//           <div className="flex items-center gap-1 hidden lg:flex">
//             <MapPin size={16} className="text-yellow-300" />
//             <span className="font-semibold">Address:</span>
//             <span className="text-yellow-200">{settings.address || "Loading..."}</span>
//           </div>
//         </div>

//         {/* Language Selector */}
//         <div className="flex items-center gap-2">
//           <Globe size={18} className="text-yellow-300" />
//           <select
//             className="bg-yellow-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
//           >
//             <option value="en">English</option>
//             <option value="es">Español</option>
//             <option value="de">Deutsch</option>
//             <option value="fr">Français</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopHeader;



import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaBitcoin } from "react-icons/fa6"; // crypto & gold icons
import axios from "axios";

const productionUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:7000/api"
    : "https://brokers-backend-h2nt.onrender.com/api";

interface SettingsData {
  email: string;
  phone: string;
  address: string;
}

const TopHeader: React.FC = () => {


const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "zh-CN", name: "Chinese" }
];

  


useEffect(() => {
    // Load hidden Google Translate element
    const interval = setInterval(() => {
      const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (selectEl) {
        clearInterval(interval);
      }
    }, 500);
  }, []);

  const handleChange = (lang: string) => {
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = lang;
      selectEl.dispatchEvent(new Event("change"));
    }
  };






  const [settings, setSettings] = useState<SettingsData>({
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${productionUrl}/settings`);
        setSettings({
          email: res.data?.settings.email || "",
          phone: res.data?.settings.phone || "",
          address: res.data?.settings.companyAddress || "",
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="bg-gradient-to-r from-yellow-700 via-yellow-800 to-gray-900 text-white text-sm shadow-lg border-b border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left: Logo/Brand Vibe */}
        {/* <div className="flex items-center gap-2 text-lg font-bold tracking-wide">
          <FaBitcoin className="text-yellow-400" />
          <FaBitcoin className="text-yellow-300" />
          <span className="text-yellow-200">Barick Gold Investments</span>
        </div> */}

        {/* Contact Info */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Email */}
          <div className="flex items-center gap-1">
            <Mail size={16} className="text-yellow-300" />
            <span className="font-semibold">Email:</span>
            <a href={`mailto:${settings.email}`} className="hover:underline text-yellow-200">
              {settings.email || "Loading..."}
            </a>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-1 hidden lg:flex">
            <Phone size={16} className="text-yellow-300" />
            <span className="font-semibold">Phone:</span>
            <a href={`tel:${settings.phone}`} className="hover:underline text-yellow-200">
              {settings.phone || "Loading..."}
            </a>
          </div>

          {/* Address */}
          <div className="flex items-center gap-1 hidden lg:flex">
            <MapPin size={16} className="text-yellow-300" />
            <span className="font-semibold">Address:</span>
            <span className="text-yellow-200">{settings.address || "Loading..."}</span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-yellow-300" />
           <select
        id="language-select"
        onChange={(e) => handleChange(e.target.value)}
       className="bg-yellow-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
          </select>
           {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
