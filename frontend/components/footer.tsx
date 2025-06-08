'use client';

import React from 'react';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub, faInstagram, faYoutube, faTiktok, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-[#0f1123] text-white px-8 py-12">
      <div className="mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        <div>
          <h4 className="font-bold mb-4 text-gray-400">VỀ CÔNG TY</h4>
          <ul className="space-y-2">
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Điều khoản & Chính sách</a></li>
            <li><a href="#">Bảo vệ quyền riêng tư</a></li>
            <li><a href="#">Trung tâm trợ giúp</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-gray-400">THỰC HÀNH</h4>
          <ul className="space-y-2">
            <li><a href="#">Thử thách</a></li>
            <li><a href="#">Dự án</a></li>
            {/* <li><a href="#">#ABCXYZ</a></li> */}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-gray-400">KHÓA HỌC</h4>
          <ul className="space-y-2">
            <li><a href="#">Phiêu lưu ở Vương quốc Codeland</a></li>
            <li><a href="#">Sách 2</a></li>
            <li><a href="#">Sách 3</a></li>
            <li><a href="#">Sách 4</a></li>
            <li><a href="#">Lập trình game với Phaser.js</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-gray-400">&nbsp;</h4>
          <ul className="space-y-2">
            <li><a href="#">HTML</a></li>
            <li><a href="#">CSS</a></li>
            <li><a href="#">JavaScript</a></li>
            <li><a href="#">Git, GitHub & Command Line</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-md text-gray-400">
        <p>© 2025 Scriptbies. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0 text-xl">
          <a href="#"><FontAwesomeIcon icon={faFacebook} className="fa-xl"/></a>
          <a href="#"><FontAwesomeIcon icon={faInstagram} className="fa-xl"/></a>
          <a href="#"><FontAwesomeIcon icon={faYoutube} className="fa-xl"/></a>
          <a href="#"><FontAwesomeIcon icon={faTiktok} className="fa-xl"/></a>
          <a href="#"><FontAwesomeIcon icon={faGithub} className="fa-xl"/></a>
          <a href="#"><FontAwesomeIcon icon={faLinkedinIn} className="fa-xl"/></a>
        </div>
      </div>
    </footer>
  );
}