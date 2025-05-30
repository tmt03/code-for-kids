"use client"

import { fetchQuestDetails, submitCode } from '@/app/apis';
import CodeEditor from '@/components/code-editor';
import GameCanvas from '@/components/game-canvas';
import InteractionBox from '@/components/interaction-box';
import { Button } from '@/components/ui/button';
import { FrontendCodeValidator } from '@/utils/codeValidatior';
import { speak } from '@/utils/speak';
import { CopyIcon, DeleteIcon, PlayIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';

export default function ChapterPage({ params }: { params: Promise<{ questId: string }> }) {
    const { questId } = use(params);
    const [selectedQuest, setSelectedQuest] = useState<any>(null);
    const [userCode, setUserCode] = useState<string>("");
    const [beResult, setBeResult] = useState<any>(null);
    const [hintMessage, setHintMessage] = useState<
        string | { error?: string; smartHints?: string }
    >("");
    const [showHint, setShowHint] = useState(false);
    const [codeHelp, setCodeHelp] = useState<string>('');
    const [helpIndex, setHelpIndex] = useState<number>(0);

    // Lấy chương và chọn nhiệm vụ đầu tiên
    useEffect(() => {
        fetchQuestDetails(questId).then((quest) => {
            setSelectedQuest(quest);
        });
    }, [questId]);

    // RUN code
    const handleRun = async () => {
        setShowHint(true);
        try {
            // 1. Kiểm tra frontend trước
            const feResult = await FrontendCodeValidator.validate(userCode, selectedQuest);
            if (!feResult.passed) {
                // playSound("error");
                speak(`${feResult.error}. ${feResult.smartHints}`);
                setHintMessage({ error: feResult.error, smartHints: feResult.smartHints });
                return;
            }

            // 2. Gửi lên backend
            const result = await submitCode(userCode);
            if (!result.passed) {
                // playSound("error");
                speak(`${result.error}. ${result.smartHints}`);
                setHintMessage({ error: result.error, smartHints: result.smartHints });
                return;
            }
            setBeResult(result);
            setHintMessage({ smartHints: "Code chạy tốt! Bạn làm rất tuyệt!" });

            // Nếu thành công:
            // playSound("success");
            speak("Code chạy tốt! Bạn làm rất tuyệt!");

            // 3. Nếu backend pass thì chạy code trong game
            if (result.passed) {
                console.log("game hẹ hẹ")
                window.dispatchEvent(
                    new CustomEvent("run-user-code", {
                        detail: { code: userCode },
                    })
                );
            }
        } catch (error: any) {
            setHintMessage({ error: "Lỗi hệ thống", smartHints: "Hãy thử lại nhé!" });
        }
    };

    const handleHelp = async () => {
        setShowHint(true);
        if (!selectedQuest?.codeHelp) {
            setHintMessage({
                smartHints: 'Không có gợi ý code cho nhiệm vụ này. Hãy thử viết code và kiểm tra nhé!',
            });
            return;
        }

        if (selectedQuest.type === 'challenge') {
            const codeLines = selectedQuest.codeHelp.split('\n');
            const startIndex = helpIndex * 2;
            const accumulatedLines = codeLines.slice(0, startIndex + 2).join('\n');
            if (startIndex < codeLines.length) {
                setCodeHelp(accumulatedLines);
                setHelpIndex((prev) => prev + 1);
                setHintMessage({
                    smartHints: 'Gợi ý code đã hiển thị. Bạn có 10 giây để ghi nhớ!',
                });
                if (startIndex + 2 >= codeLines.length) {
                    setHelpIndex(0); // Reset khi hết gợi ý
                }
            } else {
                setCodeHelp('');
                setHintMessage({
                    smartHints: 'Hết gợi ý rồi! Hãy thử lại từ đầu nhé!',
                });
                setHelpIndex(0);
            }
        } else {
            setCodeHelp(selectedQuest.codeHelp);
            setHintMessage({
                smartHints: 'Gợi ý code đã hiển thị. Bạn có 10 giây để ghi nhớ!',
            });
        }
    };

    useEffect(() => {
        if (showHint) {
            const timer = setTimeout(() => {
                setShowHint(false);
                setHintMessage("");
                setCodeHelp('');
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [showHint]);

    return (
        <div className='w-full h-full flex gap-2'>
            <div className='w-3/5 h-full flex flex-col'>
                <div className='h-1/5'>
                    <InteractionBox
                        message={hintMessage || "Anh hùng nhỏ cùng học nhé!"}
                        showHint={showHint}
                        onClose={() => {
                            setShowHint(false);
                            setHintMessage("");
                        }}
                        onHelp={handleHelp}
                    />
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
                        codeHelp={codeHelp}

                    />
                )}
                <div className="absolute bottom-6 right-4 z-10 flex gap-2">
                    <Button onClick={handleRun} variant="pixelGreen" size="lg">
                        <PlayIcon className="w-4 h-4" />
                        Chạy
                    </Button>
                    <Button onClick={handleHelp} variant="pixel" size="lg">
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