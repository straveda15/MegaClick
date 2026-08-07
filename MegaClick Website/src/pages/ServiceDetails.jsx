import React from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  CheckCircle,
} from "lucide-react";

import serviceDetailsData from "../data/serviceDetailsData";
import ServiceHero from "../components/ServiceDetails/ServiceHero";

const ServiceDetails = () => {

  const { slug } = useParams();

  const service = serviceDetailsData.find(
    (item) => item.slug === slug
  );

  if (!service) {

    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-50
        "
      >

        <div
          className="
          bg-white
          rounded-3xl
          shadow-lg
          border
          border-gray-200
          p-12
          text-center
          max-w-lg
          "
        >

          <h1
            className="
            text-3xl
            font-bold
            text-gray-900
            mb-4
            "
          >
            Service Not Found
          </h1>

          <p
            className="
            text-gray-600
            mb-8
            leading-7
            "
          >
            Sorry, the service you are looking for does not exist
            or has been removed.
          </p>

          <Link
            to="/services"
            className="
            inline-flex
            items-center
            gap-2
            bg-[#0B4EA2]
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            transition
            "
          >

            <ArrowLeft size={18} />

            Back to Services

          </Link>

        </div>

      </div>

    );

  }

  return (

    <>

      {/* Hero Section */}

      <ServiceHero
        service={service}
      />

      <section
        className="
        py-16
        bg-gray-50
        "
      >

        <div
          className="
          max-w-7xl
          mx-auto
          px-6
          lg:px-20
          "
        >

          <div
            className="
            grid
            lg:grid-cols-3
            gap-10
            "
          >

            {/* LEFT */}

            <div
              className="
              lg:col-span-2
              space-y-8
              "
            >

              {/* HOW IT WORKS */}

              <div
                className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                shadow-sm
                p-8
                "
              >

                <h2
                  className="
                  text-3xl
                  font-bold
                  text-gray-900
                  mb-8
                  "
                >
                  How It Works
                </h2>

                <div
                  className="
                  space-y-8
                  "
                >

                  {

                    service.process?.map((step,index)=>(

                      <div
                        key={index}
                        className="
                        flex
                        gap-6
                        "
                      >

                        <div
                          className="
                          w-12
                          h-12
                          rounded-full
                          bg-[#0B4EA2]
                          text-white
                          flex
                          items-center
                          justify-center
                          font-bold
                          text-lg
                          shrink-0
                          "
                        >

                          {step.step}

                        </div>

                        <div>

                          <h3
                            className="
                            text-xl
                            font-semibold
                            text-gray-900
                            mb-2
                            "
                          >

                            {step.title}

                          </h3>

                          <p
                            className="
                            text-gray-600
                            leading-7
                            "
                          >

                            {step.description}

                          </p>

                        </div>

                      </div>

                    ))

                  }

                </div>

              </div>


                            {/* REQUIRED DOCUMENTS */}

              <div
                className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                shadow-sm
                p-8
                "
              >

                <h2
                  className="
                  text-3xl
                  font-bold
                  text-gray-900
                  mb-8
                  "
                >
                  Required Documents
                </h2>

                <div
                  className="
                  grid
                  sm:grid-cols-2
                  gap-5
                  "
                >

                  {

                    service.documents?.map((doc,index)=>(

                      <div
                        key={index}
                        className="
                        flex
                        items-center
                        gap-4
                        bg-gray-50
                        border
                        border-gray-200
                        rounded-2xl
                        p-5
                        hover:border-[#0B4EA2]
                        hover:bg-blue-50
                        transition-all
                        "
                      >

                        <div
                          className="
                          w-12
                          h-12
                          rounded-xl
                          bg-[#0B4EA2]
                          text-white
                          flex
                          items-center
                          justify-center
                          "
                        >

                          <FileText size={22}/>

                        </div>

                        <p
                          className="
                          font-medium
                          text-gray-700
                          "
                        >
                          {doc}
                        </p>

                      </div>

                    ))

                  }

                </div>

              </div>



              {/* BENEFITS */}

              <div
                className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                shadow-sm
                p-8
                "
              >

                <h2
                  className="
                  text-3xl
                  font-bold
                  text-gray-900
                  mb-8
                  "
                >
                  Benefits
                </h2>

                <div
                  className="
                  grid
                  md:grid-cols-2
                  gap-5
                  "
                >

                  {

                    service.benefits?.map((item,index)=>(

                      <div
                        key={index}
                        className="
                        flex
                        gap-4
                        items-start
                        bg-green-50
                        border
                        border-green-200
                        rounded-2xl
                        p-5
                        "
                      >

                        <CheckCircle
                          className="
                          text-green-600
                          mt-1
                          shrink-0
                          "
                          size={22}
                        />

                        <p
                          className="
                          text-gray-700
                          leading-7
                          "
                        >
                          {item}
                        </p>

                      </div>

                    ))

                  }

                </div>

              </div>



              {/* WHY CHOOSE MEGACLICK */}

              <div
                className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                shadow-sm
                p-8
                "
              >

                <h2
                  className="
                  text-3xl
                  font-bold
                  text-gray-900
                  mb-8
                  "
                >
                  Why Choose MegaClick?
                </h2>

                <div
                  className="
                  grid
                  md:grid-cols-2
                  gap-6
                  "
                >

                  <div className="bg-blue-50 rounded-2xl p-6">

                    <div className="text-4xl mb-4">
                      ⚡
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      Fast Processing
                    </h3>

                    <p className="text-gray-600 leading-7">
                      Quick application process with minimum paperwork.
                    </p>

                  </div>

                  <div className="bg-green-50 rounded-2xl p-6">

                    <div className="text-4xl mb-4">
                      👨‍💼
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      Expert Assistance
                    </h3>

                    <p className="text-gray-600 leading-7">
                      Dedicated professionals guide you from start to finish.
                    </p>

                  </div>

                  <div className="bg-orange-50 rounded-2xl p-6">

                    <div className="text-4xl mb-4">
                      🔐
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      Secure Process
                    </h3>

                    <p className="text-gray-600 leading-7">
                      Your personal documents remain safe and confidential.
                    </p>

                  </div>

                  <div className="bg-purple-50 rounded-2xl p-6">

                    <div className="text-4xl mb-4">
                      🤝
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      Trusted Service
                    </h3>

                    <p className="text-gray-600 leading-7">
                      Transparent process with complete customer support.
                    </p>

                  </div>

                </div>

              </div>

            </div>



            {/* RIGHT SIDEBAR */}

            <div className="space-y-6">


                            {/* STICKY ENQUIRY CARD */}

              <div
                className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                shadow-lg
                p-8
                sticky
                top-28
                "
              >

                <h2
                  className="
                  text-2xl
                  font-bold
                  text-gray-900
                  mb-3
                  "
                >
                  Need Assistance?
                </h2>

                <p
                  className="
                  text-gray-600
                  leading-7
                  mb-8
                  "
                >
                  Our experts are ready to help you with the complete
                  <span className="font-semibold text-[#0B4EA2]">
                    {" "}
                    {service.title}
                  </span>{" "}
                  process.
                </p>

                <button
                  className="
                  w-full
                  bg-[#0B4EA2]
                  hover:bg-blue-700
                  text-white
                  rounded-xl
                  py-3.5
                  font-semibold
                  transition
                  mb-4
                  "
                >
                  Enquire Now
                </button>

                <a
                  href="tel:+919999999999"
                  className="
                  block
                  text-center
                  w-full
                  border
                  border-[#0B4EA2]
                  text-[#0B4EA2]
                  rounded-xl
                  py-3.5
                  font-semibold
                  hover:bg-blue-50
                  transition
                  mb-4
                  "
                >
                  Call Now
                </a>

                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noreferrer"
                  className="
                  block
                  text-center
                  w-full
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  rounded-xl
                  py-3.5
                  font-semibold
                  transition
                  "
                >
                  WhatsApp Now
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* FAQ */}

      <section
        className="
        py-20
        bg-white
        "
      >

        <div
          className="
          max-w-5xl
          mx-auto
          px-6
          "
        >

          <h2
            className="
            text-4xl
            font-bold
            text-center
            mb-12
            "
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">

            {

              service.faq?.map((item,index)=>(

                <div
                  key={index}
                  className="
                  bg-gray-50
                  rounded-2xl
                  border
                  border-gray-200
                  p-6
                  "
                >

                  <h3
                    className="
                    font-bold
                    text-lg
                    mb-3
                    "
                  >
                    {item.question}
                  </h3>

                  <p
                    className="
                    text-gray-600
                    leading-7
                    "
                  >
                    {item.answer}
                  </p>

                </div>

              ))

            }

          </div>

        </div>

      </section>



      {/* CTA */}

      <section
        className="
        py-20
        bg-[#0B4EA2]
        "
      >

        <div
          className="
          max-w-5xl
          mx-auto
          text-center
          px-6
          "
        >

          <h2
            className="
            text-4xl
            font-bold
            text-white
            "
          >
            Ready to Get Started?
          </h2>

          <p
            className="
            text-blue-100
            text-lg
            mt-5
            max-w-3xl
            mx-auto
            leading-8
            "
          >
            Get professional assistance from MegaClick experts and
            complete your application quickly, securely and
            hassle-free.
          </p>

          <button
            className="
            mt-10
            bg-white
            text-[#0B4EA2]
            px-8
            py-4
            rounded-xl
            font-bold
            hover:bg-gray-100
            transition
            "
          >
            Apply Now
          </button>

        </div>

      </section>

    </>

  );

};

export default ServiceDetails;
          