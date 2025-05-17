type Props = {
    children: React.ReactNode;
};

const CoursesPageLayout = ({ children }: Props) => {
    return (
        <div className="">
            <main className="">
                {children}
            </main>
        </div>
    );
};

export default CoursesPageLayout;