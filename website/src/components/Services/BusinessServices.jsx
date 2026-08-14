// import React from "react";
// import { ArrowRight } from "lucide-react";
// import { businessServices } from "./servicesData";

// const borderColors = [
//   "border-l-green-500",
//   "border-l-blue-500",
//   "border-l-cyan-500",
//   "border-l-violet-500",
//   "border-l-orange-500",
//   "border-l-pink-500",
//   "border-l-teal-500",
//   "border-l-sky-500",
//   "border-l-green-500",
//   "border-l-purple-500",
// ];

// const iconColors = [
//   {
//     bg: "bg-green-50",
//     text: "text-green-600",
//     arrow: "text-green-600",
//     arrowBg: "bg-green-50",
//   },
//   {
//     bg: "bg-blue-50",
//     text: "text-blue-600",
//     arrow: "text-blue-600",
//     arrowBg: "bg-blue-50",
//   },
//   {
//     bg: "bg-cyan-50",
//     text: "text-cyan-600",
//     arrow: "text-cyan-600",
//     arrowBg: "bg-cyan-50",
//   },
//   {
//     bg: "bg-violet-50",
//     text: "text-violet-600",
//     arrow: "text-violet-600",
//     arrowBg: "bg-violet-50",
//   },
//   {
//     bg: "bg-orange-50",
//     text: "text-orange-600",
//     arrow: "text-orange-600",
//     arrowBg: "bg-orange-50",
//   },
//   {
//     bg: "bg-pink-50",
//     text: "text-pink-600",
//     arrow: "text-pink-600",
//     arrowBg: "bg-pink-50",
//   },
//   {
//     bg: "bg-teal-50",
//     text: "text-teal-600",
//     arrow: "text-teal-600",
//     arrowBg: "bg-teal-50",
//   },
//   {
//     bg: "bg-sky-50",
//     text: "text-sky-600",
//     arrow: "text-sky-600",
//     arrowBg: "bg-sky-50",
//   },
// ];

// const labels = {
//   "Private Limited Company": "🚀 Recommended",
//   "GST Registration": "🔥 Best Seller",
//   "Trademark Registration": "⭐ Most Popular",
//   "Startup India Registration": "✨ New",
// };

// const BusinessServices = ({ searchTerm = "" }) => {

//   const filteredServices = businessServices.filter((service) =>
//     service.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <section className="py-16 bg-blue-100">

//       <div className="max-w-[1500px] mx-auto px-6 lg:px-20">

//         {/* Heading */}

//         <div className="mb-10">

//           <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
//             Business & Financial Services
//           </h2>

//           <p className="mt-3 max-w-3xl text-base lg:text-lg leading-7 text-gray-600">
//             Complete business registration, taxation,
//             compliance, certification and financial
//             solutions for startups, MSMEs and companies.
//           </p>

//           <div className="flex items-center gap-3 mt-5">
//             <div className="h-1 w-16 rounded-full bg-blue-600"></div>
//             <div className="h-1 w-8 rounded-full bg-green-500"></div>
//           </div>

//         </div>

//         {/* Cards */}

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//           {filteredServices.map((service, index) => {

//             const Icon = service.icon;
//             const color = iconColors[index % iconColors.length];

//             return (

//               <button
//                 key={index}
//                 className={`
//                   group
//                   relative
//                   overflow-hidden
//                   bg-white
//                   rounded-2xl
//                   border
//                   border-gray-200
//                   ${borderColors[index % borderColors.length]}
//                   border-l-[5px]
//                   shadow-md
//                   hover:shadow-xl
//                   hover:-translate-y-1
//                   transition-all
//                   duration-500
//                   p-5
//                   text-left
//                 `}
//               >

//                                 {/* Hover Background */}
//                 <div
//                   className="
//                     absolute
//                     inset-0
//                     bg-gradient-to-r
//                     from-blue-50/40
//                     via-transparent
//                     to-green-50/40
//                     opacity-0
//                     group-hover:opacity-100
//                     transition-opacity
//                     duration-500
//                   "
//                 ></div>

//                 <div className="relative flex items-start gap-4">

//                   {/* Icon */}
//                   <div
//                     className={`
//                       h-16
//                       w-16
//                       rounded-full
//                       ${color.bg}
//                       flex
//                       items-center
//                       justify-center
//                       flex-shrink-0
//                       transition-all
//                       duration-500
//                       group-hover:scale-110
//                       group-hover:rotate-3
//                     `}
//                   >
//                     <Icon
//                       size={32}
//                       className={`
//                         ${color.text}
//                         transition-all
//                         duration-500
//                       `}
//                     />
//                   </div>

//                   {/* Content */}
//                   <div className="flex-1">

//                     {labels[service.title] && (
//                       <span
//                         className="
//                           inline-flex
//                           items-center
//                           px-3
//                           py-1
//                           rounded-full
//                           bg-green-100
//                           text-green-700
//                           text-xs
//                           font-semibold
//                           mb-2
//                         "
//                       >
//                         {labels[service.title]}
//                       </span>
//                     )}

//                     {/* Title */}
//                     <h3
//                       className="
//                         text-xl
//                         font-bold
//                         text-gray-900
//                         leading-snug
//                         transition-colors
//                         duration-300
//                         group-hover:text-blue-700
//                       "
//                     >
//                       {service.title}
//                     </h3>

//                     {/* One Line Description */}
//                     <p
//                       className="
//                         mt-2
//                         text-sm
//                         font-semibold
//                         text-green-600
//                         leading-5
//                         line-clamp-1
//                       "
//                     >
//                       {service.description}
//                     </p>

//                   </div>

//                   {/* Arrow */}
//                   <div className="mt-8 flex justify-end">

//                     <div
//                       className={`
//                         h-9
//                         w-9
//                         rounded-full
//                         ${color.arrowBg}
//                         flex
//                         items-center
//                         justify-center
//                         shadow-sm
//                         transition-all
//                         duration-500
//                         group-hover:scale-110
//                         group-hover:translate-x-1
//                         group-hover:shadow-md
//                       `}
//                     >
//                       <ArrowRight
//                         size={18}
//                         className={`
//                           ${color.arrow}
//                           transition-all
//                           duration-500
//                           group-hover:translate-x-1
//                         `}
//                       />
//                     </div>

//                   </div>

//                 </div>

//                 {/* Bottom Hover Border */}
//                 <div
//                   className="
//                     absolute
//                     bottom-0
//                     left-0
//                     h-1
//                     w-0
//                     bg-gradient-to-r
//                     from-blue-600
//                     via-green-500
//                     to-blue-600
//                     transition-all
//                     duration-500
//                     group-hover:w-full
//                   "
//                 ></div>

//               </button>
//                           );

//           })}

//         </div>

//         {/* No Results */}

//         {filteredServices.length === 0 && (

//           <div className="flex justify-center py-14">

//             <div
//               className="
//                 max-w-lg
//                 w-full
//                 bg-white
//                 border
//                 border-gray-200
//                 rounded-3xl
//                 shadow-xl
//                 p-8
//                 text-center
//               "
//             >

//               <div
//                 className="
//                   w-16
//                   h-16
//                   mx-auto
//                   rounded-full
//                   bg-blue-50
//                   flex
//                   items-center
//                   justify-center
//                   text-3xl
//                   mb-5
//                 "
//               >
//                 🔍
//               </div>

//               <h3 className="text-2xl font-bold text-gray-900">
//                 No Business Services Found
//               </h3>

//               <p className="mt-3 text-gray-600">
//                 We couldn't find any business services matching your search.
//               </p>

//               <button
//                 onClick={() => window.location.reload()}
//                 className="
//                   mt-6
//                   px-6
//                   py-3
//                   rounded-xl
//                   bg-blue-600
//                   hover:bg-green-600
//                   text-white
//                   font-semibold
//                   transition-all
//                   duration-300
//                 "
//               >
//                 View All Services
//               </button>

//             </div>

//           </div>

//         )}

//       </div>

//     </section>

//   );

// };

// export default BusinessServices;
            