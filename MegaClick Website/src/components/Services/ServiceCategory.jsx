import React from "react";
import ServiceCard from "./ServiceCard";


const ServiceCategory = ({category}) => {


return (

<section className="mb-10">


<div

className="

bg-white

rounded-3xl

border

border-gray-200

shadow-md

p-6

"

>


{/* Category Header */}

<div

className="

flex

justify-between

items-center

mb-6

"

>


<div

className="

flex

items-center

gap-4

"

>


<div

className="

w-14

h-14

rounded-2xl

bg-blue-50

flex

items-center

justify-center

text-3xl

"

>

{category.icon}

</div>




<div>

<h2

className="

text-2xl

font-bold

text-gray-800

"

>

{category.title}

</h2>


<p

className="

text-sm

text-gray-500

"

>

Complete professional solutions

</p>


</div>


</div>





<div

className="

bg-gray-100

px-4

py-2

rounded-full

text-sm

font-semibold

"

>

{category.services.length} Services

</div>



</div>






{/* Services */}

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

category.services.map((service)=>(


<ServiceCard

key={service.id}

service={service}

/>


))


}



</div>


</div>


</section>


);


};


export default ServiceCategory;