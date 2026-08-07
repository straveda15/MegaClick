import React from "react";


import team1 from "../assets/team1.jpg";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";
import team4 from "../assets/team4.jpg";


const teamMembers = [
  {
    image: team1,
    name: "Rahul Sharma",
    role: "Founder & CEO",
  },

  {
    image: team2,
    name: "Priya Deshmukh",
    role: "Legal Consultant",
  },

  {
    image: team3,
    name: "Amit Patil",
    role: "Financial Advisor",
  },

  {
    image: team4,
    name: "Neha Kulkarni",
    role: "Business Consultant",
  },
];

import {
  Users
} from "lucide-react";
const Team = () => {

  return (

    <section
      className="
      py-20
      bg-blue-50
      "
    >

      <div
        className="
        max-w-[1530px]
        mx-auto
        px-6
        sm:px-10
        lg:px-24
        xl:px-32
        "
      >


        {/* Heading */}

       <div
  className="
  mb-14
  max-w-3xl
  "
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
  mb-4
  "
>

  <Users
    size={15}
    className="text-green-300"
  />

  OUR TEAM

</span>



          <h2
            className="
            mt-5
            text-4xl
            lg:text-4xl
            font-bold
          text-[#0B4EA2]
            "
          >

            Meet Our

            <span className="text-green-600">
              {" "}Experts
            </span>

          </h2>



      <p
  className="
  mt-4
  max-w-2xl
  text-black
  text-base
  leading-7
  "
>
            Our experienced professionals are dedicated to providing
            reliable business solutions and expert guidance.
          </p>



        

        </div>





        {/* Team Cards */}

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-8
          "
        >


          {
            teamMembers.map((member,index)=>(


              <div
                key={index}
                className="
                group
                bg-white
                rounded-2xl
                border
                border-gray-500
                overflow-hidden
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                hover:shadow-[0_15px_40px_rgba(11,78,162,0.15)]
                transition-all
                duration-300
                hover:-translate-y-2
                "
              >



                {/* Image */}

                <div
                  className="
                  relative
                  h-52
                  overflow-hidden
                  bg-gray-100
                  "
                >

                  <img
                    src={member.image}
                    alt={member.name}
                    className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-105
                    transition
                    duration-500
                    "
                  />


                  {/* overlay */}

                  <div
                    className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/20
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition
                    "
                  />


                </div>





                {/* Content */}

                <div
                  className="
                  p-6
                  text-center
                  "
                >


                  <h3
                    className="
                    text-xl
                    font-bold
                    text-gray-900
                    "
                  >

                    {member.name}

                  </h3>



                  <p
                    className="
                    mt-2
                    text-sm
                    font-medium
                    text-[#0B4EA2]
                    "
                  >

                    {member.role}

                  </p>



                  <div
                    className="
                    w-10
                    h-[2px]
                    bg-green-500
                    mx-auto
                    mt-4
                    "
                  />


                </div>


              </div>


            ))
          }


        </div>


      </div>


    </section>

  );

};


export default Team;