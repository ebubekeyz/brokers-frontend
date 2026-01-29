import { useEffect } from "react";

const TawkMessenger = () => {
  useEffect(() => {
    // Prevent loading twice
      if (document.getElementById("tawk-to-widget")) return;
      
      

    const script = document.createElement("script");
    script.id = "tawk-to-widget";
    script.async = true;
    script.src = 'https://embed.tawk.to/697b9e01111a7519800fe244/1jg5e2e4g';
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);
  }, []);

  return null; // This component doesn't render UI
};

export default TawkMessenger;




// <!--Start of Tawk.to Script-->
// <script type="text/javascript">
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/697b9e01111a7519800fe244/1jg5e2e4g';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// </script>
// <!--End of Tawk.to Script-->

