import React from "react";

import {
  ArrowRight,
  CheckCircle2,
  BriefcaseBusiness,
  Users,
  ShieldCheck,
} from "lucide-react";


const Hero = () => {


  const scrollToContact = () => {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };


  return (

<section
id="home"
className="
relative
overflow-hidden
bg-white
"
>


<div
className="
max-w-[1500px]
mx-auto
px-6
lg:px-24
py-24
"
>


<div
className="
grid
lg:grid-cols-2
gap-16
items-center
"
>





{/* ================= LEFT SIDE ================= */}


<div className="space-y-7">


<div
className="
inline-flex
items-center
gap-2
bg-[#0B4EA2]
text-white
px-5
py-2
rounded-full
text-sm
font-semibold
"
>

<CheckCircle2 size={16}/>

Trusted Business Solutions

</div>





<h1
className="
text-4xl
md:text-4xl
xl:text-5xl
font-bold
leading-[1.15]
text-black
"
>

Grow Your Business

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

With Smart Solutions

</span>


</h1>





<p
className="
text-lg
text-black
leading-relaxed
max-w-xl
"
>

Complete business solutions to simplify registrations,
compliance, finance and growth with trusted expert guidance.

</p>








{/* STATS */}


<div
className="
flex
gap-10
flex-wrap
"
>


<div>

<h3
className="
text-3xl
font-bold
text-[#0B4EA2]
"
>
15000+
</h3>

<p className="text-black text-sm">
Happy Clients
</p>

</div>





<div>

<h3
className="
text-3xl
font-bold
text-[#0B4EA2]
"
>
25+
</h3>


<p className="text-black text-sm">
Services
</p>

</div>






<div>

<h3
className="
text-3xl
font-bold
text-[#0B4EA2]
"
>
10+
</h3>


<p className="text-black text-sm">
Years Experience
</p>

</div>


</div>









{/* BUTTONS */}


<div
className="
flex
gap-4
pt-4
flex-wrap
"
>


<button
className="
flex
items-center
gap-2

bg-[#0B4EA2]

hover:bg-blue-700

text-white

px-8
py-3.5

rounded-xl

font-semibold

transition
"
>

Get Started

<ArrowRight size={18}/>

</button>






<button
onClick={scrollToContact}

className="
bg-green-600

hover:bg-green-700

text-white

px-8

py-3.5

rounded-xl

font-semibold

transition
"
>

Contact Us

</button>



</div>



</div>




{/* RIGHT SIDE FLOATING UI */}

<div
className="
relative
hidden
xl:flex
items-center
justify-center
w-full
min-h-[520px]
"
>

<div
className="
relative
w-[560px]
h-[480px]
"
>


{/* CENTER MAIN CARD */}

<div
className="
absolute
left-[80px]
top-[70px]

z-10

w-[490px]

bg-white

rounded-[24px]

border
border-blue-100

shadow-[0_20px_40px_rgba(11,78,162,0.12)]

p-8

animate-float-slow
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

bg-blue-100

flex
items-center
justify-center
"
>

<BriefcaseBusiness
size={28}
className="text-[#0B4EA2]"
/>

</div>



<div>

<h3 className="text-xl font-bold">
  <span className="text-[#0B4EA2]">Mega</span>
  <span className="text-green-500">Click</span>
</h3>


<p
className="
text-sm
text-gray-500
"
>
Smart Business Solutions
</p>


</div>


</div>






<div
className="
mt-8

grid

grid-cols-3

gap-4
"
>


<div
className="
bg-blue-50
rounded-xl
p-4
text-center
"
>

<h4
className="
text-2xl
font-bold
text-[#0B4EA2]
"
>
15K+
</h4>

<p className="text-xs text-gray-500">
Clients
</p>

</div>



<div
className="
bg-green-50
rounded-xl
p-4
text-center
"
>

<h4
className="
text-2xl
font-bold
text-green-600
"
>
25+
</h4>

<p className="text-xs text-gray-500">
Services
</p>

</div>




<div
className="
bg-blue-50
rounded-xl
p-4
text-center
"
>

<h4
className="
text-2xl
font-bold
text-[#0B4EA2]
"
>
10+
</h4>

<p className="text-xs text-gray-500">
Years
</p>

</div>


</div>



<div
className="
mt-6

flex
items-center
gap-2

text-sm
font-semibold
text-green-600
"
>

<CheckCircle2 size={18}/>

Trusted Business Partner

</div>


</div>









{/* LEFT SMALL CARD */}


<div
className="
absolute

left-[10px]

top-[20px]

z-20

w-[180px]

bg-white

rounded-2xl

border
border-blue-100

shadow-[0_15px_35px_rgba(11,78,162,0.12)]

p-5

animate-float-medium
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
w-10
h-10

rounded-xl

bg-blue-100

flex
items-center
justify-center
"
>

<Users
size={22}
className="text-[#0B4EA2]"
/>


</div>



<div>

<h4
className="
font-bold
text-gray-900
"
>
15000+
</h4>


<p
className="
text-xs
text-gray-500
"
>
Happy Clients
</p>


</div>


</div>


</div>











{/* RIGHT SMALL SECURE CARD */}

<div
className="
absolute

right-[-10px]

bottom-[100px]

z-20

w-[180px]

bg-white

rounded-xl

border
border-blue-100

shadow-[0_12px_25px_rgba(11,78,162,0.12)]

p-3

animate-float-fast
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
w-8
h-8

rounded-lg

bg-green-100

flex
items-center
justify-center
"
>

<ShieldCheck
size={18}
className="text-green-600"
/>

</div>



<div>

<h4
className="
font-bold
text-sm
text-gray-900
"
>
Secure
</h4>


<p
className="
text-[11px]
text-gray-500
"
>
Compliance
</p>


</div>


</div>


</div>









{/* TOP STATUS BADGE */}


<div
className="
absolute

right-[50px]

top-[35px]

z-20

flex

items-center

gap-2

bg-blue-50

border

border-blue-200

rounded-full

px-5

py-2

text-sm

font-bold

text-[#0B4EA2]

animate-float-medium
"
>


<span
className="
w-2
h-2

rounded-full

bg-green-500

animate-pulse
"
/>


Services Active


</div>



</div>


</div>

</div>







</div>


</section>


  );

};


export default Hero;