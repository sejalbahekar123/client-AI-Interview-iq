import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from 'axios';
import { SERVER_URL } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];


//see at gpt its all explaination "pricing code" it tells overflow nicely
  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(SERVER_URL + "/api/payment/order" , {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      },{withCredentials:true})
      

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: result.data.amount,
      currency: "INR",
      name: "InterviewIQ.AI",
      description: `${plan.name} - ${plan.credits} Credits`,
      order_id: result.data.id,

      handler:async function (response) {
        const verifypay = await axios.post(SERVER_URL + "/api/payment/verify" ,response , {withCredentials:true})
        dispatch(setUserData(verifypay.data.user))

          alert("Payment Successful 🎉 Credits Added!");
          navigate("/")

      },
      theme:{
        color: "#10b981",
      },

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      setLoadingPlan(null);
    } catch (error) {
     console.log(error)
     setLoadingPlan(null);
    }
  }



  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-6'>

      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>

        <button onClick={() => navigate("/")} className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
          <FaArrowLeft className='text-gray-600' />
        </button>

        <div className="text-center w-full">
          <h1 className="text-4xl font-bold text-gray-800">
            Choose Your Plan
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>


      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>

        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id

          return (
            <motion.div key={plan.id}
              whileHover={!plan.default && { scale: 1.03 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}

              className={`relative rounded-3xl p-8 transition-all duration-300 border 
                ${isSelected
                  ? "border-emerald-600 shadow-2xl bg-white"
                  : "border-gray-200 bg-white shadow-md"
                }
                ${plan.default ? "cursor-default" : "cursor-pointer"}
              `}
            >

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-gray-800">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span className="text-3xl font-bold text-emerald-600">
                  {plan.price}
                </span>
                <p className="text-gray-500 mt-1">
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-6 space-y-3 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-emerald-500 text-sm" />
                    <span className="text-gray-700 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default &&
                <button
                disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      setSelectedPlan(plan.id)
                    } else {
                      handlePayment(plan)
                    }
                  }} className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${isSelected
                    ? "bg-emerald-600 text-white hover:opacity-90"
                    : "bg-gray-100 text-gray-700 hover:bg-emerald-50"
                    }`}>
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected
                      ? "Proceed to Pay"
                      : "Select Plan"}

                </button>
              }
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}

export default Pricing


// import React, { useState } from 'react'

// import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'

// import { useNavigate } from 'react-router-dom'

// import { motion } from "motion/react";

// import axios from 'axios';

// import { SERVER_URL } from '../App';

// import { useDispatch } from 'react-redux';

// import { setUserData } from '../redux/userSlice';


// function Pricing() {

//   // Used to navigate the user to different pages
//   const navigate = useNavigate()

//   // Stores which pricing plan is currently selected
//   // Initially, the Free plan is selected
//   const [selectedPlan, setSelectedPlan] = useState("free");

//   // Stores which plan is currently being processed
//   // null means no payment is currently being processed
//   const [loadingPlan, setLoadingPlan] = useState(null);

//   // Used to update Redux state
//   const dispatch = useDispatch()


//   // All pricing plan information
//   // This data is used to display the pricing cards on the frontend
//   const plans = [

//     {
//       // Unique ID of the Free plan
//       id: "free",

//       // Name shown to the user
//       name: "Free",

//       // Price displayed on the UI
//       price: "₹0",

//       // Number of credits given by this plan
//       credits: 100,

//       // Short description of the plan
//       description: "Perfect for beginners starting interview preparation.",

//       // Features displayed inside the pricing card
//       features: [
//         "100 AI Interview Credits",
//         "Basic Performance Report",
//         "Voice Interview Access",
//         "Limited History Tracking",
//       ],

//       // This tells us that Free is the default plan
//       default: true,
//     },

//     {
//       // Unique ID of the Basic plan
//       id: "basic",

//       // Name shown on the pricing card
//       name: "Starter Pack",

//       // Price displayed on the frontend
//       price: "₹100",

//       // Credits given after purchasing this plan
//       credits: 150,

//       description: "Great for focused practice and skill improvement.",

//       features: [
//         "150 AI Interview Credits",
//         "Detailed Feedback",
//         "Performance Analytics",
//         "Full Interview History",
//       ],
//     },

//     {
//       // Unique ID of the Pro plan
//       id: "pro",

//       name: "Pro Pack",

//       price: "₹500",

//       // Pro plan gives 650 credits
//       credits: 650,

//       description: "Best value for serious job preparation.",

//       features: [
//         "650 AI Interview Credits",
//         "Advanced AI Feedback",
//         "Skill Trend Analysis",
//         "Priority AI Processing",
//       ],

//       // Badge displayed on the Pro plan
//       badge: "Best Value",
//     },
//   ];


//   // This function starts the payment process
//   // It receives the selected plan as an argument
//   const handlePayment = async (plan) => {

//     try {

//       // Store the selected plan ID in loadingPlan
//       // This can be used to show "Processing..." on the button
//       setLoadingPlan(plan.id)


//       // Decide the actual payment amount based on the plan
//       //
//       // basic plan → ₹100
//       // pro plan   → ₹500
//       // free plan  → ₹0
//       const amount =
//         plan.id === "basic" ? 100 :
//         plan.id === "pro" ? 500 : 0;


//       // Send a POST request to the backend
//       //
//       // Backend endpoint:
//       // /api/payment/order
//       //
//       // We send:
//       // planId → which plan user selected
//       // amount → price of the plan
//       // credits → credits given by the plan
//       const result = await axios.post(
//         SERVER_URL + "/api/payment/order",
//         {
//           planId: plan.id,
//           amount: amount,
//           credits: plan.credits,
//         },
//         {
//           // Allows cookies/authentication information
//           // to be sent with the request
//           withCredentials: true
//         }
//       )


//       // Razorpay checkout configuration
//       const options = {

//         // Razorpay public Key ID
//         // This comes from the Vite environment variable
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,

//         // Amount received from the backend
//         // Razorpay expects the amount in paise
//         amount: result.data.amount,

//         // Currency used for the payment
//         currency: "INR",

//         // Name displayed in Razorpay checkout
//         name: "InterviewIQ.AI",

//         // Description displayed to the user
//         // Example:
//         // "Pro Pack - 650 Credits"
//         description: `${plan.name} - ${plan.credits} Credits`,

//         // Razorpay order ID created by our backend
//         order_id: result.data.id,


//         // This function runs after the user completes payment
//         // Razorpay sends payment information inside "response"
//         handler: async function (response) {

//           // Send Razorpay's payment response to our backend
//           //
//           // Backend will verify whether the payment is genuine
//           const verifypay = await axios.post(
//             SERVER_URL + "/api/payment/verify",
//             response,
//             {
//               // Send authentication cookies
//               withCredentials: true
//             }
//           )


//           // Backend sends the updated user
//           // Here we update the Redux user data
//           //
//           // This includes the newly added credits
//           dispatch(setUserData(verifypay.data.user))


//           // Show success message to the user
//           alert("Payment Successful 🎉 Credits Added!");


//           // After successful payment, go back to Home page
//           navigate("/")

//         },


//         // Customize Razorpay checkout theme
//         theme: {
//           color: "#10b981",
//         },

//       }


//       // Create a Razorpay checkout object
//       //
//       // "options" contains all payment information
//       // required by Razorpay
//       const rzp = new window.Razorpay(options)


//       // Open the Razorpay payment popup/window
//       rzp.open()


//       // Payment checkout has been opened,
//       // so remove the loading state
//       setLoadingPlan(null);

//     } catch (error) {

//       // If anything goes wrong,
//       // print the error in the browser console
//       console.log(error)

//       // Remove loading state
//       setLoadingPlan(null);

//     }

//   }


//   return (

//     <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-6'>


//       {/* Header section */}
//       <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>


//         {/* Back button */}
//         <button
//           onClick={() => navigate("/")}
//           className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'
//         >

//           {/* Back arrow icon */}
//           <FaArrowLeft className='text-gray-600' />

//         </button>


//         {/* Page heading */}
//         <div className="text-center w-full">

//           <h1 className="text-4xl font-bold text-gray-800">
//             Choose Your Plan
//           </h1>

//           <p className="text-gray-500 mt-3 text-lg">
//             Flexible pricing to match your interview preparation goals.
//           </p>

//         </div>

//       </div>


//       {/* Pricing cards container */}
//       <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>


//         {/* Loop through every pricing plan */}
//         {plans.map((plan) => {

//           // Check whether this plan is currently selected
//           const isSelected = selectedPlan === plan.id


//           return (

//             <motion.div
//               key={plan.id}

//               // When user hovers over a non-default plan,
//               // slightly increase its size
//               whileHover={!plan.default && { scale: 1.03 }}

//               // If plan is not Free,
//               // clicking the card selects the plan
//               onClick={() =>
//                 !plan.default && setSelectedPlan(plan.id)
//               }

//               className={`relative rounded-3xl p-8 transition-all duration-300 border 

//                 ${
//                   isSelected

//                     // Styling when the plan is selected
//                     ? "border-emerald-600 shadow-2xl bg-white"

//                     // Styling when the plan is not selected
//                     : "border-gray-200 bg-white shadow-md"
//                 }

//                 ${
//                   // Free plan cannot be selected
//                   // Other plans can be clicked
//                   plan.default
//                     ? "cursor-default"
//                     : "cursor-pointer"
//                 }

//               `}
//             >


//               {/* 
//                 Display "Best Value" badge
//                 only if the plan has a badge
//               */}
//               {plan.badge && (

//                 <div className="absolute top-6 right-6 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full shadow">

//                   {plan.badge}

//                 </div>

//               )}


//               {/* 
//                 Display "Default" badge
//                 only for the Free plan
//               */}
//               {plan.default && (

//                 <div className="absolute top-6 right-6 bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">

//                   Default

//                 </div>

//               )}


//               {/* Plan name */}
//               <h3 className="text-xl font-semibold text-gray-800">

//                 {plan.name}

//               </h3>


//               {/* Plan price */}
//               <div className="mt-4">

//                 <span className="text-3xl font-bold text-emerald-600">

//                   {plan.price}

//                 </span>


//                 {/* Number of credits */}
//                 <p className="text-gray-500 mt-1">

//                   {plan.credits} Credits

//                 </p>

//               </div>


//               {/* Plan description */}
//               <p className="text-gray-500 mt-4 text-sm leading-relaxed">

//                 {plan.description}

//               </p>


//               {/* Features section */}
//               <div className="mt-6 space-y-3 text-left">


//                 {/* Loop through all features */}
//                 {plan.features.map((feature, i) => (

//                   <div
//                     key={i}
//                     className="flex items-center gap-3"
//                   >

//                     {/* Check mark icon */}
//                     <FaCheckCircle className="text-emerald-500 text-sm" />

//                     {/* Feature text */}
//                     <span className="text-gray-700 text-sm">

//                       {feature}

//                     </span>

//                   </div>

//                 ))}

//               </div>


//               {/* 
//                 Show the button only for paid plans.
//                 Free plan doesn't need a payment button.
//               */}
//               {!plan.default && (

//                 <button

//                   // Disable the button while this plan is processing
//                   disabled={loadingPlan === plan.id}


//                   onClick={(e) => {

//                     // Prevent the click from also triggering
//                     // the parent card's onClick
//                     e.stopPropagation();


//                     // If the plan is NOT selected yet,
//                     // select it first
//                     if (!isSelected) {

//                       setSelectedPlan(plan.id)

//                     }

//                     // If it is already selected,
//                     // start the payment process
//                     else {

//                       handlePayment(plan)

//                     }

//                   }}


//                   className={`w-full mt-8 py-3 rounded-xl font-semibold transition ${
                    
//                     isSelected

//                       // Selected plan → green payment button
//                       ? "bg-emerald-600 text-white hover:opacity-90"

//                       // Not selected → gray select button
//                       : "bg-gray-100 text-gray-700 hover:bg-emerald-50"

//                   }`}
//                 >


//                   {/* 
//                     Button text changes depending on the state:

//                     loading → Processing...

//                     selected → Proceed to Pay

//                     not selected → Select Plan
//                   */}
//                   {loadingPlan === plan.id

//                     ? "Processing..."

//                     : isSelected

//                       ? "Proceed to Pay"

//                       : "Select Plan"}

//                 </button>

//               )}

//             </motion.div>

//           )

//         })}

//       </div>

//     </div>

//   )

// }

// export default Pricing