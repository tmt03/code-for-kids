import RequireAuth from "@/components/auth/RequireAuth";
import RequirePermission from "@/components/auth/RequirePermission";
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import { ProgressProvider } from "@/contexts/ProgresssContext";

type Props = {
    children: React.ReactNode;
};

const ProfileLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <RequirePermission permission="viewProfile">
                <ProgressProvider>
                    <div className="">
                        <Header />
                        {children}
                        <Footer />
                    </div>
                </ProgressProvider>
            </RequirePermission>
        </RequireAuth>
    );
};

export default ProfileLayout;