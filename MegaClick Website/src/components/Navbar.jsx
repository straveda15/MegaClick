import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  UserRound,
} from "lucide-react";

import {
  Link,
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





// Shadow on scroll

useEffect(()=>{


const handleScroll = ()=>{

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
px-6
lg:px-24
py-2
"

>



<div

className="
h-10
flex
items-center
justify-between
"

>






{/* LOGO */}


<Link

to="/"

className="
flex
items-center
gap-3
h-16
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
shadow-lg
shadow-blue-200/90
transition-all
duration-300
hover:scale-105
"

/>



<div>


<h1

className="
text-xl
font-bold
text-[#0B4EA2]
"

>

Mega

<span className="text-green-600">

Click

</span>


</h1>


<p className="text-xs text-gray-500">

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
gap-10
text-sm
"

>





{/* HOME */}

<Link

to="/"

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



{/* ASSOCIATE WITH US */}

<NavLink

to="/associate-with-us"

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









{/* RIGHT BUTTONS */}


<div

className="
hidden
lg:flex
items-center
"

>



<button

onClick={()=>scrollToSection("contact")}

className="
flex
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









</div>








{/* MOBILE MENU BUTTON */}


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

</div>


</header>


</>

);


}


export default Navbar;