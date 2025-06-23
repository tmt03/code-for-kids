import RequireAuth from "@/components/auth/RequireAuth";
import RequirePermission from "@/components/auth/RequirePermission";
import Footer from '@/components/layouts/footer';
import Header from "@/components/layouts/header";

type Props = {
    children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <RequirePermission permission="viewDashboard">
                <div className="">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </RequirePermission>
        </RequireAuth>
    );
};

export default DashboardLayout;