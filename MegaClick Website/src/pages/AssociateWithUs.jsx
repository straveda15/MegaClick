import React, { useState } from "react";


import {
  Mail,
  MapPin,
  Rocket,
  BriefcaseBusiness,
  Send,
} from "lucide-react";



const professions = [
  "Chartered Accountant",
  "Company Secretary",
  "Advocate",
  "CMA",
  "Tax & Compliance Professional",
  "Startup Advisor",
];


const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];


const expertise = [
  "Income Tax",
  "GST",
  "Audit",
  "ROC Filing",
  "TDS",
  "Bookkeeping",
  "CFO Services",
  "Business Advisory",
  "ITR Filing",
];




const AssociateWithUs = () => {


const [selectedExpertise,setSelectedExpertise] = useState([]);



const toggleExpertise = (item)=>{

if(selectedExpertise.includes(item)){

setSelectedExpertise(
selectedExpertise.filter(
(skill)=>skill !== item
)
);

}
else{

setSelectedExpertise([
...selectedExpertise,
item
]);

}

};




return (

<section
className="
py-20
bg-gray-50
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
lg:grid-cols-5
gap-10
items-start
"
>



{/* ================= LEFT SECTION ================= */}


<div
className="
lg:col-span-2
"
>


<div
className="
bg-[#F1F7FF]
border
border-gray-200
rounded-3xl
shadow-xl
p-8
lg:p-10
min-h-[860px]
transition-all
duration-500
hover:bg-green-50
hover:shadow-2xl
hover:-translate-y-2
"
>

{/* Contact Badge */}



<div

className="

inline-flex

items-center

gap-2

px-5

py-2

rounded-full

bg-green-100

text-green-700

font-semibold

text-sm

mb-6

"

>



<BriefcaseBusiness size={17}/>



Contact Us



</div>

<h2
className="
text-3xl
font-bold
text-gray-900
leading-snug
"
>

We are currently onboarding a limited number of professionals as part of{" "}
<span className="text-[#0B4EA2]">
Mega
</span>
<span className="text-[#0A8F55]">
Click
</span>
's founding network.

</h2>



<p
className="
mt-5
text-gray-600
leading-7
"
>

If you are interested in being part of
MegaClick's founding network,
share your details and our team will connect with you.

</p>





{/* Email */}

<div
className="
flex
items-center
gap-4
mt-8
"
>


<div
className="
w-11
h-11
rounded-xl
bg-white
border
border-black-300
flex
items-center
justify-center
text-green-600
"
>

<Mail size={16}/>

</div>



<div>

<strong
className="
block
text-gray-900
"
>

Email

</strong>


<span
className="
text-gray-600
"
>

megaclickofficial@gmail.com

</span>


</div>


</div>








{/* Coverage */}


<div
className="
flex
items-center
gap-4
mt-6
"
>


<div
className="
w-11
h-11
rounded-xl
bg-white
border
border-black-300
flex
items-center
justify-center
text-green-600
"
>

<MapPin size={16}/>

</div>



<div>

<strong
className="
block
text-gray-900
"
>

Coverage

</strong>


<span
className="
text-gray-600
"
>

Building India-wide professional network

</span>


</div>


</div>









{/* Status */}


<div
className="
flex
items-center
gap-4
mt-6
"
>


<div
className="
w-11
h-11
rounded-xl
bg-white
border
border-black-300
flex
items-center
justify-center
text-green-600
"
>

<Rocket size={16}/>

</div>



<div>

<strong
className="
block
text-gray-900
"
>

Status

</strong>


<span
className="
text-gray-600
"
>

The MegaClick platform is currently being built

</span>


</div>


</div>




</div>


</div>





{/* ================= RIGHT SECTION START ================= */}


<div
className="
lg:col-span-3
"
>


<div
className="
bg-white
border 
border-gray-200
rounded-3xl
shadow-xl
min-h-[600px]
p-8
lg:p-10
"
>


<form
  action="send_contact.php"
  method="post"
  aria-label="MegaClick early professional network contact form"
  id="contactForm"
>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">


{/* Name */}
<div>
<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
Name <span className="text-red-500">*</span>
</label>

<input
type="text"
name="full_name"
required
placeholder="Enter your name"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>
</div>



{/* Mobile */}
<div>
<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
Mobile <span className="text-red-500">*</span>
</label>

<input
type="tel"
name="phone"
required
placeholder="Enter your mobile number"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>
</div>



{/* Email */}
<div>
<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
Email <span className="text-red-500">*</span>
</label>

<input
type="email"
name="email"
required
placeholder="Enter your email address"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>
</div>




{/* Profession */}
<div>
<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
Select Profession <span className="text-red-500">*</span>
</label>

<select
name="profession"
required
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
>

<option>Chartered Accountant</option>
<option>Company Secretary</option>
<option>Advocate</option>
<option>CMA</option>
<option>
Startup Advisor
</option>

</select>

</div>





{/* Firm Name */}
<div>
<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
Firm Name <span className="text-red-500">*</span>
</label>

<input
type="text"
name="firm_name"
required
placeholder="Enter your firm name"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>
</div>





{/* Experience */}
<div>
<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
Years of Experience <span className="text-red-500">*</span>
</label>

<input
type="text"
name="experience_years"
required
placeholder="Enter your years of experience"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>

</div>





{/* LinkedIn */}
<div>
<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
LinkedIn Profile
</label>

<input
type="url"
name="linkedin_profile"
placeholder="Enter your LinkedIn profile URL"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>

</div>





{/* Website */}
<div>
<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
Website
</label>

<input
type="url"
name="website"
placeholder="Enter your website URL"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>

</div>





{/* Pincode City State 3 Column */}

<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">


<div>

<label className="
block
mb-2
text-sm
font-semibold
text-gray-800
">
Pincode <span className="text-red-500">*</span>
</label>


<input
type="text"
name="pincode"
required
placeholder="Enter 6-digit pincode"
maxLength="6"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>

</div>





<div>

<label className="
block
mb-2
text-sm
font-semibold
text-gray-800
">
City <span className="text-red-500">*</span>
</label>


<input
type="text"
name="city"
required
placeholder="Enter City Name"
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>

</div>





<div>

<label className="
block
mb-2
text-sm
font-semibold
text-gray-800
">
State <span className="text-red-500">*</span>
</label>

<select
name="state"
required
className="
w-full
h-14
rounded-xl
bg-gray-50
border
border-gray-200
px-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
>

<option value="">
Select State
</option>

<option>Andhra Pradesh</option>
<option>Arunachal Pradesh</option>
<option>Assam</option>
<option>Bihar</option>
<option>Chhattisgarh</option>
<option>Goa</option>
<option>Gujarat</option>
<option>Haryana</option>
<option>Himachal Pradesh</option>
<option>Jharkhand</option>
<option>Karnataka</option>
<option>Kerala</option>
<option>Madhya Pradesh</option>
<option>Maharashtra</option>
<option>Manipur</option>
<option>Meghalaya</option>
<option>Mizoram</option>
<option>Nagaland</option>
<option>Odisha</option>
<option>Punjab</option>
<option>Rajasthan</option>
<option>Sikkim</option>
<option>Tamil Nadu</option>
<option>Telangana</option>
<option>Tripura</option>
<option>Uttar Pradesh</option>
<option>Uttarakhand</option>
<option>West Bengal</option>

<option>Andaman and Nicobar Islands</option>
<option>Chandigarh</option>
<option>Dadra and Nagar Haveli and Daman and Diu</option>
<option>Delhi</option>
<option>Jammu and Kashmir</option>
<option>Ladakh</option>
<option>Lakshadweep</option>
<option>Puducherry</option>

</select>

</div>


</div>





{/* Message */}

<div className="md:col-span-2">

<label
className="
block
mb-2
text-sm
font-semibold
text-gray-800
"
>
What Challenge Do You Believe MegaClick Should Solve?
<span className="text-red-500">*</span>
</label>


<textarea
name="message"
required
placeholder="Tell us what challenge MegaClick should solve"
className="
w-full
h-32
rounded-xl
bg-gray-50
border
border-gray-200
px-4
py-4
text-sm
outline-none
focus:bg-white
focus:border-[#0B4EA2]
"
/>


</div>





{/* Button */}
<div className="col-span-1 md:col-span-2">

<button
type="submit"
id="contactSubmitBtn"
className="
w-full
h-14
rounded-xl
bg-[#0A8F55]
text-white
font-semibold
flex
items-center
justify-center
gap-3
transition-all
duration-300
hover:bg-[#087A48]
"
>

<span id="contactSubmitText">
Submit Interest
</span>
<Send size={18} />

<i className="fa-solid fa-paper-plane"></i>

</button>

</div>

</div>

</form>


</div>

</div>

</div>

</div>

</section>

);


};


export default AssociateWithUs;
