import RequireAuth from "@/components/auth/RequireAuth";
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
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