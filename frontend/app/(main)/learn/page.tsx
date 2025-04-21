import CourseCard from "@/components/course-card";
import SearchBar from "@/components/searchbar";

export default function LearnPage() {
    return (
        <div className="w-full flex flex-col">
            {/* Header Background */}
            <div
                className="w-full h-86 flex flex-row justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/learn-page-bg.png')" }}
            >
                {/* <InteractionBox message="Hãy chọn khóa học bạn muốn học" /> */}
            </div>

            {/* Main Content */}
            <div className="w-full min-h-[calc(100vh-344px)] flex flex-col px-4 py-4">
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