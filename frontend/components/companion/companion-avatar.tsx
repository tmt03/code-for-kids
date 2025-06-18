interface InteractionBoxProps {
    message: string;
}

const CompanionAvatar = ({ message }: InteractionBoxProps) => {
    return (
        <div className="flex justify-center">
            <img
                src="/assets/mascots/original.png"
                alt="Knight Avatar"
                className="w-[10vw] h-[15vw] max-w-[96px] max-h-[128px] min-w-[64px] min-h-[80px] object-contain"
                style={{ imageRendering: "pixelated" }}

            />
        </div>
    );
};

export default CompanionAvatar;