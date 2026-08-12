import React from "react";
import { Search, Layers3 } from "lucide-react";

const SearchServices = ({ searchTerm, setSearchTerm }) => {
  return (
    <section className="bg-blue-50 py-14">

      <div
        className="
          max-w-[1500px]
          mx-auto
          px-6
          lg:px-24
        "
      >

        {/* Heading */}

        <div className="mb-10">

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
            <Layers3
              size={16}
              className="text-green-300"
            />

            Our Services
          </span>



          <h2
            className="
              text-3xl
              md:text-4xl
              lg:text-5xl
              font-bold
              leading-snug
              text-black
            "
          >

            Explore 

            <br />

            <span
              className="
                bg-gradient-to-r
                from-blue-600
                to-green-500
                bg-clip-text
                text-transparent
              "
            >
              Your Services
            </span>

          </h2>



          <p
            className="
              mt-4
              max-w-3xl
              text-gray-600
              text-lg
              leading-8
            "
          >
            Search from our wide range of legal, business and financial
            services to quickly find the professional solution you need.
          </p>



    



        </div>



        {/* Search Box */}

        <div className="mt-6">

          <div className="relative">

            <Search
              size={21}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />


            <input
              type="text"
              placeholder="Search any service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                h-14
                rounded-xl

                border-2
                border-black

                bg-white

                pl-12
                pr-5

                text-base
                text-gray-700

                placeholder:text-gray-400

                outline-none

                shadow-sm

                transition-all
                duration-300

                hover:border-blue-400

                focus:border-blue-600
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>

        </div>


      </div>

    </section>
  );
};

export default SearchServices;