import RequireAuth from "@/components/auth/RequireAuth";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";

type Props = {
    children: React.ReactNode;
};

const SettingsLayout = ({ children }: Props) => {
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

export default SettingsLayout;