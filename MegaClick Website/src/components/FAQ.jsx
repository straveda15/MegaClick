import React, { useState } from "react";

import {
  ChevronDown,
  CheckCircle,
} from "lucide-react";


const faqs = [

{
question:
"What services does MegaClick provide?",

answer:
"MegaClick provides complete business solutions including company registration, GST registration, trademark registration, ISO certification, financial services and business compliance support.",
},

{
question:
"How long does the registration process take?",

answer:
"The timeline depends on the selected service. Our experts keep you updated throughout the process and complete your work as quickly as possible.",
},

{
question:
"What documents are required?",

answer:
"The required documents depend on the selected service. Our team provides a complete checklist before starting your application.",
},

{
question:
"Do you provide consultation before starting?",

answer:
"Yes. We provide professional consultation to understand your business requirements and recommend the most suitable solution.",
},

{
question:
"Why should I choose MegaClick?",

answer:
"MegaClick offers transparent processes, professional expertise, secure documentation and complete support from start to finish.",
},

];





const FAQ = () => {


const [openIndex,setOpenIndex] = useState(null);



const toggleFAQ = (index)=>{

setOpenIndex(
openIndex === index ? null : index
);

};




return (

<section

className="
relative
overflow-hidden
py-10
lg:py-16
bg-white
from-blue-100
via-blue-50
to-green-50
"

>



{/* Background Blur */}

<div
className="
absolute
-top-24
-left-24
w-80
h-80
rounded-full
bg-blue-200
blur-3xl
opacity-30
"
/>


<div
className="
absolute
-bottom-24
-right-24
w-80
h-80
rounded-full
bg-green-200
blur-3xl
opacity-30
"
/>





<div

className="
relative
max-w-[1500px]
mx-auto
px-6
lg:px-24
z-10
"

>




{/* Heading */}


<div

className="
max-w-xl
mb-10
"

>


<span

className="
inline-flex
items-center
gap-2
bg-[#2563EB]
text-white
px-4
py-2
rounded-full
text-xs
font-semibold
shadow-sm
mb-4
"

>


<CheckCircle

size={15}

className="text-green-300"

/>


Frequently Asked Questions


</span>






<h2

className="
text-3xl
md:text-4xl
font-bold
leading-snug
text-black
"

>

Frequently Asked


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

Questions

</span>


</h2>







<p

className="
mt-4
text-black
leading-7
text-base
text-justify
"

>

Find answers to the most common questions about our
business registration, legal documentation, financial
services and consultation process. Our experts are
always ready to guide you with reliable solutions.

</p>


</div>








{/* FAQ List */}


<div

className="
space-y-4
"

>


{

faqs.map((faq,index)=>(


<div

key={index}

className="
group
bg-white
rounded-xl
border
border-blue-200
shadow-md
hover:shadow-xl
hover:border-blue-500
transition-all
duration-300
overflow-hidden
"

>



<button

onClick={()=>toggleFAQ(index)}

className="
w-full
flex
justify-between
items-center
px-5
py-4
text-left
"

>



<h3

className="
text-lg
md:text-base
font-semibold
text-gray-900
group-hover:text-blue-600
transition
"

>

{faq.question}

</h3>





<div

className="
w-8
h-8
rounded-full
bg-green-50
flex
items-center
justify-center
"

>


<ChevronDown

size={18}

className={`

text-green-600

transition-transform

duration-300

${
openIndex===index
?
"rotate-180"
:
""
}

`}

/>


</div>



</button>






{/* Answer */}


<div

className={`

overflow-hidden

transition-all

duration-300

${
openIndex===index
?
"max-h-60"
:
"max-h-0"
}

`}

>


<div

className="
border-t
border-blue-100
px-5
py-4
bg-blue-50/40
"

>


<p

className="
text-gray-600
leading-6
text-lg
text-justify
"

>

{faq.answer}

</p>


</div>


</div>





</div>


))


}


</div>









{/* CTA */}



<div

className="
mt-12
"

>


<div

className="
relative
overflow-hidden
rounded-2xl
bg-gradient-to-r
from-blue-500
to-blue-600
p-6
shadow-xl
"

>



{/* Soft Shapes */}


<div

className="
absolute
-top-12
-right-12
w-40
h-40
rounded-full
bg-white/15
"

/>


<div

className="
absolute
-bottom-12
-left-12
w-44
h-44
rounded-full
bg-white/15
"

/>







<div

className="
relative
z-10
flex
flex-col
lg:flex-row
lg:items-center
lg:justify-between
gap-6
"

>





{/* Left */}


<div

className="
max-w-2xl
"

>


<span

className="
inline-flex
items-center
gap-2
px-4
py-2
rounded-full
bg-white/20
text-white
text-xs
font-semibold
mb-3
"

>


<CheckCircle

size={14}

className="text-green-300"

/>


Need More Help?


</span>






<h3

className="
text-2xl
font-bold
text-white
"

>

Still Have Questions?

</h3>







<p

className="
mt-3
text-blue-50
leading-6
text-sm
"

>

Our experts are always available to guide you through
registrations, documentation, GST, trademark,
compliance and every business requirement with
complete transparency.

</p>


</div>







{/* Simple Stats */}


<div

className="
flex
items-center
gap-8
"

>


<div className="text-center">


<h4

className="
text-3xl
font-extrabold
text-white
"

>

15K+

</h4>


<p

className="
text-xs
text-blue-50
mt-1
"

>

Happy Clients

</p>


</div>






<div

className="
h-10
w-px
bg-white/30
"

/>






<div className="text-center">


<h4

className="
text-3xl
font-extrabold
text-green-300
"

>

25+

</h4>


<p

className="
text-xs
text-blue-50
mt-1
"

>

Services

</p>


</div>



</div>





</div>


</div>


</div>






</div>


</section>


);


};


export default FAQ;