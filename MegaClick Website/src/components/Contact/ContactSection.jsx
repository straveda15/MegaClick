import React, { useState } from "react";
import Select from "react-select";

import {
  ShieldCheck,
  Users,
  Headset,
  User,
  Phone,
  Mail,
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

const serviceOptions = [
  { value: "Company Registration", label: "Company Registration" },
  { value: "Private Limited Company", label: "Private Limited Company" },
  { value: "LLP Registration", label: "LLP Registration" },
  { value: "OPC Registration", label: "OPC Registration" },
  { value: "GST Registration", label: "GST Registration" },
  { value: "Trademark Registration", label: "Trademark Registration" },
  { value: "MSME Registration", label: "MSME Registration" },
  { value: "ISO Certification", label: "ISO Certification" },
  { value: "FSSAI Registration", label: "FSSAI Registration" },
  { value: "Import Export Code (IEC)", label: "Import Export Code (IEC)" },
  { value: "Income Tax Return", label: "Income Tax Return" },
  { value: "GST Return Filing", label: "GST Return Filing" },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Business Solutions",
    text: "Reliable legal, financial and compliance services under one roof.",
  },
  {
    icon: Users,
    title: "15,000+ Happy Clients",
    text: "Trusted by startups, professionals and businesses across India.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    text: "Our experts are always ready to guide you at every step.",
  },
];

const ContactSection = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedService) {
      alert("Please select a service.");
      return;
    }

    alert("Form Submitted Successfully!");
  };

  return (

<section
className="
py-10
bg-blue-100
relative
overflow-hidden
"
>


{/* Background Floating Glow */}

<div
className="
absolute
top-0
left-0
w-72
h-72
bg-blue-300/30
rounded-full
blur-3xl
"
/>


<div
className="
absolute
bottom-0
right-0
w-80
h-80
bg-green-300/30
rounded-full
blur-3xl
"
/>





<div
className="
max-w-[1500px]
mx-auto
px-6
lg:px-24
relative
z-10
"
>


<div
className="
grid
lg:grid-cols-2
gap-12
items-start
"
>





{/* ================= LEFT FORM CARD ================= */}


<div
className="
relative
bg-white/90
backdrop-blur-xl
rounded-[35px]
shadow-[0_30px_80px_rgba(0,0,0,0.12)]
p-8
lg:p-10
hover:-translate-y-2
transition-all
duration-500
"
>



{/* Floating Circle */}

<div
className="
absolute
-top-10
-right-10
w-40
h-40
rounded-full
bg-blue-100
blur-3xl
"
/>





{/* Badge */}


<span
className="
relative
inline-flex
items-center
gap-2
px-5
py-2
rounded-full
bg-green-100
text-green-700
font-bold
text-sm
"
>

<Sparkles size={16}/>

Free Expert Consultation

</span>





{/* Heading */}


<h2
className="
mt-6
text-3xl
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

Request Your Free Consultation

</h2>




<p
className="
mt-4
text-gray-700
leading-7
"
>

Tell us about your business requirements and our experts will contact you
with the best legal, financial and compliance solutions.

</p>





{/* FORM */}


<form
className="
mt-8
space-y-5
"
>


<div
className="
grid
md:grid-cols-2
gap-5
"
>



{/* Name */}

<div className="relative">
  <User
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="text"
    name="name"
    required
    placeholder="Full Name *"
    className="
      w-full
      h-14
      rounded-xl
      bg-gray-50
      border
      border-gray-200
      pl-12
      pr-4
      outline-none
      focus:bg-white
      focus:border-[#0B4EA2]
      focus:ring-4
      focus:ring-blue-100
      transition
    "
  />
</div>





{/* Phone */}
<div className="relative">
  <Phone
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="tel"
    name="phone"
    required
    placeholder="Phone Number *"
    className="
      w-full
      h-14
      rounded-xl
      bg-gray-50
      border
      border-gray-200
      pl-12
      pr-4
      outline-none
      focus:bg-white
      focus:border-[#0B4EA2]
      focus:ring-4
      focus:ring-blue-100
      transition
    "
  />
</div>


</div>

{/* Email + Service */}
<div className="grid md:grid-cols-2 gap-5">

  {/* Email (Optional) */}
<div className="relative">
  <Mail
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="email"
    name="email"
    placeholder="Email Address (Optional)"
    className="
      w-full
      h-14
      rounded-xl
      bg-gray-50
      border
      border-gray-200
      pl-12
      pr-4
      outline-none
      focus:bg-white
      focus:border-[#0B4EA2]
      focus:ring-4
      focus:ring-blue-100
      transition
    "
  />
</div>
  {/* Searchable Service */}
<div className="relative">
  <Briefcase
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400"
  />

  <Select
    options={serviceOptions}
    value={selectedService}
    onChange={setSelectedService}
    isSearchable
    placeholder="Search & Select Service *"
    className="text-sm"
    styles={{
      control: (base, state) => ({
        ...base,
        minHeight: "56px",
        borderRadius: "12px",
        paddingLeft: "36px",
        borderColor: state.isFocused ? "#0B4EA2" : "#e5e7eb",
        boxShadow: state.isFocused
          ? "0 0 0 4px rgba(59,130,246,.15)"
          : "none",
        "&:hover": {
          borderColor: "#0B4EA2",
        },
      }),

      menu: (base) => ({
        ...base,
        zIndex: 9999,
      }),

      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "#0B4EA2"
          : state.isFocused
          ? "#EAF3FF"
          : "#fff",
        color: state.isSelected ? "#fff" : "#111827",
        cursor: "pointer",
      }),
    }}
  />

  {!selectedService && (
    <input
      required
      value=""
      onChange={() => {}}
      tabIndex={-1}
      autoComplete="off"
      className="absolute opacity-0 pointer-events-none"
    />
  )}
</div>
</div>





{/* Message */}

<textarea
  name="message"
  rows={5}
  required
  placeholder="Tell us about your requirements *"
  className="
    w-full
    rounded-xl
    bg-gray-50
    border
    border-gray-200
    p-4
    resize-none
    outline-none
    focus:bg-white
    focus:border-[#0B4EA2]
    focus:ring-4
    focus:ring-blue-100
    transition
  "
/>







{/* Submit Button */}


<button

type="submit"

className="
group
w-full
h-14
rounded-xl
bg-[#0B4EA2]
hover:bg-green-600
text-white
font-semibold
transition-all
duration-300
hover:-translate-y-1
hover:shadow-xl
"

>


<span
className="
flex
items-center
justify-center
gap-2
"
>

Send Message


<ArrowRight

size={18}

className="
group-hover:translate-x-1
transition
"

/>


</span>


</button>








{/* Trust Points */}


<div
className="
flex
flex-wrap
justify-center
gap-5
pt-3
"
>


<div
className="
flex
items-center
gap-2
text-sm
text-gray-700
"
>

<CheckCircle2
size={16}
className="text-green-600"
/>

100% Secure

</div>



<div
className="
flex
items-center
gap-2
text-sm
text-gray-700
"
>

<CheckCircle2
size={16}
className="text-green-600"
/>

Expert Guidance

</div>




<div
className="
flex
items-center
gap-2
text-sm
text-gray-700
"
>

<CheckCircle2
size={16}
className="text-green-600"
/>

Quick Response

</div>


</div>







{/* Social */}


<div
className="
mt-8
pt-6
border-t
border-gray-200
"
>


<h3
className="
text-xl
font-bold
text-gray-900
"
>

Connect With Us

</h3>


<p
className="
mt-2
text-gray-600
"
>

Follow us for updates, business tips and latest services.

</p>





<div
className="
flex
gap-4
mt-5
"
>


<a
href="#"
className="
w-12
h-12
rounded-full
bg-blue-100
flex
items-center
justify-center
text-[#0B4EA2]
hover:bg-[#0B4EA2]
hover:text-white
transition
hover:-translate-y-1
"
>

<FaFacebookF size={20}/>

</a>





<a
href="#"
className="
w-12
h-12
rounded-full
bg-blue-100
flex
items-center
justify-center
text-[#0B4EA2]
hover:bg-[#0B4EA2]
hover:text-white
transition
hover:-translate-y-1
"
>

<FaLinkedinIn size={20}/>

</a>





<a
href="#"
className="
w-12
h-12
rounded-full
bg-green-100
flex
items-center
justify-center
text-green-600
hover:bg-green-600
hover:text-white
transition
hover:-translate-y-1
"
>

<FaWhatsapp size={22}/>

</a>





<a
href="#"
className="
w-12
h-12
rounded-full
bg-pink-100
flex
items-center
justify-center
text-pink-600
hover:bg-pink-600
hover:text-white
transition
hover:-translate-y-1
"
>

<FaInstagram size={22}/>

</a>



</div>



</div>



</form>


</div>
{/* ================= RIGHT SIDE ================= */}


<div
className="
relative
flex
flex-col
justify-center
"
>


{/* Floating Glow */}

<div
className="
absolute
-top-10
-right-10
w-60
h-60
bg-blue-200/40
rounded-full
blur-3xl
"
/>


<div
className="
absolute
-bottom-10
-left-10
w-52
h-52
bg-green-200/40
rounded-full
blur-3xl
"
/>





<div
className="
relative
z-10
"
>


{/* Badge */}


<span
className="
inline-flex
items-center
gap-2
px-5
py-2
rounded-full
bg-[#0B4EA2]
text-white
font-semibold
shadow-lg
"
>

<Sparkles size={16}/>

Why Choose MegaClick

</span>





{/* Heading */}


<h2
className="
mt-6
text-3xl
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

Let's Build Your

<br/>

Business Together

</h2>






<p
className="
mt-5
text-lg
text-gray-700
leading-8
max-w-xl
"
>

MegaClick simplifies business registration, taxation, legal compliance
and financial services with expert guidance and end-to-end support.

</p>







{/* Benefit Cards */}


<div
className="
mt-10
space-y-5
"
>


{

benefits.map((item,index)=>{


const Icon = item.icon;


return (


<div

key={index}

className="
group
bg-white/90
backdrop-blur-xl
rounded-3xl
p-6
shadow-lg
hover:shadow-2xl
hover:-translate-y-2
transition-all
duration-500
"

>


<div
className="
flex
items-start
gap-5
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
group-hover:bg-[#0B4EA2]
transition
"
>


<Icon

size={25}

className="
text-[#0B4EA2]
group-hover:text-white
transition
"

/>


</div>





<div
className="
flex-1
"
>


<div
className="
flex
justify-between
items-center
"
>


<h3
className="
text-xl
font-bold
text-gray-900
"
>

{item.title}

</h3>



<ArrowUpRight

size={20}

className="
text-gray-300
group-hover:text-[#0B4EA2]
group-hover:rotate-45
transition
"

/>



</div>




<p
className="
mt-2
text-gray-600
leading-7
"
>

{item.text}

</p>


</div>



</div>



</div>


)


})


}



</div>







{/* Stats Cards */}


<div
className="
grid
grid-cols-3
gap-4
mt-10
"
>


<div
className="
bg-white
rounded-3xl
shadow-lg
p-5
text-center
hover:-translate-y-2
transition
"
>

<h3
className="
text-3xl
font-extrabold
text-[#0B4EA2]
"
>

15K+

</h3>


<p
className="
text-sm
text-gray-600
mt-2
"
>

Happy Clients

</p>


</div>





<div
className="
bg-white
rounded-3xl
shadow-lg
p-5
text-center
hover:-translate-y-2
transition
"
>

<h3
className="
text-3xl
font-extrabold
text-green-600
"
>

25+

</h3>


<p
className="
text-sm
text-gray-600
mt-2
"
>

Services

</p>


</div>





<div
className="
bg-white
rounded-3xl
shadow-lg
p-5
text-center
hover:-translate-y-2
transition
"
>

<h3
className="
text-3xl
font-extrabold
text-[#0B4EA2]
"
>

10+

</h3>


<p
className="
text-sm
text-gray-600
mt-2
"
>

Years

</p>


</div>



</div>








{/* Trust Line */}


<div
className="
flex
flex-wrap
gap-6
mt-8
"
>


<div
className="
flex
items-center
gap-2
font-medium
text-gray-700
"
>

<CheckCircle2
size={18}
className="text-green-600"
/>

Trusted Professionals

</div>





<div
className="
flex
items-center
gap-2
font-medium
text-gray-700
"
>

<CheckCircle2
size={18}
className="text-green-600"
/>

Fast Processing

</div>





<div
className="
flex
items-center
gap-2
font-medium
text-gray-700
"
>

<CheckCircle2
size={18}
className="text-green-600"
/>

Transparent Pricing

</div>



</div>




</div>


</div>





</div>


</div>


</section>


);


};


export default ContactSection;