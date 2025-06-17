"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedinIn,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
config.autoAddCss = false;

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#006D77] to-[#0A3D62] text-white px-8 py-12 shadow-lg">
      <div className="mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-sm max-w-7xl">
        <div>
          <h4 className="font-bold mb-4 text-white">VỀ CÔNG TY</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Giới thiệu
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Điều khoản & Chính sách
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Bảo vệ quyền riêng tư
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Trung tâm trợ giúp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">THỰC HÀNH</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Thử thách
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Dự án
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">KHÓA HỌC</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Phiêu lưu ở Vương quốc Codeland
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Sách 2
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Sách 3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Sách 4
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Lập trình game với Phaser.js
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">KỸ NĂNG</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                HTML
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                CSS
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                JavaScript
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Git, GitHub & Command Line
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-600 pt-6 flex flex-col md:flex-row justify-between items-center text-md text-gray-300 max-w-7xl mx-auto">
        <p>© 2025 Scriptbies. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0 text-2xl">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTiktok} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>
      </div>
    </footer>
  );
}