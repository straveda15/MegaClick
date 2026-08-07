import React from "react";

import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO.png";


const Footer = () => {


const navigate = useNavigate();



const scrollToSection = (id) => {


if(window.location.pathname !== "/"){

navigate("/");


setTimeout(()=>{

const section = document.getElementById(id);

if(section){

section.scrollIntoView({
behavior:"smooth",
block:"start",
});

}

},300);


}
else{


const section = document.getElementById(id);

if(section){

section.scrollIntoView({
behavior:"smooth",
block:"start",
});

}

}


};

const scrollToTop = () => {
  if (window.location.pathname !== "/") {
    navigate("/");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 300);
  } else {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};




const services = [

"Business Registration",

"Tax & Compliance Services",

"Financial & Legal Solutions",

];





const quickLinks = [

{
name:"Home",
id:"home"
},

{
name:"About Us",
id:"about"
},

{
name:"Services",
id:"services"
},

{
name:"Contact",
id:"contact"
},

];






return (

<footer
className="
bg-[#083A7A]
text-white
relative
overflow-hidden
"
>


{/* Top Line */}

<div
className="
h-1
bg-green-400
"
/>






<div
  className="
    max-w-[1450px]
    mx-auto
    px-6
    lg:px-20
    py-14
  "
>

<div
className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-12
lg:gap-16
items-start
"
>





{/* COMPANY */}


<div>


<div
className="
flex
items-center
gap-3
mb-6
"
>


<img

src={logo}

alt="MegaClick"

className="
w-12
h-12
-ml-2
rounded-full
object-contain
p-1
border
border-blue-300
bg-white
shadow-lg
shadow-blue-200/90
transition-all
duration-300
hover:scale-105
"

/>



<h2
  className="
    text-2xl
    lg:text-3xl
    font-extrabold
    tracking-wide
  "
>
  <span className="text-white">Mega</span>
  <span className="text-green-400">Click</span>
</h2>



</div>





<p
className="
text-blue-100
text-sm
leading-7
max-w-xs
"
>

MegaClick provides reliable business registration,
 financial and legal solutions to help
businesses grow faster.

</p>






{/* Social Icons */}


<div
className="
flex
gap-3
mt-6
"
>


{

[
FaFacebookF,
FaInstagram,
FaLinkedinIn

].map((Icon,index)=>(


<div

key={index}

className="
w-10
h-10
rounded-full
bg-white/10
flex
items-center
justify-center
cursor-pointer
transition-all
duration-300
hover:bg-green-500
hover:-translate-y-1
hover:shadow-lg
"

>

<Icon size={17}/>

</div>


))


}



</div>



</div>









{/* QUICK LINKS */}


<div>


<h3
className="
text-xl
font-bold
mb-7
"
>
Explore
</h3>





<ul
className="
space-y-4
"
>


{

quickLinks.map((item,index)=>(


<li

key={index}

onClick={()=>{

item.id==="blogs"
?
navigate("/blogs")
:
scrollToSection(item.id)

}}

className="
text-sm
text-blue-100
cursor-pointer
transition-all
duration-300
hover:text-white
hover:translate-x-1
"

>

{item.name}

</li>


))


}



</ul>



</div>









{/* SERVICES */}


<div>


<h3
className="
text-xl
font-bold
mb-7
"
>
Our Services
</h3>





<ul
className="
space-y-4
"
>


{

services.map((service,index)=>(


<li

key={index}

className="
text-sm
text-blue-100
cursor-pointer
transition-all
duration-300
hover:text-white
hover:translate-x-1
"

>

{service}

</li>


))


}



</ul>



</div>









{/* CONTACT */}


<div>


<h3
className="
text-xl
font-bold
mb-7
"
>
Contact Us
</h3>





<div
className="
space-y-5
"
>





<div
className="
flex
items-center
gap-3
"
>


<Phone
size={20}
className="text-green-400"
/>


<p
className="
text-sm
text-blue-100
"
>
+91 9921611911
</p>


</div>







<div
className="
flex
items-center
gap-3
"
>


<Mail
size={20}
className="text-green-400"
/>


<p
className="
text-sm
text-blue-100
"
>
megaclickofficial@gmail.com
</p>


</div>








<div
className="
flex
items-start
gap-3
"
>


<MapPin
size={24}
className="
text-green-400
mt-1
flex-shrink-0
"
/>


<p
className="
text-sm
leading-6
text-blue-100
max-w-xs
"
>

4th Floor, Tristar Complex,
<br />
Jehan Circle, Gangapur Rd,
<br />
Above Canara Bank,
<br />
D'souza Colony,
<br />
Nashik, Maharashtra 422005

</p>


</div>




</div>



</div>







</div>



</div>



{/* ================= Bottom Footer ================= */}
<div
  className="
    border-t
    border-white/10
    mt-2
  "
>
  <div
    className="
      max-w-[1500px]
      mx-auto
      px-6
      lg:px-24
      py-3

      flex
      items-center
      justify-between
      flex-wrap
      gap-2
    "
  >

    {/* Copyright */}

    <p
      className="
        text-sm
        text-blue-100
      "
    >
      © 2026 <span className="text-white font-semibold">Mega</span>
      <span className="text-green-400 font-semibold">Click</span>.
      All Rights Reserved.
    </p>

    {/* Back To Top */}

    <button
      onClick={scrollToTop}
      className="
        group
        flex
        items-center
        gap-2

        bg-white/10
        hover:bg-green-500

        border
        border-white/10

        px-3
        py-1

        rounded-full

        text-sm
        font-medium
        text-white

        transition-all
        duration-300

        hover:-translate-y-1
      "
    >
      <div
        className="
          w-6
          h-6
          rounded-full
          bg-white/20

          flex
          items-center
          justify-center

          group-hover:bg-white
          transition
        "
      >
        <span className="text-sm group-hover:text-green-600">
          ↑
        </span>
      </div>

      Back to Top
    </button>

  </div>
</div>

</footer>


);


};


export default Footer;