import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Rocket,
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

  // Scaled Input Styles: 1440px -> 1920px -> 3840px
  const inputBaseStyle = `
    w-full
    max-w-full
    h-12
    sm:h-14
    min-[1920px]:h-16
    min-[3840px]:h-24
    rounded-2xl
    min-[3840px]:rounded-3xl
    bg-white
    border
    border-gray-200
    min-[3840px]:border-2
    px-4
    min-[1920px]:px-5
    min-[3840px]:px-8
    text-sm
    sm:text-base
    min-[1920px]:text-lg
    min-[3840px]:text-2xl
    text-gray-900
    font-semibold
    placeholder:text-gray-400
    placeholder:font-normal
    outline-none
    focus:bg-white
    focus:border-[#0B4EA2]
    focus:ring-4
    min-[3840px]:focus:ring-8
    focus:ring-blue-100
    transition-all
  `;

  // Scaled Select Styles: 1440px -> 1920px -> 3840px
  const getSelectStyle = (value) => `
    w-full
    max-w-full
    h-12
    sm:h-14
    min-[1920px]:h-16
    min-[3840px]:h-24
    rounded-2xl
    min-[3840px]:rounded-3xl
    border
    border-gray-200
    min-[3840px]:border-2
    px-4
    min-[1920px]:px-5
    min-[3840px]:px-8
    pr-10
    min-[1920px]:pr-12
    min-[3840px]:pr-16
    text-sm
    sm:text-base
    min-[1920px]:text-lg
    min-[3840px]:text-2xl
    outline-none
    transition-all
    cursor-pointer
    appearance-none
    bg-no-repeat
    bg-[right_1rem_center]
    min-[3840px]:bg-[right_2rem_center]
    bg-[length:1.25rem_1.25rem]
    min-[1920px]:bg-[length:1.5rem_1.5rem]
    min-[3840px]:bg-[length:2.5rem_2.5rem]
    bg-white
    ${value ? "text-gray-900 font-semibold" : "text-gray-400 font-normal"}
    focus:bg-white
    focus:text-gray-900
    focus:border-[#0B4EA2]
    focus:ring-4
    min-[3840px]:focus:ring-8
    focus:ring-blue-100
  `;

  const dropdownArrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`;

  return (
    <section className="w-full bg-gray-50 pt-8 sm:pt-10 min-[1440px]:pt-12 min-[1920px]:pt-16 min-[3840px]:pt-28 pb-12 sm:pb-16 min-[1440px]:pb-20 min-[1920px]:pb-24 min-[3840px]:pb-36 overflow-hidden font-['Inter',sans-serif]">
      {/* Dynamic Container Width: 1440px -> 1920px -> 3840px */}
      <div className="w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 min-[1920px]:gap-12 min-[3840px]:gap-20 items-stretch">
          
          {/* =====================================================
              LEFT SECTION
          ====================================================== */}
          <div className="lg:col-span-2 w-full flex">
            <div
              className="
                w-full
                flex
                flex-col
                justify-between
                bg-gradient-to-b
                from-blue-50
                to-green-50
                border
                border-gray-200
                min-[3840px]:border-2
                rounded-2xl
                sm:rounded-[28px]
                min-[3840px]:rounded-[44px]
                p-6
                sm:p-8
                min-[1440px]:p-10
                min-[1920px]:p-12
                min-[3840px]:p-20
                transition-all
                duration-500
                lg:hover:-translate-y-2
              "
            >
              <div>
                {/* Heading */}
                <h2
                  className="
                    text-xl
                    sm:text-2xl
                    min-[1440px]:text-3xl
                    min-[1920px]:text-4xl
                    min-[3840px]:text-6xl
                    font-normal
                    text-[#0B2545]
                    leading-snug
                    min-[3840px]:leading-tight
                  "
                  style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif' }}
                >
                  We are currently onboarding a limited number of
                  professionals as part of{" "}
                  <span className="text-[#0B4EA2]">Mega</span>
                  <span className="text-[#0A8F55]">Click</span>
                  's founding network.
                </h2>

                {/* Description */}
                <p
                  className="
                    mt-4
                    sm:mt-5
                    min-[1920px]:mt-6
                    min-[3840px]:mt-10
                    text-sm
                    sm:text-base
                    min-[1920px]:text-xl
                    min-[3840px]:text-3xl
                    text-gray-600
                    font-light
                    leading-relaxed
                  "
                >
                  If you are interested in being part of MegaClick's founding
                  network, share your details and our team will connect with
                  you.
                </p>

                {/* Contact Details List */}
                <div className="mt-8 sm:mt-10 min-[1920px]:mt-12 min-[3840px]:mt-20 space-y-6 sm:space-y-7 min-[1920px]:space-y-8 min-[3840px]:space-y-14">
                  {/* Email */}
                  <div className="flex items-start gap-3 sm:gap-4 min-[1920px]:gap-5 min-[3840px]:gap-8">
                    <div
                      className="
                        w-10
                        h-10
                        sm:w-12
                        sm:h-12
                        min-[1920px]:w-14
                        min-[1920px]:h-14
                        min-[3840px]:w-24
                        min-[3840px]:h-24
                        shrink-0
                        rounded-xl
                        min-[3840px]:rounded-2xl
                        bg-white
                        border
                        border-gray-200
                        min-[3840px]:border-2
                        flex
                        items-center
                        justify-center
                        text-green-600
                        shadow-sm
                      "
                    >
                      <Mail className="w-5 h-5 min-[1920px]:w-6 min-[1920px]:h-6 min-[3840px]:w-11 min-[3840px]:h-11" />
                    </div>

                    <div className="min-w-0">
                      <strong className="block text-gray-900 font-semibold text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl">
                        Email
                      </strong>
                      <span className="block mt-0.5 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-600 font-normal break-all">
                        megaclickofficial@gmail.com
                      </span>
                    </div>
                  </div>

                  {/* Coverage */}
                  <div className="flex items-start gap-3 sm:gap-4 min-[1920px]:gap-5 min-[3840px]:gap-8">
                    <div
                      className="
                        w-10
                        h-10
                        sm:w-12
                        sm:h-12
                        min-[1920px]:w-14
                        min-[1920px]:h-14
                        min-[3840px]:w-24
                        min-[3840px]:h-24
                        shrink-0
                        rounded-xl
                        min-[3840px]:rounded-2xl
                        bg-white
                        border
                        border-gray-200
                        min-[3840px]:border-2
                        flex
                        items-center
                        justify-center
                        text-green-600
                        shadow-sm
                      "
                    >
                      <MapPin className="w-5 h-5 min-[1920px]:w-6 min-[1920px]:h-6 min-[3840px]:w-11 min-[3840px]:h-11" />
                    </div>

                    <div className="min-w-0">
                      <strong className="block text-gray-900 font-semibold text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl">
                        Coverage
                      </strong>
                      <span className="block mt-0.5 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-600 font-normal">
                        Building India-wide professional network
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start gap-3 sm:gap-4 min-[1920px]:gap-5 min-[3840px]:gap-8">
                    <div
                      className="
                        w-10
                        h-10
                        sm:w-12
                        sm:h-12
                        min-[1920px]:w-14
                        min-[1920px]:h-14
                        min-[3840px]:w-24
                        min-[3840px]:h-24
                        shrink-0
                        rounded-xl
                        min-[3840px]:rounded-2xl
                        bg-white
                        border
                        border-gray-200
                        min-[3840px]:border-2
                        flex
                        items-center
                        justify-center
                        text-green-600
                        shadow-sm
                      "
                    >
                      <Rocket className="w-5 h-5 min-[1920px]:w-6 min-[1920px]:h-6 min-[3840px]:w-11 min-[3840px]:h-11" />
                    </div>

                    <div className="min-w-0">
                      <strong className="block text-gray-900 font-semibold text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl">
                        Status
                      </strong>
                      <span className="block mt-0.5 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl text-gray-600 font-normal">
                        The MegaClick platform is currently being built
                      </span>
                    </div>
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
                min-[3840px]:border-2
                rounded-2xl
                sm:rounded-[28px]
                min-[3840px]:rounded-[44px]
                p-6
                sm:p-8
                min-[1440px]:p-10
                min-[1920px]:p-12
                min-[3840px]:p-20
                shadow-sm
              "
            >
              <form
                action="send_contact.php"
                method="post"
                aria-label="MegaClick early professional network contact form"
                id="contactForm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 min-[1920px]:gap-7 min-[3840px]:gap-12">
                  
                  {/* Name */}
                  <div className="w-full">
                    <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                    <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                    <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                    <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
                      Select Profession <span className="text-red-500">*</span>
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
                    <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                    <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
                      Years of Experience <span className="text-red-500">*</span>
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
                    <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                    <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 min-[1920px]:gap-7 min-[3840px]:gap-12">
                    {/* Pincode */}
                    <div className="w-full">
                      <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
                        Pincode <span className="text-red-500">*</span>
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
                      <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                      <label className="block mb-2 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                    <label className="block mb-3 text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl font-bold text-gray-900">
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
                        min-[3840px]:rounded-3xl
                        border
                        border-gray-200
                        min-[3840px]:border-2
                        bg-gray-50/60
                        p-4
                        sm:p-5
                        min-[1920px]:p-6
                        min-[3840px]:p-10
                        flex
                        flex-wrap
                        gap-2.5
                        sm:gap-3
                        min-[1920px]:gap-4
                        min-[3840px]:gap-6
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
                              min-[3840px]:gap-3
                              px-3.5
                              py-1.5
                              min-[1920px]:px-5
                              min-[1920px]:py-2.5
                              min-[3840px]:px-8
                              min-[3840px]:py-4
                              rounded-full
                              border
                              min-[3840px]:border-2
                              text-xs
                              sm:text-sm
                              min-[1920px]:text-base
                              min-[3840px]:text-2xl
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
                            {isSelected && <X className="w-3.5 h-3.5 min-[1920px]:w-4 min-[1920px]:h-4 min-[3840px]:w-7 min-[3840px]:h-7" />}
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
                            min-[1920px]:px-5
                            min-[1920px]:py-2.5
                            min-[3840px]:px-8
                            min-[3840px]:py-4
                            rounded-full
                            border
                            border-[#0B4EA2]
                            min-[3840px]:border-2
                            text-xs
                            sm:text-sm
                            min-[1920px]:text-base
                            min-[3840px]:text-2xl
                            font-semibold
                            text-gray-900
                            placeholder:text-gray-400
                            placeholder:font-normal
                            outline-none
                            w-40
                            min-[1920px]:w-52
                            min-[3840px]:w-80
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
                            min-[1920px]:w-11
                            min-[1920px]:h-11
                            min-[3840px]:w-16
                            min-[3840px]:h-16
                            flex
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-gray-300
                            min-[3840px]:border-2
                            text-gray-600
                            hover:border-[#0B4EA2]
                            hover:text-[#0B4EA2]
                            transition-colors
                            cursor-pointer
                          "
                        >
                          <Plus className="w-4 h-4 min-[1920px]:w-5 min-[1920px]:h-5 min-[3840px]:w-8 min-[3840px]:h-8" />
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
                        min-[1920px]:h-16
                        min-[3840px]:h-24
                        px-5
                        min-[1920px]:px-8
                        min-[3840px]:px-14
                        rounded-xl
                        min-[3840px]:rounded-3xl
                        bg-[#0A8F55]
                        text-white
                        font-bold
                        text-sm
                        sm:text-base
                        min-[1920px]:text-xl
                        min-[3840px]:text-3xl
                        flex
                        items-center
                        justify-center
                        gap-3
                        min-[3840px]:gap-6
                        transition-all
                        duration-300
                        hover:bg-[#087A48]
                        hover:-translate-y-0.5
                        hover:shadow-md
                        active:translate-y-0
                        cursor-pointer
                      "
                    >
                      <span id="contactSubmitText">Submit Interest</span>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 min-[1920px]:w-6 min-[1920px]:h-6 min-[3840px]:w-9 min-[3840px]:h-9" />
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