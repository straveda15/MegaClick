import React from "react";


const popularServices = [

  {
    title: "Marriage Registration",
    icon: "💍",
  },

  {
    title: "GST Registration",
    icon: "🧾",
  },

  {
    title: "Trademark Registration",
    icon: "™️",
  },

  {
    title: "Company Registration",
    icon: "🏢",
  },

  {
    title: "Income Tax Services",
    icon: "💰",
  },

  {
    title: "MSME Registration",
    icon: "🏭",
  },

  {
    title: "Rent Agreement",
    icon: "🏠",
  },

  {
    title: "Digital Marketing",
    icon: "📢",
  },

  {
    title: "Passport Services",
    icon: "✈️",
  },

  {
    title: "Accounting & Audit",
    icon: "📊",
  },

];



const PopularServices = () => {


return (

<section
className="
py-6
bg-blue-50
"
>


<div
className="
max-w-[1500px]
mx-auto
px-6
lg:px-24
"
>


{/* Heading */}

<div
className="
mb-5
"
>

<h2
className="
inline-flex
items-center
gap-2

bg-blue-50

text-blue-700

px-5
py-2

rounded-full

text-sm

font-bold
"
>

⚡ Popular Services

</h2>


</div>





{/* Cards */}

<div
className="
grid
grid-cols-2
sm:grid-cols-3
md:grid-cols-5

gap-5
"
>


{
popularServices.map((service,index)=>(


<div

key={index}

className="
group

bg-white

rounded-2xl

border
border-gray-200

p-5

flex
flex-col
items-center

shadow-sm

hover:shadow-xl

hover:-translate-y-2

transition-all
duration-300

cursor-pointer

"

>


{/* Icon */}

<div

className="
w-14
h-14

rounded-xl

bg-blue-50

flex
items-center
justify-center

text-3xl

group-hover:scale-110

transition

"

>

{service.icon}

</div>





<h3

className="
mt-3

text-sm

font-semibold

text-gray-800

text-center

"

>

{service.title}

</h3>



</div>


))
}


</div>


</div>


</section>


);

};


export default PopularServices;