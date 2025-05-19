import ChapterList from "@/components/companion/chapter-list";
import CourseBadges from "@/components/companion/course-badges";
import CourseProgress from "@/components/companion/course-progress";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function ChapterPage() {
    // Dữ liệu mẫu cho các chapter
    const chapters = [
        {
            id: 1,
            title: "Chapter 1",
            description: "Học lập trình cơ bản",
            status: "completed" as const,
            tasks: [
                { id: 1, title: "Tìm hiểu về biến" },
                { id: 2, title: "Viết chương trình in Hello World" },
                { id: 3, title: "Tạo một vòng lặp đơn giản" },
                { id: 4, title: "Hoàn thành bài kiểm tra Chapter 1", isChallenge: true },
            ],
        },
        {
            id: 2,
            title: "Chapter 2",
            description: "Tìm hiểu về vòng lặp",
            status: "in-progress" as const,
            tasks: [
                { id: 1, title: "Ôn tập vòng lặp for" },
                { id: 2, title: "Viết chương trình in bảng cửu chương" },
                { id: 3, title: "Tạo vòng lặp lồng nhau" },
                { id: 4, title: "Thử thách vòng lặp nâng cao", isChallenge: true },
            ],
        },
        {
            id: 3,
            title: "Chapter 3",
            description: "Xây dựng trò chơi đơn giản",
            status: "not-started" as const,
            tasks: [
                { id: 1, title: "Tìm hiểu về hàm" },
                { id: 2, title: "Tạo nhân vật di chuyển" },
                { id: 3, title: "Thêm chướng ngại vật" },
                { id: 4, title: "Hoàn thành trò chơi nhỏ", isChallenge: true },
            ],
        },
        {
            id: 4,
            title: "Chapter 4",
            description: "Học lập trình nâng cao",
            status: "completed" as const,
            tasks: [
                { id: 1, title: "Tìm hiểu về biến" },
                { id: 2, title: "Viết chương trình in Hello World" },
                { id: 3, title: "Tạo một vòng lặp đơn giản" },
                { id: 4, title: "Hoàn thành bài kiểm tra Chapter 1", isChallenge: true },
            ],
        },
        {
            id: 5,
            title: "Chapter 5",
            description: "Tìm hiểu về vòng lặp nâng cao",
            status: "in-progress" as const,
            tasks: [
                { id: 1, title: "Ôn tập vòng lặp for" },
                { id: 2, title: "Viết chương trình in bảng cửu chương" },
                { id: 3, title: "Tạo vòng lặp lồng nhau" },
                { id: 4, title: "Thử thách vòng lặp nâng cao", isChallenge: true },
            ],
        },
        {
            id: 6,
            title: "Chapter 6",
            description: "Xây dựng trò chơi nâng cao",
            status: "not-started" as const,
            tasks: [
                { id: 1, title: "Tìm hiểu về hàm" },
                { id: 2, title: "Tạo nhân vật di chuyển" },
                { id: 3, title: "Thêm chướng ngại vật" },
                { id: 4, title: "Hoàn thành trò chơi nhỏ", isChallenge: true },
            ],
        },
        {
            id: 7,
            title: "Chapter 7",
            description: "Thử thách cuối khóa",
            status: "not-started" as const,
            isSpecial: true,
            tasks: [
                { id: 1, title: "Tạo nhận vật", isChallenge: true },
                { id: 2, title: "Tạo boss", isChallenge: true },
                { id: 3, title: "Thiết kế nút điều khiển", isChallenge: true },
                { id: 4, title: "Chơi game và tiêu diệt quái vật", isChallenge: true },
            ],
        },
    ];

    return (
        <div className="w-full flex flex-col min-h-screen">
            <Navbar />

            {/* Header Background */}
            <div
                className="w-full h-86 flex flex-row justify-center items-center bg-cover bg-center text-white relative"
                style={{ backgroundImage: "url('/assets/learn-page-bg.png')" }}
            ></div>

            <main className="w-full px-4 py-6 bg-gray-50">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row flex-1 w-full">
                    {/* Phần hiển thị các chapter */}
                    <div className="w-full lg:w-4/5">
                        <ChapterList chapters={chapters} />
                    </div>

                    {/* Phần CourseProgress và CourseBadges */}
                    <div className="w-full lg:w-1/5 mt-6 lg:mt-0 lg:pl-6">
                        <div className="sticky top-6 flex flex-col gap-6">
                            <div>
                                <CourseProgress chapters={chapters} />
                            </div>
                            <div>
                                <CourseBadges chapters={chapters} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="w-full h-40 bg-gradient-to-r from-[#4682B4] to-[#1C6CA8]">

            <Footer />
            </div>
        </div>
    );
}