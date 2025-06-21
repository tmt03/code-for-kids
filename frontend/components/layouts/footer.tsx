"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  faFacebook,
  faGithub,
  faLinkedinIn,
  faTiktok,
  faYoutube
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
          <h4 className="font-bold mb-4 text-white">KHÓA HỌC LÀM GAME</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Phiêu lưu ở Vương quốc Codeland
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">KỸ NĂNG</h4>
          <ul className="space-y-2">
            <li>
              <a
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Tư duy logic
              </a>
            </li>
            <li>
              <a
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Tư duy sáng tạo
              </a>
            </li>
            <li>
              <a
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Xây dựng game cơ bản
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-white">TÀI LIỆU</h4>
          <ul className="space-y-2">
            <li>
              <a
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                Bộ câu lệnh: Phưu lưu ở Vương quốc Code-land
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-600 pt-6 flex flex-col md:flex-row justify-between items-center text-md text-gray-300 max-w-7xl mx-auto">
        <p>© 2025 Scriptbies. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0 text-2xl">
          <a
            href="https://www.facebook.com/profile.php?id=61576763879584"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faFacebook} />
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
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>
      </div>
    </footer>
  );
}