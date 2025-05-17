import { useState, useEffect } from "react";
import { Calendar, X, Loader2 } from "lucide-react";
import axios from "axios";
import Header from "@/components/Header";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}` || "";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/userevents/events/myevents`, {
        withCredentials: true
      });
      setEvents(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const handleCancelRegistration = async (eventId) => {
    try {
      setCancellingId(eventId);
      await axios.delete(`${API_BASE_URL}/api/userevents/events/${eventId}/cancel-registration`, {
        withCredentials: true
      });
      
      // Remove the event from the list
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading your events...</p>
      </div>
    );
  }

  if (error) {
    return (
        <>
        <Header />
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error: {error}</p>
        <button 
          onClick={fetchUserEvents}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
      </>
    );
  }

  if (events.length === 0) {
    return (
        <>
        <Header />
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h2>
        <p className="text-gray-600">You haven't registered for any events yet.</p>
      </div>
      </>
    );
  }

  return (
    <>
    <Header />
    <div className="bg-white shadow rounded-lg">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">My Registered Events</h2>
        <p className="text-gray-600 text-sm mt-1">Events you've registered for</p>
      </div>
      <div className="divide-y divide-gray-200">
        {events.map((event) => (
          <div key={event._id} className="p-6 flex flex-col md:flex-row gap-4">
            {event.image ? (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                <time dateTime={event.date}>{formatDate(event.date)}</time>
              </p>
              <p className="text-gray-700 mt-2 line-clamp-2">{event.description}</p>
              {event.location && (
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
              )}
              
              <button
                onClick={() => handleCancelRegistration(event._id)}
                disabled={cancellingId === event._id}
                className={`mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed`}
              >
                {cancellingId === event._id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Cancel Registration
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}