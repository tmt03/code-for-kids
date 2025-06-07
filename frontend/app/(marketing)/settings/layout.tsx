import RequireAuth from "@/components/auth/RequireAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";

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