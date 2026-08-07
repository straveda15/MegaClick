import React from "react";

import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";


const ContactInfo = () => {


return (

<section className="py-20 bg-white">


<div
className="
max-w-[1500px]
mx-auto
px-6
lg:px-24
"
>


{/* ================= HEADING ================= */}

<div className="mb-14">


<span
className="
inline-flex
rounded-full
bg-[#0B4EA2]
px-5
py-2
text-sm
font-semibold
text-white
"
>
CONTACT INFORMATION
</span>



<h2
className="
mt-5
text-3xl
lg:text-3xl
font-extrabold
leading-tight
bg-gradient-to-r
from-[#0B4EA2]
via-blue-600
to-green-600
bg-clip-text
text-transparent
"
>
Get In Touch With Us
</h2>



<p
className="
mt-5
max-w-3xl
text-lg
leading-8
text-gray-600
"
>
Have questions or need assistance? Reach out to our experts.
We're always ready to help you with legal, business,
and financial solutions.
</p>


</div>







{/* ================= MAIN GRID ================= */}


<div
className="
grid
lg:grid-cols-3
gap-10
items-stretch
"
>







{/* ================= MAP CARD ================= */}



<div
className="
lg:col-span-2
relative
overflow-hidden
rounded-[32px]
border
border-gray-200
bg-white
shadow-[0_20px_60px_rgba(0,0,0,0.08)]
hover:shadow-2xl
transition-all
duration-500
"
>


{/* Top Line */}

<div
className="
absolute
top-0
left-0
h-1
w-full
bg-gradient-to-r
from-[#0B4EA2]
to-green-500
"
/>






{/* Map Header */}


<div
className="
flex
items-center
justify-between
p-8
"
>



<div
className="
flex
items-center
gap-5
"
>


<div
className="
w-16
h-16
rounded-2xl
bg-blue-100
flex
items-center
justify-center
group-hover:bg-[#0B4EA2]
transition
"
>


<MapPin

size={28}

className="
text-[#0B4EA2]
"
/>


</div>




<div>


<h3
className="
text-2xl
font-bold
text-gray-900
"
>
Visit Our Office
</h3>



<p
className="
text-gray-500
mt-1
"
>
We'd love to meet you.
</p>


</div>


</div>





<ArrowUpRight

size={26}

className="
text-gray-300
hover:text-[#0B4EA2]
transition
"

/>


</div>







{/* GOOGLE MAP */}



<div
className="
px-8
"
>


<div
className="
overflow-hidden
rounded-2xl
border
border-gray-200
"
>


<iframe

title="MegaClick Office"

src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.917570480964!2d73.7563732!3d20.011974!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb28d1dd624d%3A0xe806e01c2d79c79f!2sMegaClick%20Properties!5e0!3m2!1sen!2sin!4v1785864099343!5m2!1sen!2sin"

width="100%"

height="320"

style={{
border:0
}}

loading="lazy"

allowFullScreen

referrerPolicy="strict-origin-when-cross-origin"

/>


</div>


</div>







{/* ADDRESS */}



<div
className="
p-8
"
>


<h4
className="
text-xl
font-bold
text-gray-900
"
>
MegaClick Office
</h4>



<p
className="
mt-4
leading-8
text-gray-600
"
>

4th Floor, Tristar Complex,
<br/>

Above Canara Bank,
Beside Reliance Digital,

<br/>

Jehan Circle,
Gangapur Road,

<br/>

Nashik - 422005

</p>





<span
className="
inline-flex
mt-6
rounded-full
bg-blue-100
px-5
py-2
text-sm
font-semibold
text-[#0B4EA2]
"
>

Mon - Sat • 9:00 AM - 7:00 PM

</span>



</div>



</div>

{/* ================= RIGHT SIDE FLOATING CARDS ================= */}


<div
className="
flex
flex-col
justify-center
gap-8
"
>





{/* ================= CALL CARD ================= */}



<div

className="
group
relative
overflow-hidden
rounded-[32px]
bg-white
border
border-gray-200
p-8
shadow-[0_20px_60px_rgba(0,0,0,0.08)]
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500
"

>


{/* Glow */}

<div
className="
absolute
-right-16
-top-16
w-48
h-48
rounded-full
bg-green-100
blur-3xl
"
/>





<div
className="
relative
flex
items-center
justify-between
"
>


<div
className="
flex
items-center
gap-5
"
>



<div
className="
w-16
h-16
rounded-2xl
bg-green-100
flex
items-center
justify-center
group-hover:bg-green-600
transition-all
duration-300
"
>


<Phone

size={30}

className="
text-green-600
group-hover:text-white
transition
"

/>


</div>






<div>


<h3
className="
text-xl
font-bold
text-gray-900
"
>
Call Us
</h3>


<p
className="
mt-1
text-gray-600
"
>
+91 99216 11911
</p>


</div>



</div>






<ArrowUpRight

size={26}

className="
text-gray-300
group-hover:text-green-600
group-hover:rotate-45
transition
"

/>


</div>







<a

href="tel:+919921611911"

className="
mt-7
w-full
py-3.5
rounded-xl
bg-green-600
text-white
font-semibold
flex
items-center
justify-center
gap-2
hover:bg-green-700
transition
"

>

<Phone size={18}/>

Call Now

</a>




</div>








{/* ================= EMAIL CARD ================= */}




<div

className="
group
relative
overflow-hidden
rounded-[32px]
bg-white
border
border-gray-200
p-8
shadow-[0_20px_60px_rgba(0,0,0,0.08)]
hover:shadow-2xl
hover:-translate-y-3
transition-all
duration-500
"

>


{/* Glow */}

<div

className="
absolute
-right-16
-top-16
w-48
h-48
rounded-full
bg-blue-100
blur-3xl
"

/>







<div
className="
relative
flex
items-center
justify-between
"
>


<div
className="
flex
items-center
gap-5
"
>


<div
className="
w-16
h-16
rounded-2xl
bg-blue-100
flex
items-center
justify-center
group-hover:bg-[#0B4EA2]
transition
"
>


<Mail

size={30}

className="
text-[#0B4EA2]
group-hover:text-white
transition
"

/>



</div>







<div>


<h3
className="
text-xl
font-bold
text-gray-900
"
>
Email Us
</h3>



<p
className="
mt-1
text-gray-600
break-all
"
>
megaclickofficial@gmail.com
</p>



</div>



</div>






<ArrowUpRight

size={26}

className="
text-gray-300
group-hover:text-[#0B4EA2]
group-hover:rotate-45
transition
"

/>



</div>







<a

href="mailto:megaclickofficial@gmail.com"

className="
mt-7
w-full
py-3.5
rounded-xl
bg-[#0B4EA2]
text-white
font-semibold
flex
items-center
justify-center
gap-2
hover:bg-blue-900
transition
"

>


<Mail size={18}/>

Send Email


</a>




</div>







</div>



</div>



</div>


</section>


);


};


export default ContactInfo;