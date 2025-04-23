'use client'

import React from 'react';
import Navbar from "@/components/navbar";
import Footer from '@/components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="w-full overflow-x-hidden">
            {/* Navbar */}
            <Navbar />

            <div className="pt-14 bg-[#0a0a23] ">
                {/* Welcome Section (Luôn ở đầu) */}
                <section className="text-white py-6 px-4">
                    <div className="max-w-7xl mx-auto flex items-center gap-4">
                        <img src="/assets/window.svg" alt="Computer Icon" className="w-10 h-10" />
                        <div className="bg-[#1e1e3f] border border-white rounded px-4 py-2 text-sm">
                            Chào mừng bạn quay trở lại, <span className="font-bold">user!</span> Cùng học thôi nào!
                        </div>
                    </div>
                </section>

                {/* Main Dashboard Section */}
                {/* Container này bây giờ là grid container chính cho các phần tử cần sắp xếp lại */}
                <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Jump Back In (Course) */}
                    {/* Small screen: order-1 (Thứ 2 sau Welcome) */}
                    {/* Medium screen: order-1, chiếm 2 cột, hàng 1 */}
                    <section className="bg-[#1b1b35] border border-white rounded-md p-4 text-white relative order-1 md:order-1 md:col-span-2 md:row-span-1">
                        <p className="text-sm mb-2 uppercase font-bold">Khóa học</p>
                        <h2 className="text-2xl font-bold">React.js Cơ bản</h2>
                        <p className="text-sm text-gray-300 mb-4">Bài tập tiếp theo: Building Blocks</p>
                        <div className="flex gap-3">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 font-semibold">Tiếp tục học</button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 font-semibold">Chi tiết khóa học</button>
                        </div>
                        <div className="absolute top-2 right-4 text-xs text-gray-400">4%</div>
                    </section>

                    {/* Profile Card */}
                    {/* Small screen: order-2 (Thứ 3) */}
                    {/* Medium screen: order-2, cột 3, hàng 1 */}
                    <div className="bg-[#0a0a23] border border-white rounded-lg p-4 text-white shadow-lg order-2 md:order-2 md:col-start-3 md:row-start-1 md:row-span-1">
                        <div className="flex items-center mb-4">
                            <img
                                src="/images/avatar.png"
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full border-2 border-blue-400 mr-4"
                            />
                            <div>
                                <h2 className="text-lg font-bold">leminhquan760</h2>
                                <p className="text-sm text-gray-400">Cấp 1</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-center mb-4">
                            <div>
                                <p className="text-blue-400 font-semibold">35</p>
                                <p className="text-gray-400">Kinh nghiệm (XP)</p>
                            </div>
                            <div>
                                <p className="text-yellow-500 font-semibold">Đồng (Bronze)</p>
                                <p className="text-gray-400">Hạng</p>
                            </div>
                            <div>
                                <p className="text-purple-400 font-semibold">0</p>
                                <p className="text-gray-400">Huy hiệu, thành tựu</p>
                            </div>
                            <div>
                                <p className="text-orange-400 font-semibold">2</p>
                                <p className="text-gray-400">Chuỗi ngày học tập</p>
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-md py-1.5 font-semibold text-white">
                            Xem trang cá nhân
                        </button>
                    </div>

                    {/* Upcoming Events */}
                    {/* Small screen: order-3 (Thứ 4) */}
                    {/* Medium screen: order-4, cột 3, hàng 2 */}
                    {/* Lưu ý: order-4 trên md vì Explore More (md:order-3) sẽ đẩy cái này xuống trực quan */}
                    <div className="bg-[#0a0a23] border border-white rounded-lg p-4 text-white shadow-lg order-3 md:order-4 md:col-start-3 md:row-start-2 md:row-span-1">
                        <h3 className="text-lg font-bold mb-4">Các sự kiện sắp tới</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-4 items-start">
                                <div className="flex flex-col items-center bg-yellow-500 text-black font-bold rounded p-2 w-14 text-center">
                                    <span className="text-lg leading-tight">23</span>
                                    <span className="text-xs">Thg 4</span>
                                </div>
                                <div>
                                    <p className="font-semibold">Node.js Workshop</p>
                                    <p className="text-gray-400">Thứ 4, 15:00 (GMT+7)</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="flex flex-col items-center bg-green-500 text-black font-bold rounded p-2 w-14 text-center">
                                    <span className="text-lg leading-tight">7</span>
                                    <span className="text-xs">Thg 12</span>
                                </div>
                                <div>
                                    <p className="font-semibold">Resume Review Workshop</p>
                                    <p className="text-gray-400">Thứ 4, 09:00 (GMT+7)</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="flex flex-col items-center bg-red-400 text-black font-bold rounded p-2 w-14 text-center">
                                    <span className="text-lg leading-tight">29</span>
                                    <span className="text-xs">Thg 5</span>
                                </div>
                                <div>
                                    <p className="font-semibold">Meet 'n Greet</p>
                                    <p className="text-gray-400">Thứ 5, 14:00 (GMT+7)</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Explore More */}
                    {/* Small screen: order-4 (Thứ 5) */}
                    {/* Medium screen: order-3, chiếm 2 cột, hàng 2 */}
                    <section className="text-white order-4 md:order-3 md:col-span-2 md:row-start-2 md:row-span-1">
                        <h2 className="text-xl font-bold mb-4">Khám phá thêm</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {['Thử thách hàng ngày', 'Xây dựng một dự án', 'Quản lý mã nguồn dự án bằng GitHub', '#CodeRace25'].map((item, i) => (
                                <Link key={i} href="/" className="block border border-white rounded-md p-4 bg-[#1b1b35] hover:bg-[#2a2a4a] transition duration-200 cursor-pointer">
                                    {/* Thêm class để con trỏ chuột thay đổi khi hover */}
                                    <h3 className="font-bold mb-2">{item}</h3>
                                    <p className="text-sm text-gray-300">Description for {item}...</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* New Tutorials */}
                    {/* Small screen: order-5 (Thứ 6) */}
                    {/* Medium screen: order-5, chiếm 2 cột, hàng 3 */}
                    <section className="text-white order-5 md:order-5 md:col-span-2 md:row-start-3 md:row-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Hướng dẫn các khóa học mới</h2>
                            <a href="#" className="text-blue-400 text-md font-bold">
                                Xem tất cả <FontAwesomeIcon icon={faArrowRight} />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { title: 'Thêm hiệu ứng cho ảnh với CSS keyframes', tag: 'HTML', level: 'Nhập môn' },
                                { title: 'Clone và pull dự án trên GitHub với GitBash', tag: 'Git', level: 'Cơ bản' },
                                { title: 'Lập trình game 2D với Phaser.js', tag: 'JavaScript', level: 'Nâng cao' },
                            ].map((tutorial, i) => (
                                <Link key={i} href="/" className="border border-white rounded-md p-4 bg-[#1b1b35] hover:bg-[#2a2a4a] transition duration-200">
                                    <div className="h-32 bg-gray-700 mb-2 rounded"></div>
                                    <p className="text-xs mb-1 uppercase">Tutorial</p>
                                    <h3 className="font-bold text-sm mb-2">{tutorial.title}</h3>
                                    <div className="flex gap-2 text-xs">
                                        <span className="bg-gray-600 px-2 py-1 rounded">{tutorial.level}</span>
                                        <span className="bg-blue-600 px-2 py-1 rounded">{tutorial.tag}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                </section> {/* Kết thúc grid container chính */}

                {/* Club Promo (Luôn ở gần cuối, trước Footer) */}
                {/* Small screen: Sau các mục đã sắp xếp ở trên (Thứ 7) */}
                {/* Medium screen: Vẫn ở vị trí này */}
                <section className="max-w-5xl mx-auto py-8 px-4 text-white">
                    <div className="bg-[#1b1b35] border border-white rounded-md p-4 text-center">
                        <p className="text-purple-400 font-bold mb-2">HỘI VIÊN CAO CẤP (PREMIUM MEMBERSHIP)</p>
                        <h3 className="text-lg font-bold mb-2">Trải nghiệm học tập không giới hạn</h3>
                        <p className="text-sm mb-4">Hãy tham gia ngay để mở khóa tất cả các khóa học, nhận sự trợ giúp từ các chuyên gia lập trình hàng đầu, và hơn nữa.
                        </p>
                        <button className="border border-white py-2 font-bold px-4 rounded hover:bg-white hover:text-black transition">Tìm hiểu thêm</button>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}