import RequireAuth from "@/components/auth/RequireAuth";
import Footer from '@/components/footer';
import Header from '@/components/header';
import { ProgressProvider } from "@/contexts/ProgresssContext";

type Props = {
    children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <ProgressProvider>
                <div className="">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </ProgressProvider>
        </RequireAuth>
    );
};

export default HomeLayout;