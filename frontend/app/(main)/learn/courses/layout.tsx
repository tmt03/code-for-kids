

import HeaderChapter from "../chapters/header";

type Props = {
    children: React.ReactNode;
};

const LearnLayout = ({ children }: Props) => {
    return (
        <div className="w-full flex flex-col bg-gray-50 ">
            <div className="w-full bg-gradient-to-r from-[#4682B4] to-[#1C6CA8]">
                {/* <Header/> */}
                <HeaderChapter />
            </div>
            <main className="items-center justify-center">
                {children}
            </main>
            <div className="w-full h-40 bg-gradient-to-r from-[#4682B4] to-[#1C6CA8]">
                {/* <Footer/> */}
            </div>
        </div>
    );
};

export default LearnLayout;