import RequireAuth from "@/components/auth/RequireAuth";
import RequirePermission from "@/components/auth/RequirePermission";

type Props = {
    children: React.ReactNode;
};

const ProfileLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <RequirePermission permission="viewProfile">
                <div className="">
                    {children}
                </div>
            </RequirePermission>
        </RequireAuth>
    );
};

export default ProfileLayout;