import RequireAuth from "@/components/auth/RequireAuth";
import Footer from '@/components/footer';
import Header from '@/components/header';

type Props = {
    children: React.ReactNode;
};

const LeaderboardLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <div className="">
                <Header />
                {children}
                <Footer />
            </div>
        </RequireAuth>
    );
};

export default LeaderboardLayout;