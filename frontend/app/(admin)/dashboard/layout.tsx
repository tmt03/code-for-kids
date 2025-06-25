import SidebarAdmin from "@/components/admin/sidebar-admin";
import RequireAuth from "@/components/auth/RequireAuth";
import Header from "@/components/layouts/header";

type Props = {
    children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex pt-16">
                    <SidebarAdmin />
                    <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
                        <div className="p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </RequireAuth>
    );
};

export default DashboardLayout;