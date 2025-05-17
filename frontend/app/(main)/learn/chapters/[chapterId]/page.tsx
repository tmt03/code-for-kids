"use client"

import CodeEditor from '@/components/code-editor';
import GameCanvas from '@/components/game-canvas';
import InteractionBox from '@/components/interaction-box';
import { Button } from '@/components/ui/button';
import { CopyIcon, DeleteIcon, PlayIcon } from 'lucide-react';
import React from 'react';

export default function ChapterPage({ params }: { params: { chapterId: string } }) {
    const [code, setCode] = React.useState("console.log('Hello from ChapterPage!');");
    const chapterId = React.useMemo(() => parseInt(params.chapterId), [params.chapterId]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        console.log('Code updated:', newCode);
    };

    return (
        <div className='w-full h-full flex gap-2'>

            <div className='w-3/5 h-full flex flex-col'>
                <div className='h-1/5'>
                    <InteractionBox message="Chúc mừng bạn đã hoàn thành!" />
                </div>
                <div className='h-4/5 pt-2'>
                    <GameCanvas
                        chapterId={chapterId}
                        baseCode=''
                        taskCode=''
                    />
                </div>
            </div>
            <div className="w-2/5 h-full relative flex flex-col">
                <CodeEditor
                    initialValue={code}
                    onChange={handleCodeChange}
                />
                <div className="absolute bottom-6 right-4 z-10 flex gap-2">
                    <Button variant="pixelGreen" size="lg">
                        <PlayIcon className="w-4 h-4" />
                        Chạy
                    </Button>
                    <Button variant="pixel" size="lg">
                        <CopyIcon className="w-4 h-4" />
                        Trợ giúp
                    </Button>
                    <Button variant="pixelDanger" size="lg">
                        <DeleteIcon className="w-4 h-4" />
                        Xóa
                    </Button>
                </div>
            </div>
        </div>
    );
}; 