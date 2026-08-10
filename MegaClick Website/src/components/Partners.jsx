import React from "react";

import qci from "../assets/hero.png";
import iso from "../assets/iso.jpg";
import msme from "../assets/msme.png";
import startup from "../assets/H.png";
import india from "../assets/legal.jpg";
import gst from "../assets/process.png";


const partners = [

{
name:"QCI",
image:qci
},

{
name:"ISO",
image:iso
},

{
name:"MSME",
image:msme
},

{
name:"Startup India",
image:startup
},

{
name:"Digital India",
image:india
},

{
name:"GST",
image:gst
},

];





const Partners =()=>{


return(

<section

className="
py-5
bg-blue-50
overflow-hidden
"

>


     <div
  className="
    max-w-[1500px]
    mx-auto
    px-4
    sm:px-8
    lg:px-16
    xl:px-24
    pt-2
    sm:pt-3
    lg:pt-4
    pb-3
    sm:pb-6
    lg:pb-8
  "
>



{/* Heading */}


<div

className="
text-center
mb-8
"

>


<h2

className="
text-4xl
md:text-5xl
font-bold
text-gray-800
"

>

Trusted by Partners like

</h2>


</div>







{/* Logo Slider */}


<div

className="
relative
overflow-hidden
w-full
"

>


<div

className="
flex
items-center
gap-16
w-max
animate-scroll
"

>


{

[...partners,...partners].map((partner,index)=>(


<div

key={index}

className="
w-32
h-20
flex
items-center
justify-center
flex-shrink-0
"

>


<img

src={partner.image}

alt={partner.name}

className="
max-h-16
max-w-28
object-contain
"

 />


</div>


))


}



</div>


</div>




</div>



</section>


);


};


export default Partners;