// import React, { useState } from "react";
// import { Mail, Smartphone } from "lucide-react";


// const Login = () => {


//   const [type, setType] = useState("mobile");

//   const [message, setMessage] = useState("");

//   const [checked, setChecked] = useState(false);




//   const handleOTP = () => {

//     if(!checked){
//       setMessage("Please accept terms & conditions first");
//       return;
//     }


//     if(type === "mobile"){
//       setMessage("OTP sent successfully to your mobile number");
//     }
//     else{
//       setMessage("OTP sent successfully to your email");
//     }

//   };




//   return (

//     <div className="
//       min-h-screen
//       bg-gray-50
//       flex
//       items-center
//       justify-center
//       px-5
//     ">


//       <div className="
//         w-full
//         max-w-md
//         bg-white
//         rounded-3xl
//         shadow-xl
//         border
//         border-gray-100
//         p-8
//       ">



//         {/* Heading */}

//         <h1 className="
//           text-4xl
//           font-bold
//           text-gray-900
//           mb-3
//         ">
//           Sign in
//         </h1>



//         <p className="
//           text-gray-500
//           text-base
//           leading-relaxed
//           mb-6
//         ">

//           Verify with a one-time 
//           <span className="text-red-600">
//             {" "}OTP
//           </span>
//           {" "}— no passwords needed.

//         </p>






//         {/* Toggle */}

//         <div className="
//           flex
//           bg-gray-100
//           rounded-2xl
//           p-1
//           mb-7
//         ">



//           <button

//             onClick={()=> {
//               setType("mobile");
//               setMessage("");
//             }}

//             className={`
//               flex-1
//               py-3
//               rounded-xl
//               font-semibold
//               transition

//               ${
//                 type==="mobile"
//                 ?
//                 "bg-white text-red-700 shadow-sm"
//                 :
//                 "text-gray-600"
//               }

//             `}

//           >

//             <div className="
//               flex
//               justify-center
//               items-center
//               gap-2
//             ">

//               <Smartphone size={17}/>

//               Mobile

//             </div>


//           </button>







//           <button

//             onClick={()=> {
//               setType("email");
//               setMessage("");
//             }}

//             className={`
//               flex-1
//               py-3
//               rounded-xl
//               font-semibold
//               transition

//               ${
//                 type==="email"
//                 ?
//                 "bg-white text-red-700 shadow-sm"
//                 :
//                 "text-gray-600"
//               }

//             `}

//           >

//             <div className="
//               flex
//               justify-center
//               items-center
//               gap-2
//             ">

//               <Mail size={17}/>

//               Email

//             </div>


//           </button>


//         </div>









//         {/* Input */}

//         <label className="
//           text-gray-800
//           font-medium
//           block
//           mb-3
//         ">

//           {
//             type==="mobile"
//             ?
//             "Mobile number"
//             :
//             "Email address"
//           }

//         </label>





//         <input


//           type={
//             type==="mobile"
//             ?
//             "tel"
//             :
//             "email"
//           }


//           placeholder={
//             type==="mobile"
//             ?
//             "98765 43210"
//             :
//             "example@gmail.com"
//           }


//           className="
//             w-full
//             border
//             border-gray-200
//             rounded-xl
//             px-5
//             py-3.5
//             text-gray-700
//             outline-none
//             focus:ring-2
//             focus:ring-blue-200
//             mb-7
//           "

//         />









//         {/* Checkbox */}


//         <div className="
//           flex
//           gap-3
//           items-start
//           mb-8
//         ">


//           <input

//             type="checkbox"

//             checked={checked}

//             onChange={(e)=>setChecked(e.target.checked)}

//             className="
//               mt-1
//               w-5
//               h-5
//               accent-red-600
//             "

//           />



//           <p className="
//             text-gray-600
//             text-sm
//             leading-relaxed
//           ">

//             I agree to the terms & conditions and privacy policy

//           </p>


//         </div>









//         {/* OTP Button */}


//         <button


//           onClick={handleOTP}


//           className="
//             w-full
//             bg-[#B3262E]
//             hover:bg-[#991f27]
//             text-white
//             py-3.5
//             rounded-xl
//             font-bold
//             text-lg
//             transition
//           "

//         >

//           Send OTP


//         </button>







//         {
//           message && (

//             <p className="
//               text-center
//               mt-4
//               text-sm
//               font-medium
//               text-green-600
//             ">

//               {message}

//             </p>

//           )
//         }









//         {/* Divider */}


//         <div className="
//           flex
//           items-center
//           gap-4
//           my-8
//         ">


//           <div className="
//             h-px
//             bg-gray-200
//             flex-1
//           "></div>



//           <span className="
//             text-red-600
//             text-sm
//             font-medium
//           ">

//             Or continue with

//           </span>




//           <div className="
//             h-px
//             bg-gray-200
//             flex-1
//           "></div>



//         </div>









//         {/* Google Button */}


//         <button


//           onClick={()=>{
//             setMessage("Google login selected");
//           }}


//           className="
//             w-full
//             border
//             border-gray-300
//             rounded-full
//             py-3
//             flex
//             justify-center
//             items-center
//             gap-3
//             text-gray-700
//             font-medium
//             hover:bg-gray-50
//             transition
//           "


//         >


//           <span className="
//             text-xl
//             font-bold
//           ">

//             G

//           </span>


//           Google


//         </button>









//         {/* Signup */}


//         <p className="
//           text-center
//           text-gray-500
//           mt-8
//         ">


//           Don't have an account?


//           <span

//             onClick={()=>setMessage("Redirecting to signup page...")}

//             className="
//               text-red-600
//               font-semibold
//               cursor-pointer
//               ml-1
//             "

//           >

//             Sign up free

//           </span>


//         </p>





//       </div>



//     </div>


//   );

// };


// export default Login;