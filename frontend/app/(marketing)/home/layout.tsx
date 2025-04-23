
type Props = {
    children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
    return (
        <div className="">
            {children}
        </div>
    );
};

export default HomeLayout;