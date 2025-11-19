import React from "react";

const HeroSection = ({ bgImage, headline, subtext, children }) => (
  <section
    className="relative h-[480px] flex items-center justify-center bg-cover bg-center text-white"
    style={{ backgroundImage: `url('${bgImage}')` }}
  >
    <div className="absolute inset-0 bg-black/50" />
    <div className="relative max-w-3xl text-center px-6">
      <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">{headline}</h1>
      <p className="text-xl drop-shadow-md mb-6">{subtext}</p>
      {children}
    </div>
  </section>
);

export default HeroSection;
