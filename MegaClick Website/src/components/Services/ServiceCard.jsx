import React from "react";
import { Link } from "react-router-dom";



const ServiceCard = ({ service }) => {


  return (

    <Link
      to={`/services/${service.slug}`}
      className="
      group
      block
      h-full
      "
    >


      <div

      className="
      relative
      overflow-hidden

      bg-white

      rounded-3xl

      p-6

      shadow-[0_10px_35px_rgba(0,0,0,0.08)]

      hover:shadow-[0_20px_50px_rgba(11,78,162,0.18)]

      hover:-translate-y-2

      transition-all
      duration-500

      h-full
      "

      >



      {/* Floating Glow */}


      <div

      className="
      absolute
      -top-10
      -right-10

      w-32
      h-32

      rounded-full

      bg-blue-100/50

      blur-3xl

      group-hover:bg-green-100/60

      transition

      "

      />






      {/* Icon Box */}


      <div

      className="
      relative
      w-16
      h-16

      rounded-2xl

      bg-blue-50

      flex
      items-center
      justify-center

      mb-5

      group-hover:bg-[#0B4EA2]

      transition-all
      duration-300

      "

      >


      {
        service.icon ? (

          <img

          src={service.icon}

          alt={service.title}

          className="
          w-9
          h-9
          object-contain

          group-hover:scale-110

          transition

          "

          />

        ) : (

          <span
          className="
          text-3xl
          group-hover:scale-110
          transition
          "
          >
            📋
          </span>

        )

      }


      </div>








      {/* Title */}


      <h3

      className="
      relative

      text-lg

      font-bold

      text-gray-900

      group-hover:text-[#0B4EA2]

      transition

      "

      >

      {service.title}


      </h3>







      {/* Description */}


      <p

      className="
      relative

      mt-2

      text-sm

      text-gray-500

      leading-6

      line-clamp-2

      "

      >

      {
        service.description ||
        "Get professional assistance with complete support."
      }


      </p>









      {/* Bottom Tag */}


      <div

      className="
      relative

      mt-5

      inline-flex

      items-center

      px-4

      py-1.5

      rounded-full

      bg-green-50

      text-green-700

      text-xs

      font-semibold

      "

      >

      {service.category}


      </div>






      </div>



    </Link>


  );


};


export default ServiceCard;