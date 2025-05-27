"use client"

import { fetchQuestDetails, submitCode } from '@/app/apis';
import CodeEditor from '@/components/code-editor';
import GameCanvas from '@/components/game-canvas';
import InteractionBox from '@/components/interaction-box';
import { Button } from '@/components/ui/button';
import { FrontendCodeValidator } from '@/utils/codeValidatior';
import { CopyIcon, DeleteIcon, PlayIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';

export default function ChapterPage({ params }: { params: Promise<{ questId: string }> }) {
    const { questId } = use(params);
    const [selectedQuest, setSelectedQuest] = useState<any>(null);
    const [userCode, setUserCode] = useState<string>("");
    const [beResult, setBeResult] = useState<any>(null);

    // Lấy chương và chọn nhiệm vụ đầu tiên
    useEffect(() => {
        fetchQuestDetails(questId).then((quest) => {
            setSelectedQuest(quest);
        });
    }, [questId]);

    // RUN code
    const handleRun = async () => {

        const feResult = await FrontendCodeValidator.validate(userCode, selectedQuest);
        if (!feResult.passed) {
            alert(feResult.error + "ở đây"); //sau sẽ sử dung smart hint
            return;
        }

        // Gửi code lên BE
        const result = await submitCode(userCode);
        if (!result.passed) {
            alert("Sai rồi hãy thử lại!"); //sau sẽ sử dung smart hint
            return;
        }
        setBeResult(result); // Lưu kết quả từ BE

        if (beResult.passed) {
            // chạy phần code hoàn chỉnh bên GameCanvas
            window.dispatchEvent(
                new CustomEvent("run-user-code", {
                    detail: { code: userCode },
                })
            );
        } else {
            alert("Sai rồi hãy thử lại!");
        }
    };

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
                    <Button onClick={handleRun} variant="pixelGreen" size="lg">
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