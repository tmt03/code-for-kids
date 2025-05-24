import CourseCard from "@/components/course-card";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/searchbar";

export default function LearnPage() {
    return (
        <div className="w-full overflow-x-hidden">
            <div className="mx-auto justify-center items-center flex flex-col ">
                {/* Header Background */}
                <div
                    className="w-full pt-12 h-86 flex flex-row justify-center items-center bg-cover bg-center text-white relative"
                    style={{ backgroundImage: "url('/assets/learn-page-bg.png')" }}
                >

                    {/* Lớp phủ làm mờ ảnh nền */}
                    <div className="absolute inset-0 backdrop-blur-[3px]"></div>

                    {/* Lớp phủ gradient để tăng độ tương phản và tạo hiệu ứng đẹp */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>

                    {/* Text */}
                    <div className="relative z-10 text-center px-4 max-w-[90%] mx-auto">
                        <h1 className="text-xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold tracking-wide leading-snug animate-fadeIn">
                            <span className="[text-shadow:1px_1px_2px_black,0_0_1em_black,0_0_0.2em_black] block">
                                Xin chào bạn nhỏ!
                            </span>
                            <span className="[text-shadow:1px_1px_2px_black,0_0_1em_black,0_0_0.2em_black] block mt-2">
                                Hãy chọn khóa học và cùng nhau trải nghiệm thế giới code đầy màu sắc nhé!
                            </span>
                        </h1>
                    </div>

                </div>

                {/* Main Content */}
                <div className="flex flex-col px-4 py-4 w-full max-w-7xl mx-auto ">
                    {/* Header + Search Bar */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-6 text-center sm:text-left">
                        <div className="text-4xl font-bold text-[#104A7A]">
                            Các Khóa Học
                        </div>
                        <div className="w-full sm:w-auto">
                            <SearchBar />
                        </div>
                    </div>
                    <div className="w-full p-4 bg-gradient-to-b from-[#B0E2FF] to-[#E6F0FA] rounded-lg">
                        {/* Course Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
                            <CourseCard />
                        </div>
                    </div>
                </div>
            </div>

            <Navbar />

            <Footer />
        </div>
    );
}