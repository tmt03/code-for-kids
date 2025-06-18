import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Scriptbies - Học Lập Trình Qua Game Cho Trẻ",
    description: "Nền tảng học lập trình sáng tạo dành cho trẻ em. Vừa học vừa chơi qua các trò chơi tương tác!",
};

type Props = {
    children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
    return (
        <div className="">
            <main className="">
                {children}
            </main>
        </div>
    );
};

export default MarketingLayout;