import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      message: "",
    });
  
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact/submit`, formData);
      setStatus(res.data.message);
      setFormData({ fullName: "", email: "", message: "" });
    } catch (error) {
      setStatus("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-black text-yellow-600 px-6 py-8 flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto w-full" style={{ minHeight: '80vh' }}>

        {/* Left Panel */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-start pt-10">
          <h3 className="text-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text font-bold mb-6">
            Contact Information
          </h3>

          <div className="mb-4 flex items-start gap-3">
            <MapPin className="text-yellow-600 mt-1" />
            <div>
              <p>IES College of Technology</p>
              <p>Ratibad Main Road, Bhopal</p>
              <p>Madhya Pradesh - 462044</p>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <Mail className="text-yellow-600" />
            <div>
              <p>info@iescollege.ac.in</p>
              <p>festhive@iescollege.ac.in</p>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <Phone className="text-yellow-600" />
            <p>+91 1234567890</p>
          </div>

          <h4 className="text-yellow-600 mb-2">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#"><i className="fab fa-facebook text-xl text-white"></i></a>
            <a href="#"><i className="fab fa-instagram text-xl text-white"></i></a>
            <a href="#"><i className="fab fa-twitter text-xl text-white"></i></a>
          </div>
        </div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative flex flex-col justify-start bg-gray-800 p-6 rounded-xl shadow-lg border border-yellow-600 text-yellow-600"
          style={{ minHeight: '80vh', paddingTop: '2.5rem' }}
        >
          <motion.div
            className="relative z-10 w-full max-w-md mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-extrabold mb-2 text-yellow-400 text-center drop-shadow-lg">
              Contact Us
            </h1>
            <p className="text-center text-yellow-500 mb-4">Get in touch — we’d love to hear from you!</p>

            <motion.form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full p-3 mb-4 border border-yellow-600 rounded-lg bg-gray-900 text-yellow-400 placeholder-yellow-500 focus:ring-2 focus:ring-yellow-600 outline-none"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full p-3 mb-4 border border-yellow-600 rounded-lg bg-gray-900 text-yellow-400 placeholder-yellow-500 focus:ring-2 focus:ring-yellow-600 outline-none"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                className="w-full p-3 mb-4 border border-yellow-600 rounded-lg bg-gray-900 text-yellow-400 placeholder-yellow-500 focus:ring-2 focus:ring-yellow-600 outline-none"
              />

              <motion.button
                type="submit"
                className="w-full bg-yellow-600 p-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 font-bold text-black shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>

              {status && (
                <motion.p
                  className="mt-4 text-yellow-400 text-center font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {status}
                </motion.p>
              )}
            </motion.form>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
