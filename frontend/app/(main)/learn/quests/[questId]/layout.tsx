'use client';

import Header from '@/components/layouts/header';
import { TrialBanner } from '@/components/trial/TrialBanner';
import { ProgressProvider } from '@/contexts/ProgresssContext';
import FooterChapter from '../footer';

type Props = {
    children: React.ReactNode;
};

const ChapterLayout = ({ children }: Props) => {
    return (
        <ProgressProvider>
            <div className="h-dvh text-gray-800 flex flex-col bg-gradient-to-r from-[#87CEFA] to-[#40C4FF]">
                <div className='pb-14'>
                    <Header />
                </div>
                <TrialBanner />

                <main className="flex-1 w-full overflow-hidden pt-2 pb-1">
                    {children}
                </main>
                <div className="relative w-full shadow-md bg-gradient-to-r from-[#4682B4] to-[#1C6CA8] flex flex-row items-center justify-start">
                    <FooterChapter />
                </div>
            </div>
        </ProgressProvider>
    );
};

export default ChapterLayout;
