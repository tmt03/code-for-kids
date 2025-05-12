type Props = {
    children: React.ReactNode;
};

const ProfileLayout = ({ children }: Props) => {
    return (
        <div className="">
            {children}
        </div>
    );
};

export default ProfileLayout;