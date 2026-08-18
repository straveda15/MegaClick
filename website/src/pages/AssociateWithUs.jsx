import React, { useState } from "react";

import {
  Mail,
  MapPin,
  Rocket,
  BriefcaseBusiness,
  Send,
  Plus,
  X,
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

const expertiseOptions = [
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
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [expertiseTags, setExpertiseTags] = useState(expertiseOptions);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [showCustomExpertiseInput, setShowCustomExpertiseInput] = useState(false);
  const [customExpertise, setCustomExpertise] = useState("");

  const toggleExpertise = (tag) => {
    setSelectedExpertise((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const addCustomExpertise = () => {
    const value = customExpertise.trim();
    if (value && !expertiseTags.includes(value)) {
      setExpertiseTags((prev) => [...prev, value]);
      setSelectedExpertise((prev) => [...prev, value]);
    }
    setCustomExpertise("");
    setShowCustomExpertiseInput(false);
  };

  // Base style for text inputs (Bold & Inter font)
  const inputBaseStyle = `
    w-full
    max-w-full
    h-12
    sm:h-14
    rounded-2xl
    bg-white
    border
    border-gray-200
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

  // Custom styling for Select boxes (Bold & Inter font)
  const getSelectStyle = (value) => `
    w-full
    max-w-full
    h-12
    sm:h-14
    rounded-2xl
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
    bg-white
    border-gray-200
    ${value ? "text-gray-900 font-semibold" : "text-gray-400 font-normal"}
    focus:bg-white
    focus:text-gray-900
    focus:border-[#0B4EA2]
    focus:ring-4
    focus:ring-blue-100
  `;

  const dropdownArrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`;

  return (
    <section className="w-full bg-gray-50 pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-14 lg:pb-20 overflow-hidden font-['Inter',sans-serif]">
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
                bg-gradient-to-b
                from-blue-50
                to-green-50
                border
                border-gray-200
                rounded-2xl
                sm:rounded-[28px]
                p-5
                sm:p-7
                lg:p-10
                min-h-0
                lg:min-h-[860px]
                transition-all
                duration-500
                lg:hover:-translate-y-2
              "
            >

              {/* Heading (Hedvig Letters Serif) */}
              <h2
                className="
                  text-xl
                  sm:text-2xl
                  lg:text-3xl
                  font-normal
                  text-[#0B2545]
                  leading-snug
                "
                style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif' }}
              >
                We are currently onboarding a limited number of
                professionals as part of{" "}
                <span className="text-[#0B4EA2]">Mega</span>
                <span className="text-[#0A8F55]">Click</span>
                's founding network.
              </h2>

              {/* Description (Inter) */}
              <p
                className="
                  mt-4
                  sm:mt-5
                  text-sm
                  sm:text-base
                  text-gray-600
                  font-light
                  leading-relaxed
                "
              >
                If you are interested in being part of
                MegaClick's founding network, share your details
                and our team will connect with you.
              </p>

              {/* Contact Details List */}
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
                    <strong className="block text-gray-900 font-semibold text-sm sm:text-base">
                      Email
                    </strong>
                    <span className="block mt-0.5 text-sm text-gray-600 font-normal break-all">
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
                    <strong className="block text-gray-900 font-semibold text-sm sm:text-base">
                      Coverage
                    </strong>
                    <span className="block mt-0.5 text-sm text-gray-600 font-normal">
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
                    <strong className="block text-gray-900 font-semibold text-sm sm:text-base">
                      Status
                    </strong>
                    <span className="block mt-0.5 text-sm text-gray-600 font-normal">
                      The MegaClick platform is currently being built
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* =====================================================
              RIGHT FORM SECTION (BOLD LABELS & VALUES)
          ====================================================== */}
          <div className="lg:col-span-3 w-full min-w-0">
            <div
              className="
                w-full
                bg-white
                border
                border-gray-200
                rounded-2xl
                sm:rounded-[28px]
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

                  {/* Name */}
                  <div className="w-full">
                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-bold
                        text-gray-900
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

                  {/* Mobile */}
                  <div className="w-full">
                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-bold
                        text-gray-900
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

                  {/* Email */}
                  <div className="w-full">
                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-bold
                        text-gray-900
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

                  {/* Profession */}
                  <div className="w-full">
                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-bold
                        text-gray-900
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
                      <option value="" className="text-gray-400 font-normal bg-white">
                        Select Profession
                      </option>
                      {professions.map((profession) => (
                        <option
                          key={profession}
                          value={profession}
                          className="text-gray-900 font-semibold bg-white py-2"
                        >
                          {profession}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Firm Name */}
                  <div className="w-full">
                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-bold
                        text-gray-900
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

                  {/* Experience */}
                  <div className="w-full">
                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-bold
                        text-gray-900
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

                  {/* LinkedIn */}
                  <div className="w-full">
                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-bold
                        text-gray-900
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

                  {/* Website */}
                  <div className="w-full">
                    <label
                      className="
                        block
                        mb-2
                        text-sm
                        font-bold
                        text-gray-900
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

                  {/* Pincode / City / State */}
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
                          font-bold
                          text-gray-900
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
                          font-bold
                          text-gray-900
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
                          font-bold
                          text-gray-900
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
                        <option value="" className="text-gray-400 font-normal bg-white">
                          Select State
                        </option>
                        {states.map((state) => (
                          <option
                            key={state}
                            value={state}
                            className="text-gray-900 font-semibold bg-white py-2"
                          >
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Area of Expertise */}
                  <div className="col-span-1 md:col-span-2 w-full">
                    <label
                      className="
                        block
                        mb-3
                        text-sm
                        font-bold
                        text-gray-900
                      "
                    >
                      Area of Expertise <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="hidden"
                      name="expertise"
                      value={selectedExpertise.join(", ")}
                      required
                    />

                    <div
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50/60
                        p-4
                        sm:p-5
                        flex
                        flex-wrap
                        gap-2.5
                        sm:gap-3
                      "
                    >
                      {expertiseTags.map((tag) => {
                        const isSelected = selectedExpertise.includes(tag);

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleExpertise(tag)}
                            aria-pressed={isSelected}
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              px-3.5
                              py-1.5
                              rounded-full
                              border
                              text-xs
                              font-bold
                              transition-all
                              duration-200
                              cursor-pointer
                              ${
                                isSelected
                                  ? "bg-gradient-to-r from-[#0B4EA2] to-[#0A8F55] border-transparent text-white shadow-sm"
                                  : "bg-white border-gray-300 text-gray-800 hover:border-[#0B4EA2] hover:text-[#0B4EA2]"
                              }
                            `}
                          >
                            {tag}
                            {isSelected && <X size={14} />}
                          </button>
                        );
                      })}

                      {showCustomExpertiseInput ? (
                        <input
                          type="text"
                          autoFocus
                          value={customExpertise}
                          onChange={(e) => setCustomExpertise(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomExpertise();
                            }
                          }}
                          onBlur={addCustomExpertise}
                          placeholder="Type & press Enter"
                          className="
                            px-3.5
                            py-1.5
                            rounded-full
                            border
                            border-[#0B4EA2]
                            text-xs
                            font-semibold
                            text-gray-900
                            placeholder:text-gray-400
                            placeholder:font-normal
                            outline-none
                            w-40
                          "
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCustomExpertiseInput(true)}
                          aria-label="Add custom area of expertise"
                          className="
                            w-9
                            h-9
                            flex
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-gray-300
                            text-gray-600
                            hover:border-[#0B4EA2]
                            hover:text-[#0B4EA2]
                            transition-colors
                            cursor-pointer
                          "
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
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
                        font-bold
                        text-sm
                        sm:text-base
                        flex
                        items-center
                        justify-center
                        gap-3
                        transition-all
                        duration-300
                        hover:bg-[#087A48]
                        hover:-translate-y-0.5
                        hover:shadow-md
                        active:translate-y-0
                        cursor-pointer
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