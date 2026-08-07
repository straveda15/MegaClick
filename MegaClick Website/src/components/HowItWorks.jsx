import React from "react";

import {
  PhoneCall,
  FileText,
  Settings,
  CheckCircle2,
  ShieldCheck,
  Check,
  Award,
  ArrowRight,
} from "lucide-react";

import processImg from "../assets/process.png";


const steps = [
  {
    number: "01",
    icon: PhoneCall,
    title: "Free Consultation",
    text: "Discuss your business requirements with our experts.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Submit Documents",
    text: "Share the required documents securely for quick verification.",
  },
  {
    number: "03",
    icon: Settings,
    title: "Expert Processing",
    text: "Our professionals handle your application with accuracy.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Get Your Solution",
    text: "Receive your completed service with smooth and reliable support.",
  },
];


const points = [
  "Understand your business requirements",
  "Get expert guidance for the best solution",
  "Complete documentation assistance",
  "Transparent and hassle-free process",
];


const HowItWorks = () => {

return (

<section
className="
relative
overflow-hidden
py-14
bg-blue-50
"
>

<div
  className="
    max-w-[1450px]
    mx-auto
    px-6
    lg:px-20
  "
>


<div
className="
grid
lg:grid-cols-2
gap-10
items-center
"
>


{/* LEFT CONTENT */}

<div>

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
text-sm
font-semibold
"
>

<CheckCircle2
size={16}
className="text-green-400"
/>

Our Process

</span>



<h2
className="
mt-5
text-4xl
lg:text-5xl
font-bold
leading-tight
text-gray-900
"
>

Get Your Solution

<br/>

<span
className="
bg-gradient-to-r
from-blue-600
to-green-500
bg-clip-text
text-transparent
"
>
In Simple Steps
</span>

</h2>



<p
className="
mt-5
text-[15px]
leading-7
text-gray-600
max-w-[560px]
text-justify
"
>

We follow a simple and transparent process to help businesses
complete registrations, legal documentation, compliance services
and business solutions efficiently. Our experts guide you through
every stage ensuring accuracy and reliability.

</p>



<div
className="
mt-8
space-y-4
"
>

{
points.map((item,index)=>(

<div
key={index}
className="
flex
items-center
gap-3
"
>

<div
className="
w-9
h-9
rounded-full
bg-[#0B4EA2]
text-white
flex
items-center
justify-center
shadow
"
>

<Check size={17}/>

</div>


<p
className="
text-[15px]
font-semibold
text-gray-800
"
>

{item}

</p>

</div>

))

}

</div>


</div>





{/* RIGHT COMPACT CARD */}


<div
className="
flex
justify-center
lg:justify-center
"
>


<div
className="
w-full
max-w-[420px]
bg-white
border
border-blue-100
rounded-2xl
shadow-lg
overflow-hidden
"
>


{/* IMAGE */}

<div
className="
bg-gradient-to-br
from-blue-50
to-green-50
px-6
py-4
"
>

<img
src={processImg}
alt="Process"
className="
w-full
h-[170px]
object-contain
"
/>

</div>





<div
className="
p-5
"
>


<div
className="
flex
items-center
gap-3
"
>


<div
className="
w-9
h-9
rounded-lg
bg-blue-50
border
border-blue-100
flex
items-center
justify-center
"
>

<ShieldCheck
size={24}
className="text-[#0B4EA2]"
/>

</div>



<div>

<h3
className="
text-lg
font-bold
text-gray-900
"
>
Trusted Expertise
</h3>


<p
className="
text-xs
text-gray-500
"
>
Professional Business Assistance
</p>


</div>


</div>



<p
className="
mt-4
text-sm
leading-6
text-gray-600
"
>

Experienced professionals manage every stage with
accuracy and complete transparency.

</p>



<div
className="
mt-5
grid
grid-cols-2
gap-3
"
>


<div className="flex items-center gap-2 text-sm text-gray-700">

<Check size={15} className="text-green-600"/>

Secure Docs

</div>


<div className="flex items-center gap-2 text-sm text-gray-700">

<Check size={15} className="text-green-600"/>

Expert Support

</div>


<div className="flex items-center gap-2 text-sm text-gray-700">

<Check size={15} className="text-green-600"/>

Fast Process

</div>


<div className="flex items-center gap-2 text-sm text-gray-700">

<Check size={15} className="text-green-600"/>

Reliable

</div>


</div>
{/* TRUST BANNER */}

<div
className="
mt-6
rounded-xl
bg-gradient-to-r
from-blue-600
to-green-500
px-5
py-4
flex
items-center
justify-between
text-white
"
>

<div>

<p
className="
text-[12px]
uppercase
font-semibold
tracking-wider
opacity-80
"
>
Trusted Business Partner
</p>


<h4
className="
text-sm
font-semibold
mt-1
"
>
Verified & Reliable Service
</h4>


</div>


<Award size={30}/>


</div>


</div>

</div>

</div>

</div>




{/* STEPPER SECTION */}


<div
className="
mt-16
"
>


<div
className="
relative
"
>


{/* LINE */}

<div
className="
hidden
lg:block
absolute
top-[38px]
left-[14%]
right-[14%]
h-[2px]
bg-gradient-to-r
from-blue-400
via-blue-300
to-green-400
"
/>



<div
className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-8
relative
"
>


{

steps.map((item,index)=>{


const Icon=item.icon;


return (

<div
key={index}
className="
flex
flex-col
font-semibold
items-center
text-center
group
"
>


{/* ICON */}

<div
className="
relative
w-[72px]
h-[72px]
rounded-full
bg-white
border-4
border-blue-50
shadow-md
flex
items-center
justify-center
transition
duration-300
group-hover:-translate-y-2
group-hover:border-blue-500
"
>


<div
className="
absolute
inset-0
rounded-full
bg-gradient-to-br
from-blue-600
to-green-500
opacity-0
group-hover:opacity-100
transition
"
/>


<Icon
size={28}
className="
relative
z-10
text-[#0B4EA2]
group-hover:text-white
transition
"
/>


</div>




{/* NUMBER */}

<div
className="
mt-3
text-xs
font-bold
text-[#0B4EA2]
"
>

STEP {item.number}

</div>




{/* TITLE */}

<h4
className="
mt-2
text-xl
font-bold
text-gray-900
"
>

{item.title}

</h4>



<p
className="
mt-2
text-sm
leading-6
text-gray-600
max-w-[220px]
"
>

{item.text}

</p>



<div
className="
mt-4
px-3
py-1
rounded-full
bg-blue-50
border
border-blue-100
flex
items-center
gap-1
"
>

<Check
size={13}
className="text-green-600"
/>


<span
className="
text-[11px]
font-semibold
text-[#0B4EA2]
"
>

Fast & Secure

</span>


</div>








</div>


)


})


}



</div>


</div>


</div>


</div>


</section>

);

};


export default HowItWorks;