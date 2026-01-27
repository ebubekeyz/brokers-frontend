import { useEffect } from "react";

const TawkMessenger = () => {
  useEffect(() => {
    // Prevent loading twice
      if (document.getElementById("tawk-to-widget")) return;
      
      

    const script = document.createElement("script");
    script.id = "tawk-to-widget";
    script.async = true;
    script.src = 'https://embed.tawk.to/68992f2ad866aa19294ccbdf/1j2b60gea';
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);
  }, []);

  return null; // This component doesn't render UI
};

export default TawkMessenger;

