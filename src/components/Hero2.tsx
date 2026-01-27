// import React, { useEffect, useState } from "react";

// type Slide = {
//   id: number;
//   title: string;
//   subtitle: string;
//   image: string;
// };

// const slides: Slide[] = [
//   {
//     id: 1,
//     title: "Your Trusted Finance Partner",
//     subtitle: "Helping you achieve your financial goals with expert brokerage services.",
//     image: "https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg",
//   },
//   {
//     id: 2,
//     title: "Tailored Loan Solutions",
//     subtitle: "Get access to the best loan offers suited to your needs.",
//     image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg",
//   },
//   {
//     id: 3,
//     title: "Smarter Investment Opportunities",
//     subtitle: "We connect you with profitable investment paths.",
//     image: "https://images.pexels.com/photos/32168739/pexels-photo-32168739.jpeg",
//   },
// ];

// const Hero: React.FC = () => {
//   const [current, setCurrent] = useState<number>(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative h-[85vh] w-full overflow-hidden">
//           {slides.map((slide, index) => {
//               console.log(slide.image)
//           return  <div
//           key={slide.id}
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//             index === current ? "opacity-100 z-10" : "opacity-0 z-0"
//           }`}
//           style={{
//             backgroundImage: `url(${slide.image})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             backgroundRepeat: 'no-repeat',
//             height: "100%",
//             width: "100%",
//           }}
//         >
//           {/* Overlay */}
//           <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" />

//           {/* Content */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
//             <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
//             <p className="text-lg md:text-xl max-w-2xl">{slide.subtitle}</p>
//             <a
//               href="/register"
//               className="mt-6 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out"
//             >
//               Get Started
//             </a>
//           </div>
//         </div>
//       })}
//     </div>
//   );
// };

// export default Hero;