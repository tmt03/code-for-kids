
type Props = {
    children: React.ReactNode;
};

const LandingLayout = ({ children }: Props) => {
    return (
        <div className="justify-center items-center">
           <main className="justify-center items-center">
                {children}
            </main>
        </div>
    );
};

export default LandingLayout;