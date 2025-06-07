"use client"

import { fetchLearnProgress, fetchQuestDetails, fetchSubmitCode } from '@/apis';
import CodeEditor from '@/components/code-editor';
import GameCanvas from '@/components/game-canvas';
import InteractionBox from '@/components/interaction-box';
import { Button } from '@/components/ui/button';
import { useProgress } from "@/hooks/useProgress";
import { FrontendCodeValidator } from '@/lib/utils/codeValidatior';
import { speak } from '@/lib/utils/speak';
import { HelpCircleIcon, PlayIcon, RefreshCwIcon, SaveIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';

interface Quest {
    id: string;
    type: "quest" | "challenge";
    baseCode?: string;
    codeHelp?: string;
}

interface ProgressSummary {
    totalScore: number;
    completedQuests: number;
    completedChallenges: number;
}


interface BackendResult {
    passed: boolean;
    error?: string;
    smartHints?: string;
}

export default function ChapterPage({ params }: { params: Promise<{ questId: string }> }) {
    const { questId } = use(params);
    const { setProgressSummary } = useProgress();

    const [selectedQuest, setSelectedQuest] = useState<any>(null);
    const [userCode, setUserCode] = useState("");
    const [beResult, setBeResult] = useState<BackendResult | null>(null);
    const [hintMessage, setHintMessage] = useState<
        string | { error?: string; smartHints?: string }
    >("");
    const [showHint, setShowHint] = useState(false);
    const [codeHelp, setCodeHelp] = useState("");
    const [helpIndex, setHelpIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Load quest and progress data
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const [quest, progress] = await Promise.all([
                    fetchQuestDetails(questId),
                    fetchLearnProgress(),
                ]);

                if (isMounted) {
                    setSelectedQuest(quest || null);
                    setUserCode(quest?.baseCode || "");
                    setProgressSummary(progress || { totalScore: 0, completedQuests: 0, completedChallenges: 0 });
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setHintMessage({ error: "Lỗi khi tải dữ liệu", smartHints: "Hãy thử lại!" });
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [questId, setProgressSummary]);

    // Handle hint timeout
    useEffect(() => {
        if (showHint) {
            const timer = setTimeout(() => {
                setShowHint(false);
                setHintMessage({});
                setCodeHelp("");
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [showHint]);

    // Nút chạy code
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
            const result = await fetchSubmitCode(userCode, questId);
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

    //Nút trợ giúp
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
                    smartHints: 'Gợi ý code đã hiển thị. Bạn có 8 giây để ghi nhớ!',
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
                smartHints: 'Gợi ý code đã hiển thị. Bạn có 8 giây để ghi nhớ!',
            });
        }
    };

    // Nút Xóa code và đặt lại về baseCode
    const handleClear = () => {
        if (selectedQuest) {
            setUserCode(selectedQuest.baseCode || ""); // Đặt lại về baseCode
            setHintMessage({ smartHints: "Code đã được xóa và đặt lại về trạng thái ban đầu!" });
            setShowHint(true);
            speak("Code đã được xóa và đặt lại về trạng thái ban đầu!");
        } else {
            setUserCode(""); // Nếu selectedQuest chưa tải, chỉ clear
            setHintMessage({ smartHints: "Code đã được xóa, nhưng chưa tải được base code!" });
            setShowHint(true);
            speak("Code đã được xóa, nhưng chưa tải được base code!");
        }
    };


    return (
        <div className="w-full h-full flex flex-col md:flex-row p-1 gap-2 md:gap-4">
            <div className="w-full md:w-3/5 h-full flex flex-col">
                <div className="h-1/5">
                    <InteractionBox
                        message={hintMessage || "Anh hùng nhỏ cùng học nhé!"}
                        showHint={showHint}
                    />
                </div>
                <div className="h-[80%] flex-1 min-h-0 pt-2">
                    <div className="w-full h-full aspect-[2/1] min-h-[360px] min-w-[720px] max-h-[1440px] max-w-[2880px]">
                        <GameCanvas quest={selectedQuest} />
                    </div>
                </div>
            </div>
            <div className="w-full md:w-2/5 h-full relative flex flex-col">
                {selectedQuest && (
                    <CodeEditor
                        initialValue={selectedQuest.baseCode}
                        onChange={setUserCode}
                        codeClear={userCode}
                        codeHelp={codeHelp}
                    />
                )}
                <div className="absolute bottom-4 right-2 z-10 flex gap-2 md:gap-4">
                    <Button onClick={handleRun} variant="pixelGreen" size="lg">
                        <PlayIcon className="w-4 h-4" />
                        Chạy Code
                    </Button>
                    <Button onClick={handleHelp} variant="pixel" size="lg">
                        <HelpCircleIcon className="w-4 h-4" />
                        Trợ giúp
                    </Button>
                    <Button onClick={handleClear} variant="pixelDanger" size="lg">
                        <RefreshCwIcon className="w-4 h-4" />
                        Làm lại
                    </Button>
                    <Button variant="pixelYellow" size="lg">
                        <SaveIcon className="w-4 h-4" />
                        Lưu game
                    </Button>
                </div>
            </div>
        </div>
    );
}; 