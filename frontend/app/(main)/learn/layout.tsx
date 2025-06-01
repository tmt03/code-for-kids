import RequireAuth from "@/components/auth/RequireAuth";

type Props = {
    children: React.ReactNode;
};

const LearnPageLayout = ({ children }: Props) => {
    return (
        <RequireAuth>
            <div className="">
                <main className="">
                    {children}
                </main>
            </div>
        </RequireAuth>
    );
};

export default LearnPageLayout;