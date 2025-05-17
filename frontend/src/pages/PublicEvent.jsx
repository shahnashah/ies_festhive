import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "../api/axios";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const PublicEvents = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check registration status for each event when user logs in
    if (isLoggedIn && user && events.length > 0) {
      checkRegistrationStatusForAllEvents();
    }
  }, [isLoggedIn, user, events]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events`);
      if (res.data && Array.isArray(res.data.events)) {
        setEvents(res.data.events);
      } else {
        setEvents([]); // fallback
      }
    } catch (err) {
      console.error("Error fetching events", err);
      setEvents([]); // fallback
    }
  };

  const checkLoginStatus = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setIsLoggedIn(true);
      setUser(userData);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const checkRegistrationStatusForAllEvents = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'));
      if (!token) return;

      const statuses = {};
      
      // For each event, check if user is registered
      for (const event of events) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/userevents/events/${event._id}/registration-status`,
            {
             withCredentials: true,
            }
          );
          
          statuses[event._id] = response.data.isRegistered;
        } catch (error) {
          console.error(`Error checking registration for event ${event._id}:`, error);
          statuses[event._id] = false;
        }
      }
      
      setRegistrationStatus(statuses);
    } catch (error) {
      console.error("Error checking registration statuses:", error);
    }
  };

  const handleRegisterClick = (event) => {
    if (isLoggedIn) {
      setSelectedEvent(event);
      setIsConfirmOpen(true);
      setRegistrationSuccess(false);
      setRegistrationError("");
    } else {
      // If not logged in, redirect to login page
      localStorage.setItem('redirectAfterLogin', '/event'); // Redirect back to events page after login
      navigate('/login');
    }
  };

  const handleConfirmRegistration = async () => {
    if (!selectedEvent || !isLoggedIn) return;
    
    setLoading(true);
    
    try {
      const token = JSON.parse(localStorage.getItem('user'));
      if (!token) {
        setRegistrationError("Authentication required");
        setLoading(false);
        return;
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/userevents/events/${selectedEvent._id}/register`,
        {}, // No additional data needed
        {
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        setRegistrationSuccess(true);
        // Update registration status for this event
        setRegistrationStatus(prev => ({
          ...prev,
          [selectedEvent._id]: true
        }));
        
        // Close dialog after successful registration
        setTimeout(() => {
          setIsConfirmOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      setRegistrationError(error.response?.data?.message || "Failed to register for the event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black' : ''}`}>
        <Header />
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-24">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="bg-white p-4 rounded shadow">
              <img
                src={event.image}
                alt={event.title}
                className="h-40 w-full object-cover rounded mb-3"
              />
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.location}
              </p>
              
              {isLoggedIn && registrationStatus[event._id] ? (
                <button 
                  disabled
                  className="bg-green-600 text-white px-4 py-2 rounded w-full cursor-default"
                >
                  ✓ Registered
                </button>
              ) : (
                <button 
                  onClick={() => handleRegisterClick(event)}
                  className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800 w-full"
                >
                  {isLoggedIn ? "Register for Event" : "Login to Register"}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">No events found.</p>
        )}
      </div>

      {/* Registration Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {registrationSuccess 
                ? "Registration Successful!" 
                : `Register for ${selectedEvent?.title}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {registrationSuccess ? (
                <div className="text-green-600 font-medium">
                  You have successfully registered for this event.
                </div>
              ) : registrationError ? (
                <div className="text-red-600 font-medium">
                  {registrationError}
                </div>
              ) : (
                `Are you sure you want to register for ${selectedEvent?.title}?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!registrationSuccess && (
              <>
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleConfirmRegistration}
                  disabled={loading}
                  className="bg-yellow-700 hover:bg-yellow-800"
                >
                  {loading ? "Registering..." : "Confirm Registration"}
                </AlertDialogAction>
              </>
            )}
            {registrationSuccess && (
              <AlertDialogAction 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsConfirmOpen(false)}
              >
                Done
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default PublicEvents;