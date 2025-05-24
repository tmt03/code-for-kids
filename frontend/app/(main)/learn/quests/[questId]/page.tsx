"use client"

import { fetchQuestDetails } from '@/app/apis';
import CodeEditor from '@/components/code-editor';
import GameCanvas from '@/components/game-canvas';
import InteractionBox from '@/components/interaction-box';
import { Button } from '@/components/ui/button';
import { CopyIcon, DeleteIcon, PlayIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';

export default function ChapterPage({ params }: { params: Promise<{ questId: string }> }) {
    const { questId } = use(params);
    const [selectedQuest, setSelectedQuest] = useState<any>(null);
    const [userCode, setUserCode] = useState<string>("");

    // Lấy chương và chọn nhiệm vụ đầu tiên
    useEffect(() => {
        fetchQuestDetails(questId).then((quest) => {
            setSelectedQuest(quest);
        });
    }, [questId]);

    // RUN code
    // const handleRun = async () => {
    //     if (!selectedQuest) return;
    //     const res = await fetch("/api/code/validate", {
    //         method: "POST",
    //         body: JSON.stringify({ questId: selectedQuest.id, code: userCode }),
    //         headers: { "Content-Type": "application/json" },
    //     });

    //     const result = await res.json();
    //     if (result.passed) {
    //         // chạy phần code hoàn chỉnh bên GameCanvas
    //         window.dispatchEvent( 
    //             new CustomEvent("run-user-code", {
    //                 detail: { code: result.filledCode },
    //             })
    //         );
    //     } else {
    //         alert("Sai rồi hãy thử lại!");
    //     }
    // };

    const testRunCode = async () => {
        window.dispatchEvent(
            new CustomEvent("run-user-code", {
                detail: { code: userCode }, // đoạn code bạn vừa nhập
            })
        );
    }

    return (
        <div className='w-full h-full flex gap-2'>
            <div className='w-3/5 h-full flex flex-col'>
                <div className='h-1/5'>
                    <InteractionBox message="Chúc mừng bạn đã hoàn thành!" />
                </div>
                <div className='h-4/5 pt-2'>
                    <GameCanvas
                        quest={selectedQuest}
                    />
                </div>
            </div>
            <div className="w-2/5 h-full relative flex flex-col">
                {selectedQuest && (
                    <CodeEditor
                        initialValue={selectedQuest.baseCode}
                        onChange={setUserCode}
                    />
                )}
                <div className="absolute bottom-6 right-4 z-10 flex gap-2">
                    <Button onClick={testRunCode} variant="pixelGreen" size="lg">
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