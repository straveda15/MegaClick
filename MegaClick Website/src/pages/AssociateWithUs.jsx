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

const AssociateWithUs = () => {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // Base style for standard text inputs
  const inputBaseStyle = `
    w-full
    max-w-full
    h-12
    sm:h-14
    rounded-xl
    bg-gray-50
    border
    border-gray-300
    px-4
    text-sm
    sm:text-base
    text-gray-900
    font-semibold
    placeholder:text-gray-400
    placeholder:font-normal
    outline-none
    focus:bg-white
    focus:border-[#0B4EA2]
    focus:ring-4
    focus:ring-blue-100
    transition
  `;

  // Custom styling for Select boxes to force high contrast text
  const getSelectStyle = (value) => `
    w-full
    max-w-full
    h-12
    sm:h-14
    rounded-xl
    border
    px-4
    pr-10
    text-sm
    sm:text-base
    outline-none
    transition
    cursor-pointer
    appearance-none
    bg-no-repeat
    bg-[right_1rem_center]
    bg-[length:1.25rem_1.25rem]
    ${
      value
        ? "bg-white text-gray-900 font-bold border-gray-400 shadow-sm"
        : "bg-gray-50 text-gray-400 font-normal border-gray-300"
    }
    focus:bg-white
    focus:text-gray-900
    focus:border-[#0B4EA2]
    focus:ring-4
    focus:ring-blue-100
  `;

  const dropdownArrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`;

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
                      className={inputBaseStyle}
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
                      className={inputBaseStyle}
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
                      className={inputBaseStyle}
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
                      value={selectedProfession}
                      onChange={(e) => setSelectedProfession(e.target.value)}
                      className={getSelectStyle(selectedProfession)}
                      style={{ backgroundImage: dropdownArrowSvg }}
                    >

                      <option value="" className="text-gray-400 bg-white">
                        Select Profession
                      </option>

                      {professions.map((profession) => (
                        <option
                          key={profession}
                          value={profession}
                          className="text-gray-900 font-bold bg-white py-2"
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
                      className={inputBaseStyle}
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
                      className={inputBaseStyle}
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
                      className={inputBaseStyle}
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
                      className={inputBaseStyle}
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
                        className={inputBaseStyle}
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
                        className={inputBaseStyle}
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
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className={getSelectStyle(selectedState)}
                        style={{ backgroundImage: dropdownArrowSvg }}
                      >

                        <option value="" className="text-gray-400 bg-white">
                          Select State
                        </option>

                        {states.map((state) => (
                          <option
                            key={state}
                            value={state}
                            className="text-gray-900 font-bold bg-white py-2"
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
                        border-gray-300
                        px-4
                        py-4
                        text-sm
                        sm:text-base
                        text-gray-900
                        font-semibold
                        placeholder:text-gray-400
                        placeholder:font-normal
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