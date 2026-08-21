
import { useEffect, useState } from "react";
import TopBar from "./TopBar";

import {
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";


import logo from "../assets/LOGO.png";



function Navbar({ showTopBar = false }) {


const [menuOpen,setMenuOpen] = useState(false);

const [scrolled,setScrolled] = useState(false);


const navigate = useNavigate();

const location = useLocation();


const activePage = location.pathname;






useEffect(()=>{


const handleScroll=()=>{

setScrolled(window.scrollY > 20);

};


window.addEventListener(
"scroll",
handleScroll
);


return ()=>{

window.removeEventListener(
"scroll",
handleScroll
);

};


},[]);









const scrollToSection=(id)=>{


if(location.pathname !== "/"){


navigate("/");


setTimeout(()=>{


document
.getElementById(id)
?.scrollIntoView({

behavior:"smooth"

});


},300);


}

else{


document
.getElementById(id)
?.scrollIntoView({

behavior:"smooth"

});


}


setMenuOpen(false);


};









const closeMenu=()=>{

setMenuOpen(false);

};







return (

<>

{showTopBar && <TopBar />}



<header

className={`

sticky

top-0

z-50

bg-white

transition-all

duration-300


${
scrolled

?

"shadow-md"

:

"shadow-sm"

}

`}

>





<div

className="
max-w-[1500px]

mx-auto

px-5

sm:px-8

lg:px-16

xl:px-24

"

>



<div

className="
h-16

flex

items-center

justify-between

"

>








{/* LOGO */}


<Link

to="/"

onClick={closeMenu}

className="
flex

items-center

gap-3

"

>



<img

src={logo}

alt="MegaClick"

className="

w-11

h-11

sm:w-12

sm:h-12

rounded-full

object-contain

p-1

border

border-blue-300

shadow-md

transition

hover:scale-105

"

/>






<div>


<h1

className="
text-lg

sm:text-xl

font-bold

"

>


<span className="text-[#0B4EA2]">

Mega

</span>


<span className="text-green-600">

Click

</span>



</h1>




<p

className="
text-[11px]

sm:text-xs

text-gray-500

"

>

Enterprises

</p>



</div>



</Link>









{/* DESKTOP NAV */}


<nav

className="
hidden

lg:flex

items-center

gap-8

xl:gap-10

text-sm

"

>


{/* HOME */}

<Link

to="/"

onClick={closeMenu}

className={`

relative

font-medium

pb-1

transition


after:absolute

after:left-0

after:-bottom-1

after:h-[2px]

after:bg-[#0B4EA2]


after:transition-all


${
activePage === "/"

?

"after:w-full text-[#0B4EA2]"

:

"after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"

}

`}

>

Home

</Link>








{/* ABOUT */}

<Link

to="/about"

onClick={closeMenu}

className={`

relative

font-medium

pb-1

transition


after:absolute

after:left-0

after:-bottom-1

after:h-[2px]

after:bg-[#0B4EA2]


after:transition-all


${
activePage === "/about"

?

"after:w-full text-[#0B4EA2]"

:

"after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"

}

`}

>

About Us

</Link>







{/* SERVICES */}

<Link

to="/services"

onClick={closeMenu}

className={`

relative

font-medium

pb-1

transition


after:absolute

after:left-0

after:-bottom-1

after:h-[2px]

after:bg-[#0B4EA2]


after:transition-all


${
activePage.startsWith("/services")

?

"after:w-full text-[#0B4EA2]"

:

"after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"

}

`}

>

Services

</Link>









{/* ASSOCIATE */}

<NavLink

to="/associate-with-us"

onClick={closeMenu}

className={`

relative

font-medium

pb-1

transition


after:absolute

after:left-0

after:-bottom-1

after:h-[2px]

after:bg-[#0B4EA2]


after:transition-all


${
activePage === "/associate-with-us"

?

"after:w-full text-[#0B4EA2]"

:

"after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"

}

`}

>

Associate With Us

</NavLink>







{/* CONTACT */}

<Link

to="/contact"

onClick={closeMenu}

className={`

relative

font-medium

pb-1

transition


after:absolute

after:left-0

after:-bottom-1

after:h-[2px]

after:bg-[#0B4EA2]


after:transition-all


${
activePage === "/contact"

?

"after:w-full text-[#0B4EA2]"

:

"after:w-0 hover:after:w-full text-gray-700 hover:text-[#0B4EA2]"

}

`}

>

Contact Us

</Link>



</nav>









{/* DESKTOP BUTTON */}


<button

onClick={()=>scrollToSection("contact")}

className="
hidden

lg:flex

items-center

gap-2

bg-green-600

hover:bg-green-700

text-white

px-5

py-2.5

rounded-md

font-semibold

text-sm

transition

"

>


Get Free Consultation


<ArrowRight size={16}/>


</button>









{/* MOBILE BUTTON */}


<button

className="lg:hidden"

onClick={()=>setMenuOpen(!menuOpen)}

>

{

menuOpen

?

<X size={28}/>

:

<Menu size={28}/>

}


</button>


</div>








{/* MOBILE MENU */}


{

menuOpen && (


<div

className="
lg:hidden

bg-white

border-t

border-gray-100

py-5

space-y-4

"

>



<Link

to="/"

onClick={closeMenu}

className="
block

px-4

font-medium

text-gray-700

hover:text-[#0B4EA2]

"

>

Home

</Link>




<Link

to="/about"

onClick={closeMenu}

className="
block

px-4

font-medium

text-gray-700

hover:text-[#0B4EA2]

"

>

About Us

</Link>





<Link

to="/services"

onClick={closeMenu}

className="
block

px-4

font-medium

text-gray-700

hover:text-[#0B4EA2]

"

>

Services

</Link>





<Link

to="/associate-with-us"

onClick={closeMenu}

className="
block

px-4

font-medium

text-gray-700

hover:text-[#0B4EA2]

"

>

Associate With Us

</Link>






<Link

to="/contact"

onClick={closeMenu}

className="
block

px-4

font-medium

text-gray-700

hover:text-[#0B4EA2]

"

>

Contact Us

</Link>






<button

onClick={()=>scrollToSection("contact")}

className="
mx-4

w-[calc(100%-2rem)]

flex

justify-center

items-center

gap-2

bg-green-600

text-white

py-3

rounded-lg

font-semibold

"

>

Get Free Consultation


<ArrowRight size={16}/>


</button>



</div>


)


}



</div>


</header>


</>


);


}


export default Navbar;
