import CourseCard from "@/components/course-card";
import SearchBar from "@/components/searchbar";

export default function LearnPage() {
    return (
        <div className="mx-auto justify-center items-center flex flex-col">
            {/* Header Background */}
            <div
                className="w-full h-86 flex flex-row justify-center items-center bg-cover bg-center text-white relative"
                style={{ backgroundImage: "url('/assets/learn-page-bg.png')" }}
            >

                {/* Lớp phủ làm mờ ảnh nền */}
                <div className="absolute inset-0 backdrop-blur-[3px]"></div>

                {/* Lớp phủ gradient để tăng độ tương phản và tạo hiệu ứng đẹp */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>

                {/* Text */}
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-wider animate-fadeIn">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4040] to-[#FFD700]">
                            Xin chào bạn nhỏ!
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4040] to-[#FFD700]">
                            Hãy chọn khóa học và cùng trải nghiệm <br />
                            thế giới code đầy màu sắc.
                        </span>
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-8xl min-h-[calc(100vh-344px)] flex flex-col px-4 py-4">
                <div className="flex flex-row justify-between py-6">
                    <div className="text-3xl font-bold text-[#104A7A] tracking-wide shadow-[0px_3px_0px_0px_#000000]">
                        Các Khóa Học
                    </div>
                    {/* <CardName /> */}
                    <SearchBar />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 overflow-y-auto">
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                </div>
            </div>
        </div>
    );
}