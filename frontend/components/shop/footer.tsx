import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub, faInstagram, faYoutube, faTiktok, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export default function ShopFooter() {
  return (
    <footer className="bg-[#0f1123] text-white px-8 py-8 mt-10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0">
          <p className="font-bold text-lg">Scriptbies Shop</p>
          <p className="text-gray-400">© 2025 Scriptbies. All rights reserved.</p>
        </div>
        <div className="flex space-x-4 text-xl">
          <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
          <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
          <a href="#"><FontAwesomeIcon icon={faTiktok} /></a>
          <a href="#"><FontAwesomeIcon icon={faGithub} /></a>
          <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
        </div>
      </div>
    </footer>
  );
} 