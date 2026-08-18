import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const scrollToHowItWorks = () => {
    const targetElement = 
      document.getElementById("how-it-works") ||
      document.getElementById("howitworks") ||
      document.getElementById("process");

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight * 0.7,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden bg-[#fafdfc] py-14 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16 font-['Inter',sans-serif]"
    >
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1000px] mx-auto text-center flex flex-col items-center px-2 sm:px-4">
        {/* 2-Line Heading with lighter font weight (font-normal / 400) */}
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal leading-[1.25] sm:leading-[1.3] tracking-tight max-w-4xl mx-auto"
          style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif' }}
        >
          {/* 1st Line in Slate/Black */}
          <span className="text-[#0f172a] block">
            Solutions for Businesses &amp; Individuals
          </span>
          
          {/* 2nd Line in Blue */}
          <span className="text-[#0B4EA2] block mt-1.5 sm:mt-2">
            Everything, One Click Away
          </span>
        </h1>

        {/* Paragraph (Inter Font - light & clean) */}
        <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-600 font-light leading-relaxed max-w-2xl mx-auto px-2">
          MegaClick is your one-stop platform for reliable legal, financial, banking, and business services delivering expert support, seamless execution, and complete peace of mind.
        </p>

        {/* Action Button in Green (font-medium instead of bold) */}
        <div className="mt-6 sm:mt-8 flex justify-center w-full">
          <button
            onClick={scrollToHowItWorks}
            className="group inline-flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-700 text-white px-7 sm:px-8 py-3 rounded-full font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;