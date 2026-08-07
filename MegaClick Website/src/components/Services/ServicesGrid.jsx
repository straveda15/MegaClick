import React from "react";
import { useNavigate } from "react-router-dom";


const ServicesGrid = ({
  services,
  selectedCategory
}) => {


const navigate = useNavigate();



return (

<div className="space-y-10">



{/* MAIN CATEGORY CARD */}

<div

className="
bg-blue-50
rounded-3xl
border
border-gray-200
shadow-[0_8px_30px_rgba(0,0,0,0.08)]
p-6
"

>


{/* Heading inside card */}

<div

className="
flex
items-center
justify-between
mb-6
"

>


<div>

<h2

className="
text-2xl
font-bold
text-gray-800
"

>

{

selectedCategory === "All Services"

?

"All Services"

:

selectedCategory

}

</h2>



<p

className="
text-sm
text-gray-500
mt-1
"

>

Explore our professional services

</p>


</div>




{/* Count */}

<div

className="
bg-blue-50
px-4
py-2
rounded-xl
text-blue-700
font-semibold
text-sm
"

>

{services.length} Services

</div>



</div>





{/* SUB SERVICE CARDS */}


<div

className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-5
"

>


{

services.map((service,index)=>(


<div

key={index}


onClick={()=>navigate(
`/services/${service.slug}`
)}


className="

group

bg-gray-50

rounded-2xl

p-5

border
border-gray-200

cursor-pointer

transition-all
duration-300

hover:bg-white

hover:-translate-y-1

hover:shadow-xl

hover:border-blue-200

"


>



{/* Emoji / Icon */}

<div

className="

w-12
h-12

rounded-xl

bg-white

shadow-sm

flex
items-center
justify-center

text-3xl

mb-4

group-hover:scale-110

transition-transform

"

>


{service.emoji}


</div>





<h3

className="
font-semibold
text-gray-800
text-base
leading-5
"

>

{service.title}

</h3>




<p

className="
text-xs
text-gray-500
mt-2
"

>

Get professional assistance

</p>



</div>



))

}



</div>



</div>



</div>


);


};


export default ServicesGrid;