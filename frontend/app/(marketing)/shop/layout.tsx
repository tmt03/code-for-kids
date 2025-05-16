import ShopHeader from '@/components/shop/header';
import ShopFooter from '@/components/shop/footer';

type Props = {
    children: React.ReactNode;
};

const ShopLayout = ({ children }: Props) => {
    return (
        <div className="flex-1 flex flex-col min-h-screen">
            <ShopHeader />
            <main className="flex-1 flex flex-col justify-center items-center">{children}</main>
            <ShopFooter />
        </div>
    );
};

export default ShopLayout;