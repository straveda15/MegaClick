import React from "react";

import {
  Quote,
  Star,
  MessageSquareQuote,
} from "lucide-react";

import clientImg from "../assets/client.png";

import client1 from "../assets/team1.jpg";
import client2 from "../assets/team2.jpg";
import client3 from "../assets/team3.jpg";
import client4 from "../assets/team4.jpg";

const testimonials = [
  {
    name: "Rajesh Sharma",
    service: "Private Limited Company Registration",
    location: "Nashik, Maharashtra",
    review:
      "MegaClick provided exceptional support during our company registration process. Their team handled every document professionally and ensured a hassle-free experience.",
  },
  {
    name: "Priya Enterprises",
    service: "GST Registration",
    location: "Pune, Maharashtra",
    review:
      "The entire process was smooth and transparent. We received regular updates and expert guidance throughout the business registration journey.",
  },
  {
    name: "Amit Patel",
    service: "Trademark Registration",
    location: "Mumbai, Maharashtra",
    review:
      "Excellent service with outstanding customer support. Every query was answered promptly and the team completed our work on time.",
  },
  {
    name: "Sneha Kulkarni",
    service: "MSME Registration",
    location: "Nagpur, Maharashtra",
    review:
      "MegaClick made the documentation process incredibly simple. Their professional approach exceeded our expectations.",
  },
];
const Testimonials = () => {
  return (
    <section
      className="
      relative
      overflow-hidden
      py-16
      bg-white
      "
    >
      {/* Background */}

      <div
        className="
        absolute
        -top-24
        -left-24
        h-50
        w-50
        rounded-full
        bg-blue-200
        blur-3xl
        opacity-30
        "
      />

      <div
        className="
        absolute
        -bottom-24
        -right-24
        h-80
        w-80
        rounded-full
        bg-green-200
        blur-3xl
        opacity-30
        "
      />

      <div
        className="
        relative
        max-w-[1500px]
        mx-auto
        px-6
        lg:px-24
        z-10
        "
      >
        {/* Header */}

        <div
          className="
          grid
          lg:grid-cols-2
          gap-10
          items-center
          mb-14
          "
        >
          {/* Left */}

          <div>
            <span
              className="
              inline-flex
              items-center
              gap-2
              bg-[#0B4EA2]
              text-white
              px-5
              py-2
              rounded-full
              text-sm
              font-semibold
              shadow-md
              mb-5
              "
            >
              <MessageSquareQuote
                size={16}
                className="text-green-400"
              />
              Client Testimonials
            </span>

            <h2
              className="
              text-3xl
              lg:text-5xl
              font-bold
              leading-tight
              "
            >
              What Our Clients

              <span
                className="
                block
                bg-gradient-to-r
                from-[#0B4EA2]
                to-green-500
                bg-clip-text
                text-transparent
                "
              >
                Say About MegaClick
              </span>
            </h2>

            <p
              className="
              mt-5
              max-w-xl
              text-gray-600
              leading-7
              text-justify
              "
            >
              Thousands of businesses trust
              <span className="font-semibold">
                <span className="text-[#0B4EA2]"> Mega</span>
                <span className="text-green-500">Click</span>
              </span>
              for reliable registrations, transparent guidance and
              professional support. We simplify every business process
              with experienced experts and customer-first service.
            </p>
          </div>

          {/* Right Image */}

          <div className="flex justify-center">
            <div
              className="
              rounded-3xl
              border-2
              border-[#0B4EA2]
              p-3
              shadow-xl
              "
            >
              <img
                src={clientImg}
                alt="Happy Clients"
                className="
                w-[230px]
                lg:w-[280px]
                object-contain
                "
              />
            </div>
          </div>
        </div>

        {/* ===== Moving Testimonials starts here ===== */}

        <div className="relative overflow-hidden">

  <div
    className="
    flex
    gap-6
    w-max
    animate-testimonials
    py-4
    "
  >

    {[...testimonials, ...testimonials].map((item, index) => (

      <div
        key={index}
        className="
        w-[350px]
        flex-shrink-0
        bg-white
        rounded-2xl
        border
        border-blue-100
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-2
        transition-all
        duration-300
        p-2
        flex
        flex-col
        relative
        "
      >

        {/* Top Border */}

        <div
          className="
          absolute
          top-0
          left-0
          w-full
          h-1
          rounded-t-2xl
          bg-gradient-to-r
          from-[#0B4EA2]
          to-green-500
          "
        />

        {/* Quote */}

        <div
          className="
          w-11
          h-11
          rounded-xl
          bg-[#0B4EA2]
          flex
          items-center
          justify-center
          mb-5
          "
        >
          <Quote
            size={20}
            className="text-white"
          />
        </div>

        {/* Review */}

        <p
          className="
          text-[15px]
          leading-7
          text-gray-700
          text-justify
          flex-1
          "
        >
          "{item.review}"
        </p>

        {/* Stars */}

        <div className="flex gap-1 mt-5">

          {[1,2,3,4,5].map((star)=>(
            <Star
              key={star}
              size={16}
              fill="currentColor"
              className="text-green-500"
            />
          ))}

        </div>

        <div className="my-5 h-px bg-gray-200" />
{/* Divider */}

<div className="my-5 h-px bg-gray-200" />

{/* Client Details */}

<div className="space-y-1">

<div className="flex items-center gap-2">

  <span
    className="
    w-2.5
    h-2.5
    rounded-full
    bg-[#0B4EA2]
    "
  />

  <h3
    className="
    text-xl
    font-bold
    text-gray-900
    "
  >
    {item.name}
  </h3>

</div>

  <p
    className="
    text-sm
    font-medium
    text-[#0B4EA2]
    "
  >
    {item.service}
  </p>

  <p
    className="
    text-sm
    text-gray-500
    "
  >
    {item.location}
  </p>

</div>

      </div>

    ))}

  </div>

</div>

      </div>
    </section>
  );
};

export default Testimonials;