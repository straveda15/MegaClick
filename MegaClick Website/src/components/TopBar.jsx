import React from "react";

import {
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";



const TopBar = () => {

  return (

    <div
      className="
      bg-blue-950
      text-white
      "
    >

<div className="
  max-w-[1500px]
  mx-auto
  px-6
  lg:px-24
  py-1
">

    


        <div
          className="
          flex
          items-center
          justify-between
          gap-5
          "
        >





          {/* Contact Details */}


          <div
            className="
            flex
            items-center
            gap-6
            text-sm
            "
          >




            {/* Phone */}


            <div
              className="
              flex
              items-center
              gap-2
              "
            >

              <Phone
                size={16}
                className="
                text-green-400
                "
              />


              <span
                className="
                text-blue-100
                font-semibold
                "
              >

                +91 9921611911

              </span>


            </div>







            {/* Email */}


            <div
              className="
              hidden
              sm:flex
              items-center
              gap-2
              "
            >


              <Mail
                size={16}
                className="
                text-green-400
                "
              />


              <span
                className="
                text-blue-100
                font-semibold
                "
              >

                megaclickofficial@gmail.com

              </span>


            </div>



          </div>









          {/* Trust Text */}


          <div
            className="
            hidden
            md:flex
            items-center
            gap-2
            text-sm
            text-blue-100
            font-medium
            "
          >

            <ShieldCheck
              size={17}
              className="
              text-green-400
              "
            />


            Trusted Business Solutions


          </div>





        </div>



      </div>


    </div>

  );

};


export default TopBar;