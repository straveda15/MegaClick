import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import logo from "../../assets/LOGO.png";
import img1 from "../../assets/img1.jpg";


const HeroSection = () => {

  return (

    <section
      className="
        bg-gradient-to-r
        from-[#0B4EA2]
        to-blue-700
        py-14
        lg:py-16
        overflow-hidden
        relative
      "
    >


      {/* Left Green Slant */}

      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-70
          bg-green-500
          opacity-80
        "
        style={{
          clipPath: "polygon(0 0, 100% 0, 60% 100%, 0 100%)",
        }}
      ></div>





      {/* Right Green Slant */}

      <div
        className="
          absolute
          right-0
          top-0
          h-full
          w-60
          bg-green-500
          opacity-80
        "
        style={{
          clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      ></div>







      <div
        className="
          max-w-[1500px]
          mx-auto
          px-6
          lg:px-24
          relative
          z-10
        "
      >



        <div
          className="
            grid
            lg:grid-cols-[0.9fr_1.1fr]
            items-center
            gap-8
          "
        >





          {/* Left Image */}



          <div
            className="
            flex
            justify-center
            lg:justify-center
            "
          >


            <div
              className="
              relative
              "
            >




              {/* Decorative Circle */}


              <div
                className="
                  absolute
                  -inset-3
                  rounded-full
                  border
                  border-white/20
                "
              ></div>






              {/* Image */}


              <div
                className="
                  w-64
                  h-64
                  lg:w-72
                  lg:h-72
                  rounded-full
                  overflow-hidden
                  border-[6px]
                  border-white/20
                  shadow-2xl
                "
              >


                <img
                  src={img1}
                  alt="MegaClick Services"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />


              </div>



            </div>



          </div>









          {/* Right Content */}



          <div
            className="
            text-white
            "
          >





            {/* Badge */}



            <span
              className="
                inline-flex
                items-center
                gap-2
                bg-white/10
                backdrop-blur-md
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
              "
            >


              <BriefcaseBusiness
                size={18}
                className="text-green-300"
              />


              Our Professional Services


            </span>








            {/* Heading */}



            <h1
              className="
                mt-5
                text-3xl
                md:text-4xl
                lg:text-[44px]
                font-bold
                leading-tight
              "
            >


              Professional Services


              <br />


              <span className="text-green-300">

                Designed for Every Business

              </span>


            </h1>








            {/* Quote */}



            <p
              className="
                mt-5
                text-xl
                lg:text-2xl
                italic
                font-semibold
                text-black
                leading-relaxed
              "
            >


              “ONE PLATFORM.
              <br />
              COMPLETE SOLUTIONS FOR
              <br />
              BUSINESSES & INDIVIDUALS”


            </p>





          </div>





        </div>




      </div>




    </section>

  );

};


export default HeroSection;