'use client'

import Footer from '@/components/footer';
import Header from "@/components/header";

export default function Landing() {
    return (
        <div className="w-full overflow-x-hidden">

            <div className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center z-5 text-white text-center px-4 gap-2">

                    <div className="flex flex-col gap-3">
                        <p className="text-6xl [text-shadow:1px_1px_2px_black,0_0_1em_black,0_0_0.2em_black]">
                            Bạn đã sẵn sàng để phiêu lưu chưa?
                        </p>
                        <p className="text-3xl [text-shadow:1px_1px_2px_black,0_0_1em_black,0_0_0.2em_black]">
                            Hãy cùng Scriptbies khám phá thế giới lập trình nhé!
                        </p>
                    </div>

                    <div className="mt-6">
                        <button className="bg-yellow-400 hover:bg-yellow-300 transition-all px-8 py-4 rounded text-2xl font-bold text-black shadow-xl [box-shadow:0_0_20px_rgba(255,255,0,0.8),0_0_40px_rgba(255,255,0,0.6)]">
                            Đi thôi nào!
                        </button>
                    </div>
                </div>

                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('../../../assets/9285000.jpg')" }}
                />

                {/* Header */}
                <Header />
            </div>

            <section className="bg-[#181c4e] text-white py-16 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

                    <div className="flex-1 flex justify-center">
                        <img
                            src="/"
                            alt="Lorem ipsum"
                            className="w-full max-w-sm rounded-xl shadow-lg"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl mb-6 [text-shadow:1px_1px_2px_black]|">
                            Học mà chơi - chơi mà học
                        </h2>
                        <p className="text-lg leading-relaxed [text-shadow:1px_1px_2px_black]">
                            Với Scriptbies, mỗi bài học là một cuộc phiêu lưu thú vị! Các bé vừa học lập trình vừa chơi game, rèn luyện tư duy sáng tạo và logic. Học vui, chơi vui – và tự tay tạo ra những trò chơi của riêng mình!
                        </p>
                    </div>

                </div>
            </section>

            <section className="bg-[#181c4e] text-white py-16 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl mb-6 [text-shadow:1px_1px_2px_black]">
                            Cơ hội nghề nghiệp tương lai
                        </h2>
                        <p className="text-lg leading-relaxed [text-shadow:1px_1px_2px_black]">
                            Scriptbies giúp các bạn nhỏ làm quen với những ngôn ngữ lập trình phổ biến như JavaScript, C++ hay Java — là nền tảng để trở thành lập trình viên web, phát triển game, ứng dụng di động hay thậm chí là kỹ sư phần mềm trong tương lai. Bắt đầu từ sớm, con bạn sẽ có lợi thế lớn trên hành trình sự nghiệp sau này.
                        </p>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <img
                            src="/"
                            alt="Lorem ipsum"
                            className="w-full max-w-sm rounded-xl shadow-lg"
                        />
                    </div>

                </div>
            </section>

            <section className="bg-[#181c4e] text-white py-16 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">

                    <div className="flex-1 flex justify-center">
                        <img
                            src="/"
                            alt="Lorem ipsum"
                            className="w-full max-w-sm rounded-xl shadow-lg"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl mb-6 [text-shadow:1px_1px_2px_black]">
                            Giao lưu, kết nối đam mê
                        </h2>
                        <p className="text-lg leading-relaxed [text-shadow:1px_1px_2px_black]">
                            Tại Scriptbies, các bạn nhỏ không chỉ học một mình mà còn được tham gia vào cộng đồng cùng những bạn có chung sở thích lập trình. Các hoạt động nhóm, thử thách, sự kiện mini sẽ giúp các em phát triển kỹ năng giao tiếp, làm việc nhóm và học tập hiệu quả hơn.
                        </p>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
}
