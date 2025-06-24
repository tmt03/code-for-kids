import SidebarAdmin from "@/components/admin/sidebar-admin";
import RequireAuth from "@/components/auth/RequireAuth";
import Footer from '@/components/layouts/footer';
import Header from "@/components/layouts/header";

type Props = {
    children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <div className="">
                <Header />
                <div className="flex flex-1">
                    <SidebarAdmin />
                    <div className="">
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
        </RequireAuth>
    );
};

export default DashboardLayout;