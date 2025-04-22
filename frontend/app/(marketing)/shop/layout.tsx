
type Props = {
    children: React.ReactNode;
};

const ShopLayout = ({ children }: Props) => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center">
            {children}
        </div>
    );
};

export default ShopLayout;