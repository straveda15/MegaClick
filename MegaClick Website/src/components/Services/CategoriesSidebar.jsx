import React, { useState } from "react";


const categories = [

  {
    name: "All Services",
    icon: "🌐",
    count: 36,
    services: []
  },


{
name:"Legal Services",
icon:"⚖️",
count:12,

services:[

"Marriage Registration",

"Leave & Licence / Rent Agreement",

"Tenant Police Verification",

"Govt. Gazette – Name / DOB / Religion Change",

"Partnership Deed (Notary & Registration of Firm)",

"Sale Deed / Will / Gift Deed",

"Mortgage Deed / Release Deed",

"Title Search Report",

"Trademark Registration",

"Patent / Copyright Registration",

"Digital 7/12 & Mutation Entries",

"Character Certificate by Police"

]

},

{
name:"Other Services",
icon:"🏢",
count:12,

services:[

"Real Estate Services (Sell / Purchase / Rent / Lease)",

"Name Transfer & Address Update in Light Bill",

"Name Transfer in Property / Water Tax Bill / NMC Services",

"All Types of Insurance",

"Services for Start-Ups",

"Digital Marketing",

"MSME / UDYAM Registration",

"Shop Act License",

"FSSAI / Food License",

"Passport Services",

"Voter ID / PAN / TAN Services",

"Liquor Consumption License"

]

},

{
name:"Business / Financial Services",
icon:"💼",
count:12,
services:[

"Income Tax Services",

"GST Registration & Filing",

"Bank Loan / Financing Consultancy",

"Liaisoning with Govt. Offices",

"Tender Consultancy",

"Company Registration & Annual Compliance",

"LLP Registration & Related Compliance",

"Accounting / Audit Services",

"Project Report & Financing",

"Trust Registration & Audit",

"Import Export Code (IEC)",

"Digital Signature Certificate (DSC)"

]
}
];





const CategoriesSidebar = ({

 selectedCategory,

 setSelectedCategory,

 setSelectedService

}) => {



const [openCategory,setOpenCategory] =

useState("");







return (



<aside

className="

sticky

top-24

bg-white

rounded-3xl

border

border-gray-200

shadow-lg

p-4

"

>



{/* Header */}


<div className="px-3 mb-5">


<h3

className="

font-bold

text-lg

text-gray-800

"

>

📂 Service Categories

</h3>


<p

className="

text-xs

text-gray-500

mt-1

"

>

Choose your required service

</p>


</div>









<div className="space-y-3">


{

categories.map((category)=>(


<div

key={category.name}

>





{/* CATEGORY BUTTON */}


<button


onClick={()=>{


setSelectedCategory(category.name);


setSelectedService(null);



if(category.name !== "All Services"){


setOpenCategory(

openCategory === category.name

?

""

:

category.name

);


}

else{


setOpenCategory("");

}


}}



className={`

w-full

flex

items-center

justify-between

p-4

rounded-2xl

transition-all

duration-300



${

selectedCategory === category.name

?

"bg-blue-600 text-white shadow-md"

:

"bg-gray-50 hover:bg-blue-50 text-gray-700"

}


`}



>



<div

className="

flex

items-center

gap-3

"

>


<span className="text-xl">

{category.icon}

</span>



<span

className="

font-semibold

text-sm

"

>

{category.name}

</span>


</div>








{/* Count */}

<span

className={`

text-xs

px-3

py-1

rounded-full

font-semibold



${

selectedCategory === category.name

?

"bg-white text-blue-600"

:

"bg-gray-200 text-gray-700"

}


`}

>

{category.count}

</span>





</button>









{/* SUB SERVICES */}


{

category.name !== "All Services" &&

openCategory === category.name &&

(



<div

className="

mt-3

ml-2

space-y-2

"

>


{

category.services.map((service)=>(


<button


key={service}



onClick={()=>{


setSelectedCategory(category.name);


setSelectedService(service);


}}




className="

w-full

text-left

px-4

py-3

rounded-xl

text-sm

bg-white

border

border-gray-200

text-gray-700

hover:bg-blue-50

hover:border-blue-200

transition-all

"

>


{service}



</button>


))


}



</div>



)

}



</div>


))


}



</div>




</aside>


);


};



export default CategoriesSidebar;