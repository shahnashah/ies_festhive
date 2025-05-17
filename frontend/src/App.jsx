import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Contact from "../src/pages/Contactus";
import LoginPage from "./pages/login";
import SignupPage from "./pages/Signup";
import AddEvent from "./pages/Event";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import ForgotPasswordPage from "./pages/ForgetPassword"
import OTPVerificationPage from "./pages/Otpverification"
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/Admindasboard"
import AdminLogin from "./pages/Adminlogin"


import RegisterVolunteer from "./pages/Volunteer";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import EventRegistrationForm from "./pages/eventregistration";
import { Slide } from "react-toastify";
import PublicEvents from "./pages/PublicEvent";
import EventDetails from './pages/EventDetails';  
import UserEvents from "./pages/UserEvents";


// Component to conditionally render Navbar
// const Header = () => {
//   const location = useLocation();
  
//   const noHeaderRoutes = ["/login", "/signup"];
//   const shouldShowHeader = !noHeaderRoutes.some((route) =>
//     location.pathname.startsWith(route)
//   );

//   return shouldShowHeader ? (
    //  <header className="sticky top-0 z-50 bg-white shadow-md">
    //   <Header />
    // </header>
//   ) : null;
// };

const initialCartState = { cartItems: [] };

function App() {
  return (
    <BrowserRouter>
    
      {/* <Header /> */}

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/event" element={<PublicEvents />} />
      <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/contact" element={<Contact />} />
       // <Route path = "/userDashboard" element = {<UserDashboard /> } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/volunteer" element={<RegisterVolunteer />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/admin/add-event" element={<AddEvent />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
         <Route path="/admin-dashboard" element={<Dashboard />} />
         <Route path="/slide" element={<Slide />} />
         
         <Route path="/dashboard" element={<AdminDashboard />} />
         <Route path="/userevents" element={<UserEvents />} />
         
   
          <Route path="/event/:id" element={<EventDetails />} />
        
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
