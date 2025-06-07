import RequireAuth from "@/components/auth/RequireAuth";
import Footer from '@/components/footer';
import Header from '@/components/header';
import RequirePermission from "@/components/auth/RequirePermission";

type Props = {
    children: React.ReactNode;
};

const ProfileLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <RequirePermission permission="viewProfile">
                <div className="">
                    <Header />
                       {children}
                    <Footer />
                </div>
            </RequirePermission>
        </RequireAuth>
    );
};

export default ProfileLayout;