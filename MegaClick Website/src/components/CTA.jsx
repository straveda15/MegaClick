import React from "react";
import {
  ArrowRight,
  Phone,
  CheckCircle
} from "lucide-react";


const CTA = () => {

return (

<section className="
py-16
bg-blue-100
">


<div
className="
max-w-[1500px]
mx-auto
px-6
lg:px-24
"
>


<div className="
border
border-gray-200
bg-white
rounded-2xl
p-8
sm:p-10
lg:p-12
flex
flex-col
lg:flex-row
items-center
justify-between
gap-10
shadow-sm
">



{/* Left */}

<div className="max-w-2xl">


<p className="
text-sm
font-semibold
text-[#0B4EA2]
mb-3
">

Ready to Start?

</p>



<h2 className="
text-3xl
sm:text-3xl
font-bold
text-gray-900
leading-tight
">

Get Professional Support For

<span className="
block
text-[#0B4EA2]
">

Your Business Needs

</span>

</h2>




<p className="
mt-4
text-gray-600
leading-relaxed
">

From registrations to compliance,
our experts help you complete your
business requirements smoothly.

</p>





<div className="
mt-6
flex
flex-wrap
gap-5
">


<div className="
flex
items-center
gap-2
text-sm
text-gray-700
">

<CheckCircle
size={18}
className="text-green-600"
/>

Expert Assistance

</div>




<div className="
flex
items-center
gap-2
text-sm
text-gray-700
">

<CheckCircle
size={18}
className="text-green-600"
/>

Quick Process

</div>




<div className="
flex
items-center
gap-2
text-sm
text-gray-700
">

<CheckCircle
size={18}
className="text-green-600"
/>

Trusted Service

</div>


</div>


</div>









{/* Right */}


<div className="
flex
flex-col
items-start
lg:items-end
gap-5
">


<a
href="/#contact"
className="
inline-flex
items-center
gap-2
bg-green-600
hover:bg-green-700
text-white
px-8
py-3
rounded-lg
font-semibold
transition
"
>

Get Consultation

<ArrowRight size={18}/>

</a>





<div className="
flex
items-center
gap-3
text-gray-700
">


<div className="
w-11
h-11
rounded-full
bg-blue-50
flex
items-center
justify-center
">

<Phone
size={20}
className="text-[#0B4EA2]"
/>

</div>


<div>

<p className="
text-xs
text-gray-500
">

Talk to Expert

</p>


<p className="
font-semibold
">

+91 9921611911

</p>


</div>


</div>



</div>




</div>


</div>


</section>

);

};


export default CTA;