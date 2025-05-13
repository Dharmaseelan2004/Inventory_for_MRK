import React, { useState } from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
  AiFillEnvironment,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { footercompanyLinks, footerSupportLinks } from "../../static/data";

const Footer = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setSuccessMessage("Please enter a valid email address.");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
      return;
    }

    setSuccessMessage("Successfully subscribed!");
    setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="bg-[#000] text-white">
      {/* Subscription Section */}
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-[#342ac8] py-6">
        <h1 className="text-xl font-semibold md:w-2/5">
          <span className="text-[#56d879]">Subscribe</span> for news, events, and offers.
        </h1>
        <form className="flex flex-col" onSubmit={handleSubscribe}>
          <div className="flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email..."
              className="text-gray-800 sm:w-72 w-full sm:mr-5 mr-1 py-2 rounded px-3 focus:outline-none"
            />
            <button className="bg-[#56d879] hover:bg-teal-500 duration-300 px-5 py-2 rounded-md text-white">
              Subscribe
            </button>
          </div>
          {successMessage && (
            <p className={successMessage.includes("valid") ? "text-red-500 mt-2 text-sm" : "text-green-500 mt-2 text-sm"}>
              {successMessage}
            </p>
          )}
        </form>
      </div>

      {/* Footer Links Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:px-8 px-5 py-10">
        {/* About Us Section */}
        <ul className="text-center sm:text-start">
          <h1 className="text-lg font-bold mb-3">About Us</h1>
          <p className="text-gray-400 leading-6">
            We offer top-notch solutions for your online shopping experience.
          </p>
          <div className="flex items-center mt-4 justify-center sm:justify-start">
            <AiFillFacebook size={25} className="cursor-pointer hover:text-[#56d879]" />
            <AiOutlineTwitter size={25} className="ml-4 cursor-pointer hover:text-[#56d879]" />
            <AiFillInstagram size={25} className="ml-4 cursor-pointer hover:text-[#56d879]" />
            <AiFillYoutube size={25} className="ml-4 cursor-pointer hover:text-[#56d879]" />
          </div>
        </ul>

        {/* Company Links */}
        <ul>
          <h1 className="text-lg font-bold mb-3">Company</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300 text-sm leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Support Links */}
        <ul>
          <h1 className="text-lg font-bold mb-3">Support</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300 text-sm leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Visit Us Section */}
        <ul className="text-center sm:text-start">
          <h1 className="text-lg font-bold mb-3">Visit Us</h1>
          <p className="text-gray-400 leading-6">
            130, Puthupakkam, Budhur [PO], Ponneri Taluk, Tiruvallur
          </p>
          <a
            href="https://maps.app.goo.gl/XBt5BfufwRnAUcqK6?g_st=iw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center mt-3 text-[#56d879] hover:text-teal-400 duration-300"
          >
            <AiFillEnvironment size={20} className="mr-2" />
            Get Directions
          </a>
        </ul>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-[#222] py-4 text-center text-gray-400 text-sm">
        <span>© MRK. All rights reserved.</span>
        <div className="mt-2">
          <span className="mr-4">Terms</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
