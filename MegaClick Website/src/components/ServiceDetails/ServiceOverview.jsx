
import React from "react";

const ServiceOverview = ({ service }) => {
  if (!service) return null;

  const serviceFeatures = [
    {
      icon: "💯",
      title: "Service Guaranteed",
      subtitle: "100% Refund",
    },
    {
      icon: "⏱️",
      title: "Apply in 2 Minutes",
      subtitle: "Hassle Free Process through WhatsApp",
    },
    {
      icon: "🔐",
      title: "Safe and Secure",
      subtitle: "Cashfree Payment Gateway",
    },
  ];

  return (
    <section className="w-full bg-white">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          py-8
          sm:py-10
          lg:py-12
        "
      >
        {/* =========================
            SERVICE OVERVIEW
        ========================== */}

        <div className="w-full text-center">

         
          {/* MAIN HEADING */}

          <h2
            className="
              text-2xl
              sm:text-3xl
              lg:text-4xl
              font-bold
              leading-tight
              bg-gradient-to-r
              from-[#0B4EA2]
              to-green-500
              bg-clip-text
              text-transparent
            "
          >
            {service.title}
          </h2>

          {/* DESCRIPTION */}

          {service.description && (
            <p
              className="
                mt-5
                mx-auto
                max-w-4xl
                text-sm
                sm:text-base
                lg:text-lg
                text-gray-600
                leading-7
                sm:leading-8
              "
            >
              {service.description}
            </p>
          )}
        </div>

        {/* =========================
            SERVICE FEATURES
        ========================== */}

        <div
          className="
            mt-8
            sm:mt-10
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
            lg:gap-6
          "
        >
          {serviceFeatures.map((feature, index) => (
            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-gray-100
                bg-green-100
                px-5
                py-4
                sm:px-6
                sm:py-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#0B4EA2]/20
                hover:shadow-[0_10px_30px_rgba(11,78,162,0.08)]
              "
            >
              {/* LEFT BLUE STRIP */}

              <span
                className="
                  absolute
                  left-0
                  top-0
                  bottom-0
                  w-1
                  bg-green-600
                  transition-all
                  duration-300
                  group-hover:w-1.5
                "
              />

              {/* ICON */}

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-2xl
                  shadow-sm
                  border
                  border-gray-100
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              >
                {feature.icon}
              </div>

              {/* CONTENT */}

              <div className="text-left">
                <h3
                  className="
                    text-sm
                    sm:text-base
                    font-bold
                    text-gray-900
                  "
                >
                  {feature.title}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    sm:text-sm
                    leading-5
                    text-gray-500
                  "
                >
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;
