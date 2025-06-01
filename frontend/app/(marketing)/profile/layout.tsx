import RequireAuth from "@/components/auth/RequireAuth";

type Props = {
    children: React.ReactNode;
};

const ProfileLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <div className="">
                {children}
            </div>
        </RequireAuth>
    );
};

export default ProfileLayout;