'use client';

import FooterChapter from '../footer';
import HeaderChapter from '../header';
import SidebarChapter from '../sidebar';

type Props = {
    children: React.ReactNode;
};

const ChapterLayout = ({ children }: Props) => {
    return (
        <div className="h-dvh text-gray-800 flex flex-col bg-gradient-to-r from-[#87CEFA] to-[#40C4FF]">
            <div className="w-full shadow-md top-0 z-10">
                <HeaderChapter />
            </div>
            <main className="flex-1 w-full overflow-hidden pt-2 pb-2">
                {children}
            </main>
            <div className="relative w-full shadow-md bg-gradient-to-r from-[#4682B4] to-[#1C6CA8] flex flex-row items-center justify-start">
                <div className='absolute ml-2'>
                    <SidebarChapter />
                </div>
                <FooterChapter />
            </div>
        </div>
    );
};

export default ChapterLayout;
