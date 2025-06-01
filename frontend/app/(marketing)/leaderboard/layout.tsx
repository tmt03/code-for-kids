
type Props = {
    children: React.ReactNode;
};

const LeaderboardLayout = ({ children }: Props) => {
    return (
        <div className="">
            {children}
        </div>
    );
};

export default LeaderboardLayout;