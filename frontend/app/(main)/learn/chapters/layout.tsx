import { ProgressProvider } from '@/contexts/ProgresssContext';

type Props = {
    children: React.ReactNode;
};

const ChapterPageLayout = ({ children }: Props) => {
    return (
        <ProgressProvider>
            <div className="">
                <main className="">
                    {children}
                </main>
            </div>
        </ProgressProvider>
    );
};

export default ChapterPageLayout;