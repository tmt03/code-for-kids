"use client"

import { fetchAllChapters } from "@/app/apis";
import ChapterList from "@/components/companion/chapter-list";
import CourseBadges from "@/components/companion/course-badges";
import CourseProgress from "@/components/companion/course-progress";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";

export default function ChapterPage() {
    const [chapters, setChapters] = useState<any[]>([]);

    useEffect(() => {
        fetchAllChapters().then((chapters) => {
            setChapters(chapters)
            console.log(chapters)
        })
    }, []);

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