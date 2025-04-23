import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="p-4 space-y-4 flex flex-col max-w-[200]">
            <Button>Button</Button>

            <Button variant="pixel">Button</Button>

            <Button variant="pixelYellow">Button</Button>

            <Button variant="pixelDanger">Button</Button>

            <Button variant="pixelGreen">Button</Button>
        </div>
    )
}
