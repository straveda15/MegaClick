
import React, { useState } from "react";

import {
  Mail,
  MapPin,
  Rocket,
  BriefcaseBusiness,
  Send,
} from "lucide-react";

const professions = [
  "Chartered Accountant",
  "Company Secretary",
  "Advocate",
  "CMA",
  "Tax & Compliance Professional",
  "Startup Advisor",
];

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const expertise = [
  "Income Tax",
  "GST",
  "Audit",
  "ROC Filing",
  "TDS",
  "Bookkeeping",
  "CFO Services",
  "Business Advisory",
  "ITR Filing",
];

const AssociateWithUs = () => {
  const [selectedExpertise, setSelectedExpertise] = useState([]);

  const toggleExpertise = (item) => {
    if (selectedExpertise.includes(item)) {
      setSelectedExpertise(
        selectedExpertise.filter((skill) => skill !== item)
      );
    } else {
      setSelectedExpertise([...selectedExpertise, item]);
    }
  };

  return (
    <section className="w-full bg-gray-50 py-10 sm:py-14 lg:py-20 overflow-hidden">
      <div className="w-full max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-20">

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-5
            gap-6
            lg:gap-10
            items-start
          "
        >

          {/* =====================================================
              LEFT SECTION
          ====================================================== */}

          <div className="lg:col-span-2 w-full">

            <div
              className="
                w-full
                bg-[#F1F7FF]
                border
                border-gray-200
                rounded-2xl
                sm:rounded-3xl
                shadow-xl
                p-5
                sm:p-7
                lg:p-10
                min-h-0
                lg:min-h-[860px]
                transition-all
                duration-500
                hover:bg-green-50
                hover:shadow-2xl
                lg:hover:-translate-y-2
              "
            >

              {/* Badge */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  sm:px-5
                  py-2
                  rounded-full
                  bg-blue-800
                  text-white
                  font-semibold
                  text-xs
                  sm:text-sm
                  mb-5
                  sm:mb-6
                "
              >
                <BriefcaseBusiness size={16} />
                Contact Us
              </div>


              {/* Heading */}

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  lg:text-4xl
                  font-bold
                  text-gray-900
                  leading-snug
                "
              >
                We are currently onboarding a limited number of
                professionals as part of{" "}

                <span className="text-[#0B4EA2]">
                  Mega
                </span>

                <span className="text-[#0A8F55]">
                  Click
                </span>

                's founding network.
              </h2>


              {/* Description */}

              <p
                className="
                  mt-4
                  sm:mt-5
                  text-sm
                  sm:text-base
                  text-gray-600
                  leading-7
                "
              >
                If you are interested in being part of
                MegaClick's founding network, share your details
                and our team will connect with you.
              </p>


              {/* =====================================================
                  CONTACT DETAILS
              ====================================================== */}

              <div className="mt-7 sm:mt-8 space-y-5 sm:space-y-6">

                {/* Email */}

                <div className="flex items-start gap-3 sm:gap-4">

                  <div
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      shrink-0
                      rounded-xl
                      bg-white
                      border
                      border-gray-200
                      flex
                      items-center
                      justify-center
                      text-green-600
                    "
                  >
                    <Mail size={17} />
                  </div>

                  <div className="min-w-0">

                    <strong className="block text-gray-900">
                      Email
                    </strong>

                    <span
                      className="
                        block
                        mt-1
                        text-sm
                        sm:text-base
                        text-gray-600
                        break-all
                      "
                    >
                      megaclickofficial@gmail.com
                    </span>

                  </div>

                </div>


                {/* Coverage */}

                <div className="flex items-start gap-3 sm:gap-4">

                  <div
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      shrink-0
                      rounded-xl
                      bg-white
                      border
                      border-gray-200
                      flex
                      items-center
                      justify-center
                      text-green-600
                    "
                  >
                    <MapPin size={17} />
                  </div>

                  <div className="min-w-0">

                    <strong className="block text-gray-900">
                      Coverage
                    </strong>

                    <span className="block mt-1 text-sm sm:text-base text-gray-600">
                      Building India-wide professional network
                    </span>

                  </div>

                </div>


                {/* Status */}

                <div className="flex items-start gap-3 sm:gap-4">

                  <div
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      shrink-0
                      rounded-xl
                      bg-white
                      border
                      border-gray-200
                      flex
                      items-center
                      justify-center
                      text-green-600
                    "
                  >
                    <Rocket size={17} />
                  </div>

                  <div className="min-w-0">

                    <strong className="block text-gray-900">
                      Status
                    </strong>

                    <span className="block mt-1 text-sm sm:text-base text-gray-600">
                      The MegaClick platform is currently being built
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =====================================================
              RIGHT FORM SECTION
          ====================================================== */}

          <div className="lg:col-span-3 w-full min-w-0">

            <div
              className="
                w-full
                bg-white
                border
                border-gray-200
                rounded-2xl
                sm:rounded-3xl
                shadow-xl
                p-5
                sm:p-7
                lg:p-10
              "
            >

              <form
                action="send_contact.php"
                method="post"
                aria-label="MegaClick early professional network contact form"
                id="contactForm"
              >

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                    sm:gap-6
                  "
                >

                  {/* =====================================================
                      NAME
                  ====================================================== */}

                  <div className="w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="full_name"
                      required
                      placeholder="Enter your name"
                      className="
                        w-full
                        max-w-full
                        h-12
                        sm:h-14
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        text-sm
                        outline-none
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    />

                  </div>


                  {/* =====================================================
                      MOBILE
                  ====================================================== */}

                  <div className="w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Mobile <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Enter your mobile number"
                      className="
                        w-full
                        max-w-full
                        h-12
                        sm:h-14
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        text-sm
                        outline-none
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    />

                  </div>


                  {/* =====================================================
                      EMAIL
                  ====================================================== */}

                  <div className="w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Email <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter your email address"
                      className="
                        w-full
                        max-w-full
                        h-12
                        sm:h-14
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        text-sm
                        outline-none
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    />

                  </div>


                  {/* =====================================================
                      PROFESSION
                  ====================================================== */}

                  <div className="w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Select Profession{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="profession"
                      required
                      className="
                        w-full
                        max-w-full
                        h-12
                        sm:h-14
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        text-sm
                        outline-none
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    >

                      <option value="">
                        Select Profession
                      </option>

                      {professions.map((profession) => (
                        <option
                          key={profession}
                          value={profession}
                        >
                          {profession}
                        </option>
                      ))}

                    </select>

                  </div>


                  {/* =====================================================
                      FIRM NAME
                  ====================================================== */}

                  <div className="w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Firm Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="firm_name"
                      required
                      placeholder="Enter your firm name"
                      className="
                        w-full
                        max-w-full
                        h-12
                        sm:h-14
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        text-sm
                        outline-none
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    />

                  </div>


                  {/* =====================================================
                      EXPERIENCE
                  ====================================================== */}

                  <div className="w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Years of Experience{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="experience_years"
                      required
                      placeholder="Enter years of experience"
                      className="
                        w-full
                        max-w-full
                        h-12
                        sm:h-14
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        text-sm
                        outline-none
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    />

                  </div>


                  {/* =====================================================
                      LINKEDIN
                  ====================================================== */}

                  <div className="w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      LinkedIn Profile
                    </label>

                    <input
                      type="url"
                      name="linkedin_profile"
                      placeholder="Enter LinkedIn profile URL"
                      className="
                        w-full
                        max-w-full
                        h-12
                        sm:h-14
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        text-sm
                        outline-none
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    />

                  </div>


                  {/* =====================================================
                      WEBSITE
                  ====================================================== */}

                  <div className="w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      Website
                    </label>

                    <input
                      type="url"
                      name="website"
                      placeholder="Enter your website URL"
                      className="
                        w-full
                        max-w-full
                        h-12
                        sm:h-14
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        text-sm
                        outline-none
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    />

                  </div>


                  {/* =====================================================
                      PINCODE / CITY / STATE
                  ====================================================== */}

                  <div
                    className="
                      col-span-1
                      md:col-span-2
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      md:grid-cols-3
                      gap-5
                      sm:gap-6
                    "
                  >

                    {/* Pincode */}

                    <div className="w-full">

                      <label
                        className="
                          block
                          mb-2
                          text-sm
                          font-semibold
                          text-gray-800
                        "
                      >
                        Pincode{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        required
                        placeholder="6-digit pincode"
                        maxLength="6"
                        inputMode="numeric"
                        className="
                          w-full
                          max-w-full
                          h-12
                          sm:h-14
                          rounded-xl
                          bg-gray-50
                          border
                          border-gray-200
                          px-4
                          text-sm
                          outline-none
                          focus:bg-white
                          focus:border-[#0B4EA2]
                          focus:ring-4
                          focus:ring-blue-100
                          transition
                        "
                      />

                    </div>


                    {/* City */}

                    <div className="w-full">

                      <label
                        className="
                          block
                          mb-2
                          text-sm
                          font-semibold
                          text-gray-800
                        "
                      >
                        City <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Enter city"
                        className="
                          w-full
                          max-w-full
                          h-12
                          sm:h-14
                          rounded-xl
                          bg-gray-50
                          border
                          border-gray-200
                          px-4
                          text-sm
                          outline-none
                          focus:bg-white
                          focus:border-[#0B4EA2]
                          focus:ring-4
                          focus:ring-blue-100
                          transition
                        "
                      />

                    </div>


                    {/* State */}

                    <div className="w-full sm:col-span-2 md:col-span-1">

                      <label
                        className="
                          block
                          mb-2
                          text-sm
                          font-semibold
                          text-gray-800
                        "
                      >
                        State <span className="text-red-500">*</span>
                      </label>

                      <select
                        name="state"
                        required
                        className="
                          w-full
                          max-w-full
                          h-12
                          sm:h-14
                          rounded-xl
                          bg-gray-50
                          border
                          border-gray-200
                          px-4
                          text-sm
                          outline-none
                          focus:bg-white
                          focus:border-[#0B4EA2]
                          focus:ring-4
                          focus:ring-blue-100
                          transition
                        "
                      >

                        <option value="">
                          Select State
                        </option>

                        {states.map((state) => (
                          <option
                            key={state}
                            value={state}
                          >
                            {state}
                          </option>
                        ))}

                      </select>

                    </div>

                  </div>


                  {/* =====================================================
                      MESSAGE
                  ====================================================== */}

                  <div className="col-span-1 md:col-span-2 w-full">

                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >
                      What Challenge Do You Believe MegaClick
                      Should Solve?{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      name="message"
                      required
                      placeholder="Tell us what challenge MegaClick should solve"
                      className="
                        w-full
                        max-w-full
                        min-h-[130px]
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-200
                        px-4
                        py-4
                        text-sm
                        outline-none
                        resize-y
                        focus:bg-white
                        focus:border-[#0B4EA2]
                        focus:ring-4
                        focus:ring-blue-100
                        transition
                      "
                    />

                  </div>


                  {/* =====================================================
                      BUTTON
                  ====================================================== */}

                  <div className="col-span-1 md:col-span-2 w-full">

                    <button
                      type="submit"
                      id="contactSubmitBtn"
                      className="
                        w-full
                        min-h-12
                        sm:h-14
                        px-5
                        rounded-xl
                        bg-[#0A8F55]
                        text-white
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-3
                        transition-all
                        duration-300
                        hover:bg-[#087A48]
                        hover:-translate-y-0.5
                        hover:shadow-lg
                        active:translate-y-0
                      "
                    >

                      <span id="contactSubmitText">
                        Submit Interest
                      </span>

                      <Send size={18} />

                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AssociateWithUs;
