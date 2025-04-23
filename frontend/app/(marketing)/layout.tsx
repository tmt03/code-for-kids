
type Props = {
    children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
    return (
        <div className="">
            <main className="">
                {children}
            </main>
        </div>
    );
};

export default MarketingLayout;