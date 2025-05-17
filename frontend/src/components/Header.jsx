// import React, { useState, useEffect } from 'react';
// import { Link as RouterLink, useLocation } from 'react-router-dom';
// import { Link as ScrollLink } from 'react-scroll';
// import { Menu, X } from 'lucide-react';

// const Header = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location]);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const scrollLinkProps = {
//     smooth: true,
//     duration: 500,
//     offset: -80,
//     activeClass: "text-yellow-500",
//     className: "cursor-pointer text-yellow-400 hover:text-yellow-500",
//   };

//   return (
//     <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-black'}`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4">
//           <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-700">
//             <RouterLink to="/">IES Festhive</RouterLink>
//           </div>

//           {/* Desktop Nav */}
//           <nav className="hidden md:flex space-x-8">
//             <RouterLink to="/" className="text-yellow-400 hover:text-yellow-500">Home</RouterLink>
//             <RouterLink to="/event" className="text-yellow-400 hover:text-yellow-500">Events</RouterLink>
//             <ScrollLink to="contact" {...scrollLinkProps}>Contact</ScrollLink>
//             <ScrollLink to="about" {...scrollLinkProps}>About Us</ScrollLink>
//           </nav>

//           {/* Desktop Buttons */}
//           <div className="hidden md:flex space-x-4">
//             <RouterLink to="/signup"><button className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800">Signup</button></RouterLink>
//             <RouterLink to="/login"><button className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800">Login</button></RouterLink>
//           </div>

//           {/* Mobile Menu Icon */}
//           <div className="md:hidden">
//             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-yellow-400">
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden flex flex-col bg-black px-4 py-4 space-y-4 text-yellow-400 rounded-b-lg shadow-lg transition-all duration-300">
//             <RouterLink to="/" className="hover:text-yellow-500">Home</RouterLink>
//             <RouterLink to="/event" className="hover:text-yellow-500">Events</RouterLink>
//             <ScrollLink to="contact" {...scrollLinkProps}>Contact</ScrollLink>
//             <ScrollLink to="about" {...scrollLinkProps}>About Us</ScrollLink>
//             <RouterLink to="/signup">
//               <button className="mt-4 bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800 w-full">Signup</button>
//             </RouterLink>
//             <RouterLink to="/login">
//               <button className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800 w-full">Login</button>
//             </RouterLink>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;


import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import axios from 'axios';


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();




  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    // This would typically be replaced with your actual authentication check
    const checkAuth = () => {
      const currentUserString = localStorage.getItem('user');
      const currentUser = JSON.parse(currentUserString);
      
      if (currentUser) {
        // In a real app, you might decode the token or fetch user data from an API
        setIsLoggedIn(true);
        
        // Mock user data - this would come from your auth system
        setUser(currentUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    
    localStorage.removeItem('user');
    navigate('/');
    
    setIsLoggedIn(false);
    setUser(null);
    setProfileDropdownOpen(false);
    // In a real app, you might also redirect to home or login page
  };

  const scrollLinkProps = {
    smooth: true,
    duration: 500,
    offset: -80,
    activeClass: "text-yellow-500",
    className: "cursor-pointer text-yellow-400 hover:text-yellow-500",
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-black'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-700">
            <RouterLink to="/">IES Festhive</RouterLink>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <RouterLink to="/" className="text-yellow-400 hover:text-yellow-500">Home</RouterLink>
            <RouterLink to="/event" className="text-yellow-400 hover:text-yellow-500">Events</RouterLink>
            <ScrollLink to="contact" {...scrollLinkProps}>Contact</ScrollLink>
            <ScrollLink to="about" {...scrollLinkProps}>About Us</ScrollLink>
          </nav>

          {/* Desktop Buttons - Conditionally rendered based on login state */}
          <div className="hidden md:flex items-center">
            {isLoggedIn && user ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-500"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="bg-yellow-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {/* {user.name.charAt(0)} */}
                    <img src={user.profilePic} className='rounded-full w-8 h-8' alt="" />
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown size={16} />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-yellow-700 rounded shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-yellow-700">
                      <p className="font-semibold text-yellow-400">{user.fullName}</p>
                      <p className="text-sm text-yellow-400/80 overflow-hidden">{user.email}</p>
                    </div>
                    <RouterLink to="/profile" className="block w-full text-left px-4 py-2 hover:bg-yellow-700/20 text-yellow-400">
                      Profile
                    </RouterLink>
                    <RouterLink to="/userEvents" className="block w-full text-left px-4 py-2 hover:bg-yellow-700/20 text-yellow-400">
                      My Events
                    </RouterLink>
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-yellow-700/20 flex items-center space-x-2 text-yellow-400"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <RouterLink to="/signup"><button className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800">Signup</button></RouterLink>
                <RouterLink to="/login"><button className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800">Login</button></RouterLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-yellow-400">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col bg-black px-4 py-4 space-y-4 text-yellow-400 rounded-b-lg shadow-lg transition-all duration-300">
            <RouterLink to="/" className="hover:text-yellow-500">Home</RouterLink>
            <RouterLink to="/event" className="hover:text-yellow-500">Events</RouterLink>
            <ScrollLink to="contact" {...scrollLinkProps}>Contact</ScrollLink>
            <ScrollLink to="about" {...scrollLinkProps}>About Us</ScrollLink>
            
            {/* Mobile version of auth buttons/user profile */}
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <div className="bg-yellow-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name}</span>
                </div>
                <RouterLink to="/dashboard" className="hover:text-yellow-500">
                  Dashboard
                </RouterLink>
                <button 
                  className="flex items-center space-x-2 hover:text-yellow-500"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <RouterLink to="/signup">
                  <button className="mt-4 bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800 w-full">Signup</button>
                </RouterLink>
                <RouterLink to="/login">
                  <button className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800 w-full">Login</button>
                </RouterLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
