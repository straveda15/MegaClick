import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import {
  Users,
  Building2,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";


const title = "Your Success, Our Mission";


const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};


const letterVariants = {

  hidden: {
    opacity: 0,
    y: 45,
    filter: "blur(8px)",
  },


  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },

};



const fadeUp = {

  hidden: {
    opacity: 0,
    y: 45,
  },


  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.8,
    },
  },

};




const About = () => {


  const sectionRef = useRef(null);


  const isInView = useInView(sectionRef, {
    amount: 0.35,
    once: false,
  });



  return (

    <section

      ref={sectionRef}

      className="
        relative
        overflow-hidden
        py-10
        bg-white
      "

    >


      <div

        className="
          max-w-[1500px]
          mx-auto
          px-6
          lg:px-24
        "

      >




        {/* ================= Heading ================= */}



        <motion.div

          initial="hidden"

          animate={
            isInView
            ?
            "visible"
            :
            "hidden"
          }

          variants={fadeUp}

          className="mb-14"

        >



          <span

            className="
              inline-flex
              items-center
              gap-2
              bg-[#0B4EA2]
              text-white
              px-4
              py-2
              rounded-full
              text-xs
              font-semibold
              mb-5
              shadow-md
            "

          >


            <Building2
              size={15}
              className="text-green-300"
            />


            ABOUT US


          </span>






          <motion.h2

            variants={containerVariants}

            initial="hidden"

            animate={
              isInView
              ?
              "visible"
              :
              "hidden"
            }


            className="
              mt-5
              text-3xl
              md:text-3xl
              lg:text-4xl
              font-extrabold
              leading-tight
              flex
              flex-wrap
            "

          >



            {
              title.split("").map((char,index)=>{

let color = "text-gray-900";

// "Your" -> Blue
if (index >= 0 && index <= 3) {
  color = "text-[#0B4EA2]";
}

// "Success" -> Green
if (index >= 5 && index <= 11) {
  color = "text-green-500";
}



                return (

                  <motion.span

                    key={index}

                    variants={letterVariants}

                    className={`
                      ${color}
                      inline-block
                    `}

                  >


                    {
                      char === " "
                      ?
                      "\u00A0"
                      :
                      char
                    }


                  </motion.span>

                );


              })

            }



          </motion.h2>







          <motion.div

            initial={{
              width:0,
              opacity:0
            }}


            animate={

              isInView

              ?

              {
                width:"7rem",
                opacity:1
              }

              :

              {
                width:0,
                opacity:0
              }

            }



            transition={{
              duration:0.6
            }}



            className="
              mt-6
              h-1.5
              rounded-full
              bg-gradient-to-r
              from-[#0B4EA2]
              to-green-500
            "

          />



        </motion.div>

        
        {/* ================= About Content ================= */}



        <motion.div


          initial="hidden"


          animate={
            isInView
            ?
            "visible"
            :
            "hidden"
          }


          variants={fadeUp}


          className="
            w-full
            space-y-8
          "


        >




          <p

            className="
              text-xl
              lg:text-[22px]
              leading-10
              text-gray-700
              text-justify
            "

          >


            <span className="font-bold">


              <span className="text-[#0B4EA2]">
                Mega
              </span>


              <span className="text-green-500">
                Click
              </span>


            </span>



            {" "}



            stands as one of India's most dynamic and
            forward-thinking integrated professional
            service platforms. It is built to simplify,
            streamline, and elevate the way individuals
            and businesses access professional services.
            Founded on a foundation of integrity,
            professionalism, and customer satisfaction,
            MegaClick is not merely a professional
            service provider—it is a complete ecosystem
            designed to fulfil every personal and
            business requirement with precision,
            expertise, and an unwavering commitment
            to excellence.


          </p>






          <p


            className="
              text-xl
              lg:text-[22px]
              leading-10
              text-gray-700
              text-justify
            "


          >



            By bringing together legal, financial,
            banking, real estate, and business
            support professional services under
            one seamlessly integrated ecosystem,



            <span className="font-bold">


              {" "}


              <span className="text-[#0B4EA2]">
                Mega
              </span>


              <span className="text-green-500">
                Click
              </span>


            </span>



            {" "}



            eliminates the fragmentation that has
            traditionally complicated professional
            service delivery across India.
            Individuals and businesses no longer
            need to manage multiple uncoordinated
            service providers. MegaClick brings
            everything under one roof, supported
            by meticulous planning, continuous
            effort, and a strategic approach that
            consistently delivers reliable,
            transparent, and result-oriented
            professional services.


          </p>




        </motion.div>







        {/* ================= Statistics Strip ================= */}





        <motion.div


          initial={{
            opacity:0,
            y:70
          }}



          animate={

            isInView

            ?

            {
              opacity:1,
              y:0
            }


            :


            {
              opacity:0,
              y:70
            }

          }



          transition={{

            duration:0.8,

            ease:"easeOut",

            delay:0.25

          }}



          className="
            relative
            mt-14
            w-full
            overflow-hidden
            rounded
            bg-gradient-to-r
            from-[#0B4EA2]
            via-blue-600
            to-[#0B4EA2]
            shadow-2xl
          "



        >






          {/* Background Pattern */}





          <div

            className="
              absolute
              inset-0
              opacity-[0.08]
            "



            style={{


              backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,.9) 1.2px, transparent 1.2px)",


              backgroundSize:
              "26px 26px"


            }}



          />






          <div


            className="
              absolute
              inset-0
              opacity-[0.08]
            "


            style={{


              backgroundImage:
              "repeating-linear-gradient(-45deg, rgba(255,255,255,.8) 0px, rgba(255,255,255,.8) 2px, transparent 2px, transparent 42px)"


            }}



          />








          <div


            className="
              relative
              z-10
              grid
              grid-cols-2
              lg:grid-cols-4
            "


          >
            {/* ================= Stat 1 ================= */}



            <motion.div

              whileHover={{
                y:-8,
                scale:1.03
              }}

              transition={{
                duration:0.3
              }}


              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-4
                py-8
                border-b
                lg:border-b-0
                lg:border-r
                border-white/10
              "


            >



              <div

                className="
                  w-14
                  h-14
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-4
                  shadow-lg
                "

              >

                <Users className="w-6 h-6 text-[#0B4EA2]" />

              </div>




              <h3 className="text-4xl font-bold text-white">
                15K+
              </h3>


              <p className="text-white/80 mt-2 font-medium">
                Happy Clients
              </p>



            </motion.div>






            {/* ================= Stat 2 ================= */}



            <motion.div


              whileHover={{
                y:-8,
                scale:1.03
              }}


              transition={{
                duration:0.3
              }}



              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-4
                py-8
                border-b
                lg:border-b-0
                lg:border-r
                border-white/10
              "



            >



              <div

                className="
                  w-14
                  h-14
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-4
                  shadow-lg
                "

              >

                <Building2 className="w-6 h-6 text-green-500" />

              </div>




              <h3 className="text-4xl font-bold text-white">
                25+
              </h3>



              <p className="text-white/80 mt-2 font-medium">
                Business Services
              </p>



            </motion.div>








            {/* ================= Stat 3 ================= */}



            <motion.div


              whileHover={{
                y:-8,
                scale:1.03
              }}


              transition={{
                duration:0.3
              }}



              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-4
                py-8
                lg:border-r
                border-white/10
              "



            >



              <div

                className="
                  w-14
                  h-14
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-4
                  shadow-lg
                "

              >


                <ShieldCheck className="w-6 h-6 text-emerald-500" />


              </div>




              <h3 className="text-4xl font-bold text-white">
                100%
              </h3>



              <p className="text-white/80 mt-2 font-medium">
                Trusted Process
              </p>




            </motion.div>








            {/* ================= Stat 4 ================= */}




            <motion.div


              whileHover={{
                y:-8,
                scale:1.03
              }}



              transition={{
                duration:0.3
              }}



              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-4
                py-8
              "



            >




              <div

                className="
                  w-14
                  h-14
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-4
                  shadow-lg
                "

              >


                <BadgeCheck className="w-6 h-6 text-[#0B4EA2]" />


              </div>




              <h3 className="text-4xl font-bold text-white">
                10+
              </h3>



              <p className="text-white/80 mt-2 font-medium">
                Years Experience
              </p>




            </motion.div>




          </div>



        </motion.div>





      </div>


    </section>


  );


};


export default About;