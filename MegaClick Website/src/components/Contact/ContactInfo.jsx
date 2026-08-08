
import React from "react";

import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";

const ContactInfo = () => {
  return (
    <section
      className="
        py-10
        sm:py-14
        lg:py-20
        bg-white
        overflow-hidden
      "
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          lg:px-16
          xl:px-24
        "
      >

        {/* ================= HEADING ================= */}

        <div
          className="
            mb-8
            sm:mb-10
            lg:mb-14
          "
        >
          <span
            className="
              inline-flex
              items-center
              rounded-full
              bg-[#0B4EA2]
              px-4
              sm:px-5
              py-2
              text-xs
              sm:text-sm
              font-semibold
              text-white
            "
          >
            CONTACT INFORMATION
          </span>

          <h2
            className="
              mt-4
              sm:mt-5
              text-2xl
              sm:text-3xl
              lg:text-4xl
              font-extrabold
              leading-tight
              bg-gradient-to-r
              from-[#0B4EA2]
              via-blue-600
              to-green-600
              bg-clip-text
              text-transparent
            "
          >
            Get In Touch With Us
          </h2>

          <p
            className="
              mt-4
              sm:mt-5
              max-w-3xl
              text-base
              sm:text-lg
              leading-7
              sm:leading-8
              text-gray-600
            "
          >
            Have questions or need assistance? Reach out to our experts.
            We're always ready to help you with legal, business,
            and financial solutions.
          </p>
        </div>


        {/* ================= MAIN GRID ================= */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-6
            sm:gap-8
            lg:gap-10
            items-stretch
          "
        >

          {/* ================= MAP CARD ================= */}

          <div
            className="
              lg:col-span-2
              relative
              overflow-hidden
              rounded-2xl
              sm:rounded-[28px]
              lg:rounded-[32px]
              border
              border-gray-200
              bg-white
              shadow-[0_15px_45px_rgba(0,0,0,0.08)]
              hover:shadow-2xl
              transition-all
              duration-500
            "
          >

            {/* Top Line */}

            <div
              className="
                absolute
                top-0
                left-0
                h-1
                w-full
                bg-gradient-to-r
                from-[#0B4EA2]
                to-green-500
              "
            />


            {/* ================= MAP HEADER ================= */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                p-5
                sm:p-6
                lg:p-8
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  sm:gap-5
                  min-w-0
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    sm:w-14
                    sm:h-14
                    lg:w-16
                    lg:h-16
                    flex-shrink-0
                    rounded-xl
                    sm:rounded-2xl
                    bg-blue-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <MapPin
                    size={24}
                    className="
                      sm:w-7
                      sm:h-7
                      text-[#0B4EA2]
                    "
                  />
                </div>

                <div className="min-w-0">

                  <h3
                    className="
                      text-lg
                      sm:text-xl
                      lg:text-2xl
                      font-bold
                      text-gray-900
                    "
                  >
                    Visit Our Office
                  </h3>

                  <p
                    className="
                      text-sm
                      sm:text-base
                      text-gray-500
                      mt-1
                    "
                  >
                    We'd love to meet you.
                  </p>

                </div>

              </div>


              <ArrowUpRight
                size={22}
                className="
                  sm:w-6
                  sm:h-6
                  flex-shrink-0
                  text-gray-300
                "
              />

            </div>


            {/* ================= GOOGLE MAP ================= */}

            <div
              className="
                px-4
                sm:px-6
                lg:px-8
              "
            >
              <div
                className="
                  overflow-hidden
                  rounded-xl
                  sm:rounded-2xl
                  border
                  border-gray-200
                "
              >

                <iframe
                  title="MegaClick Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.917570480964!2d73.7563732!3d20.011974!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb28d1dd624d%3A0xe806e01c2d79c79f!2sMegaClick%20Properties!5e0!3m2!1sen!2sin!4v1785864099343!5m2!1sen!2sin"
                  width="100%"
                  height="320"
                  style={{
                    border: 0,
                  }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="
                    h-[240px]
                    sm:h-[300px]
                    lg:h-[320px]
                  "
                />

              </div>
            </div>


            {/* ================= ADDRESS ================= */}

            <div
              className="
                p-5
                sm:p-6
                lg:p-8
              "
            >

              <h4
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-gray-900
                "
              >
                MegaClick Office
              </h4>

              <p
                className="
                  mt-3
                  sm:mt-4
                  text-sm
                  sm:text-base
                  leading-7
                  sm:leading-8
                  text-gray-600
                "
              >
                4th Floor, Tristar Complex,
                <br />
                Above Canara Bank,
                <br />
                Beside Reliance Digital,
                <br />
                Jehan Circle,
                <br />
                Gangapur Road,
                <br />
                Nashik - 422005
              </p>

              <span
                className="
                  inline-flex
                  mt-4
                  sm:mt-6
                  rounded-full
                  bg-blue-100
                  px-4
                  sm:px-5
                  py-2
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-[#0B4EA2]
                "
              >
                Mon - Sat • 9:00 AM - 7:00 PM
              </span>

            </div>

          </div>


          {/* ================= RIGHT SIDE CARDS ================= */}

          <div
            className="
              flex
              flex-col
              justify-center
              gap-5
              sm:gap-6
              lg:gap-8
            "
          >

            {/* ================= CALL CARD ================= */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                sm:rounded-[28px]
                lg:rounded-[32px]
                bg-white
                border
                border-gray-200
                p-5
                sm:p-6
                lg:p-8
                shadow-[0_15px_45px_rgba(0,0,0,0.08)]
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-500
              "
            >

              {/* Glow */}

              <div
                className="
                  absolute
                  -right-16
                  -top-16
                  w-40
                  h-40
                  sm:w-48
                  sm:h-48
                  rounded-full
                  bg-green-100
                  blur-3xl
                "
              />


              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    sm:gap-5
                    min-w-0
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      sm:w-14
                      sm:h-14
                      lg:w-16
                      lg:h-16
                      flex-shrink-0
                      rounded-xl
                      sm:rounded-2xl
                      bg-green-100
                      flex
                      items-center
                      justify-center
                      group-hover:bg-green-600
                      transition-all
                      duration-300
                    "
                  >

                    <Phone
                      size={24}
                      className="
                        sm:w-7
                        sm:h-7
                        text-green-600
                        group-hover:text-white
                        transition
                      "
                    />

                  </div>


                  <div className="min-w-0">

                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Call Us
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        sm:text-base
                        text-gray-600
                      "
                    >
                      +91 99216 11911
                    </p>

                  </div>

                </div>


                <ArrowUpRight
                  size={22}
                  className="
                    flex-shrink-0
                    text-gray-300
                    group-hover:text-green-600
                    group-hover:rotate-45
                    transition
                  "
                />

              </div>


              <a
                href="tel:+919921611911"
                className="
                  mt-5
                  sm:mt-7
                  w-full
                  py-3
                  sm:py-3.5
                  rounded-xl
                  bg-green-600
                  text-white
                  text-sm
                  sm:text-base
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:bg-green-700
                  transition
                "
              >
                <Phone size={17} />
                Call Now
              </a>

            </div>


            {/* ================= EMAIL CARD ================= */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                sm:rounded-[28px]
                lg:rounded-[32px]
                bg-white
                border
                border-gray-200
                p-5
                sm:p-6
                lg:p-8
                shadow-[0_15px_45px_rgba(0,0,0,0.08)]
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-500
              "
            >

              {/* Glow */}

              <div
                className="
                  absolute
                  -right-16
                  -top-16
                  w-40
                  h-40
                  sm:w-48
                  sm:h-48
                  rounded-full
                  bg-blue-100
                  blur-3xl
                "
              />


              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    sm:gap-5
                    min-w-0
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      sm:w-14
                      sm:h-14
                      lg:w-16
                      lg:h-16
                      flex-shrink-0
                      rounded-xl
                      sm:rounded-2xl
                      bg-blue-100
                      flex
                      items-center
                      justify-center
                      group-hover:bg-[#0B4EA2]
                      transition
                    "
                  >

                    <Mail
                      size={24}
                      className="
                        sm:w-7
                        sm:h-7
                        text-[#0B4EA2]
                        group-hover:text-white
                        transition
                      "
                    />

                  </div>


                  <div className="min-w-0">

                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Email Us
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        sm:text-base
                        text-gray-600
                        break-all
                      "
                    >
                      megaclickofficial@gmail.com
                    </p>

                  </div>

                </div>


                <ArrowUpRight
                  size={22}
                  className="
                    flex-shrink-0
                    text-gray-300
                    group-hover:text-[#0B4EA2]
                    group-hover:rotate-45
                    transition
                  "
                />

              </div>


              <a
                href="mailto:megaclickofficial@gmail.com"
                className="
                  mt-5
                  sm:mt-7
                  w-full
                  py-3
                  sm:py-3.5
                  rounded-xl
                  bg-[#0B4EA2]
                  text-white
                  text-sm
                  sm:text-base
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:bg-blue-900
                  transition
                "
              >
                <Mail size={17} />
                Send Email
              </a>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
