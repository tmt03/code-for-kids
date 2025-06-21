"use client";

import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useEffect } from "react";

export default function LandingPage() {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div className="w-full overflow-x-hidden bg-gradient-to-b from-[#E0F4F7] to-[#C1E7EB] text-[#0A3D62]">
            {/* Hero Section */}
            <div className="relative h-screen w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 filter brightness-75"
                    style={{ backgroundImage: "url('/assets/learn-page-bg.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0" />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl animate-fadeIn">
                        Bạn đã sẵn sàng phiêu lưu?
                    </h1>
                    <p className="text-2xl md:text-4xl mb-8 drop-shadow-lg animate-fadeIn delay-200">
                        Học lập trình qua trò chơi cùng{" "}
                        <span className="text-[#FFD700] font-semibold">Scriptbies</span>!
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        <Link href="/register">
                            <button className="bg-[#FFD700] hover:bg-[#E6C200] text-[#0A3D62] px-8 py-4 rounded-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg animate-bounceIn">
                                🎮 Học thử miễn phí
                            </button>
                        </Link>
                        <Link href="/shop">
                            <button className="bg-white hover:bg-gray-100 text-[#007C8D] px-8 py-4 rounded-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg animate-bounceIn delay-200">
                                📘 Mua sách
                            </button>
                        </Link>
                    </div>
                </div>
                <Header />
            </div>

            {/* Sections */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12" data-aos="fade-right">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#007C8D]">
                            Học mà chơi - Chơi mà học
                        </h2>
                        <p className="text-lg md:text-xl leading-relaxed text-[#0A3D62]">
                            Scriptbies biến mỗi bài học thành một trò chơi. Trẻ được tự tay viết code, chạy thử và
                            trải nghiệm kết quả ngay lập tức. Phát triển tư duy, kỹ năng giải quyết vấn đề và sáng
                            tạo!
                        </p>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <img
                            src="/assets/mascots/pose_docsach.png"
                            alt="Game Education"
                            className="w-full max-w-md rounded-2xl hover:shadow-3xl transition-shadow duration-300"
                        />
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-gradient-to-b from-[#E0F4F7] to-[#C1E7EB]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12" data-aos="fade-left">
                    <div className="flex-1 flex justify-center">
                        <img
                            src="/assets/mascots/pose_kiem.png"
                            alt="Career Path"
                            className="w-full max-w-md rounded-2xl hover:shadow-3xl transition-shadow duration-300"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#007C8D]">
                            Chuẩn bị cho tương lai
                        </h2>
                        <p className="text-lg md:text-xl leading-relaxed text-[#0A3D62]">
                            Các khóa học của Scriptbies xây dựng nền tảng cho nghề nghiệp công nghệ. Trẻ làm quen
                            với các khái niệm như biến, hàm, vòng lặp, tư duy logic – tất cả qua game hấp dẫn.
                        </p>
                    </div>
                </div>
            </section>

            {/* Ưu điểm nổi bật */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#007C8D] animate-fadeInUp">
                        Vì sao nên chọn Scriptbies?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🎮",
                                title: "Học như chơi game",
                                desc: "Mỗi bài học là một trò chơi hấp dẫn giúp bé học lập trình dễ dàng.",
                            },
                            {
                                icon: "🧠",
                                title: "Rèn tư duy logic",
                                desc: "Phát triển tư duy lập trình, giải quyết vấn đề, sáng tạo.",
                            },
                            {
                                icon: "🌍",
                                title: "Kết nối bạn bè",
                                desc: "Tham gia cộng đồng lập trình nhí – học hỏi và chia sẻ cùng nhau.",
                            },
                        ].map(({ icon, title, desc }) => (
                            <div
                                key={title}
                                className="bg-gradient-to-br from-[#E0F4F7] to-[#C1E7EB] p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="text-5xl mb-4 text-[#00A8B5]">{icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-[#007C8D]">{title}</h3>
                                <p className="text-gray-600">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ + Chatbot */}
            <section className="py-20 px-6 bg-gradient-to-b from-[#E0F4F7] to-[#C1E7EB]">
                <div className="max-w-4xl mx-auto" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#007C8D]">
                        Câu hỏi thường gặp
                    </h2>
                    <div className="space-y-6">
                        <details className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <summary className="cursor-pointer font-semibold text-[#00A8B5]">
                                Phụ huynh có cần biết lập trình không?
                            </summary>
                            <p className="mt-4 text-[#0A3D62]">
                                Không cần! Giao diện dễ hiểu, phù hợp trẻ em. Hệ thống hướng dẫn tự động giúp bé
                                học dễ dàng.
                            </p>
                        </details>
                        <details className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <summary className="cursor-pointer font-semibold text-[#00A8B5]">
                                Từ bao nhiêu tuổi có thể học?
                            </summary>
                            <p className="mt-4 text-[#0A3D62]">
                                Trẻ từ 6 tuổi trở lên có thể bắt đầu học với Scriptbies.
                            </p>
                        </details>
                        <details className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <summary className="cursor-pointer font-semibold text-[#00A8B5]">
                                Có cần mua sách để học không?
                            </summary>
                            <p className="mt-4 text-[#0A3D62]">
                                Scriptbies có chế độ học thử miễn phí, nếu muốn học chính thức bạn cần có sách đi
                                kèm mã kích hoạt.
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            {/* CTA cuối trang */}
            <section className="bg-[#007C8D] py-16 text-white text-center">
                <h2 className="text-4xl font-bold mb-4">Hãy để con bạn khám phá tiềm năng từ hôm nay!</h2>
                <p className="mb-6 text-lg">Tặng ngay khóa học thử + tài nguyên miễn phí cho người mới.</p>
                <Link href="/register">
                    <button className="bg-[#FFD700] hover:bg-[#E6C200] text-[#0A3D62] px-8 py-4 rounded-lg font-bold shadow-lg">
                        🎁 Bắt đầu miễn phí
                    </button>
                </Link>
            </section>

            <Footer />

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounceIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 1s ease-out; }
                .animate-fadeInUp { animation: fadeInUp 1s ease-out; }
                .animate-bounceIn { animation: bounceIn 0.8s ease-out; }
                .delay-200 { animation-delay: 0.2s; }
            `}</style>
        </div>
    );
}