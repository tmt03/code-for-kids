"use client"

import { fetchLearnProgress, fetchQuestDetails, fetchSubmitCode, saveUserGame } from '@/apis';
import CodeEditor from '@/components/code-editor';
import GameCanvas from '@/components/game-canvas';
import InteractionBox from '@/components/interaction-box';
import { Button } from '@/components/ui/button';
import { useProgress } from "@/hooks/useProgress";
import { FrontendCodeValidator } from '@/lib/utils/codeValidatior';
import { speak } from '@/lib/utils/speak';
import { HelpCircleIcon, PlayIcon, RefreshCwIcon, SaveIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";


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

interface SaveGameResponse {
    message: string;
    slug: string;
}

const CREATIVE_MODE_CODE = `// Chế độ sáng tạo: Tự do tạo game của bạn!`;


export default function ChapterPage({ params }: { params: Promise<{ questId: string }> }) {
    const { questId } = use(params);
    const { setProgressSummary } = useProgress();
    const { user } = useAuth();

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
    const [isResetting, setIsResetting] = useState(false);

    const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
    const [gameTitle, setGameTitle] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    const [shareLink, setShareLink] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isCreativeMode, setIsCreativeMode] = useState(questId === "creative");

    // Load quest and progress data
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                let quest = null;
                let progress = null;


                if (!isCreativeMode) {
                    // Chế độ học: Tải nhiệm vụ
                    [quest, progress] = await Promise.all([
                        fetchQuestDetails(questId),
                        fetchLearnProgress(),
                    ]);
                } else {
                    // Chế độ sáng tạo: Không tải nhiệm vụ, chỉ tải tiến trình
                    progress = await fetchLearnProgress();
                }

                if (isMounted) {
                    if (isCreativeMode) {
                        setSelectedQuest({ id: "creative", mode: "creative" });
                        setUserCode(CREATIVE_MODE_CODE);
                    } else {
                        setSelectedQuest(quest || null);
                        setUserCode(quest?.baseCode || "");
                    }
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
    }, [questId, setProgressSummary, isCreativeMode]);

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
        if (isCreativeMode) {
            console.log(userCode)
            setHintMessage({ smartHints: "Chế độ sáng tạo: Code được chạy trực tiếp trên canvas!" });
            setShowHint(true);
            window.dispatchEvent(
                new CustomEvent("run-user-code", {
                    detail: { code: userCode },
                })
            );
            return;
        }

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

    // Nút trợ giúp (Chỉ hoạt động ở chế độ học)
    const handleHelp = async () => {
        if (isCreativeMode) {
            setHintMessage({ smartHints: "Chế độ sáng tạo không có gợi ý. Hãy tự do sáng tạo!" });
            setShowHint(true);
            return;
        }

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

    // Nút Làm lại
    const handleClear = async () => {
        setIsResetting(true);
        setShowHint(true);

        try {
            if (isCreativeMode) {
                setUserCode(CREATIVE_MODE_CODE);
                setHintMessage({ smartHints: "Đã đặt lại canvas sáng tạo!" });
                speak("Đã đặt lại canvas sáng tạo!");
                window.dispatchEvent(new CustomEvent("reset-canvas"));
            } else {
                const quest = await fetchQuestDetails(questId);
                if (!quest) {
                    setHintMessage({ error: "Không tìm thấy nhiệm vụ", smartHints: "Kiểm tra lại kết nối hoặc thử lại sau!" });
                    setUserCode("");
                    setIsResetting(false);
                    return;
                }

                setSelectedQuest(quest);
                setUserCode(quest?.baseCode || "");
                setHintMessage({ smartHints: "Đã làm mới nhiệm vụ và đặt lại code về trạng thái ban đầu!" });
                speak("Đã làm mới nhiệm vụ và đặt lại code về trạng thái ban đầu!");
                window.dispatchEvent(new CustomEvent("reset-canvas"));
            }
        } catch (error) {
            setHintMessage({ error: "Lỗi khi làm mới dữ liệu", smartHints: "Hãy thử lại!" });
            setUserCode("");
        } finally {
            setIsResetting(false);
        }
    };

    // Nút lưu game
    const handleSaveGame = async () => {
        // Validate title
        if (!gameTitle.trim() || gameTitle.length < 3 || gameTitle.length > 100) {
            setHintMessage({
                error: "Tiêu đề game phải từ 3 đến 100 ký tự!",
                smartHints: ""
            });
            setShowHint(true);
            return;
        }

        // Validate code
        if (!userCode || userCode.length < 10) {
            setHintMessage({
                error: "Code game phải có ít nhất 10 ký tự!",
                smartHints: ""
            });
            setShowHint(true);
            return;
        }

        // Validate description
        if (gameDescription && gameDescription.length > 500) {
            setHintMessage({
                error: "Mô tả game không được quá 500 ký tự!",
                smartHints: ""
            });
            setShowHint(true);
            return;
        }

        if (!user?.userId) {
            setHintMessage({ error: "Vui lòng đăng nhập để lưu game!", smartHints: "" });
            setShowHint(true);
            return;
        }

        setIsSaving(true);
        try {
            const response = await saveUserGame({
                title: gameTitle.trim(),
                description: gameDescription?.trim() || "",
                code: userCode,
            });

            // Lấy slug từ data trong response
            const { data } = response;
            if (!data?.slug) {
                throw new Error("Không thể lấy thông tin game sau khi lưu");
            }

            const shareUrl = `http://localhost:3000/play/shared-game/${data.slug}`;
            setShareLink(shareUrl);
            setHintMessage({ smartHints: "Game đã được lưu thành công! Chia sẻ link với bạn bè nhé!" });
            setShowHint(true);
        } catch (error: any) {
            setHintMessage({
                error: "Lỗi khi lưu game",
                smartHints: error.response?.data?.details?.join(", ") || error.message
            });
            setShowHint(true);
        } finally {
            setIsSaving(false);
        }
    };

    // Sao chép link chia sẻ
    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setHintMessage({ smartHints: "Đã sao chép link chia sẻ!" });
        setShowHint(true);
    };



    // Nếu đang tải hoặc làm mới
    if (isLoading || isResetting) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="text-lg font-semibold text-gray-700">
                    {isResetting ? "Đang làm mới nhiệm vụ..." : "Đang tải nhiệm vụ..."}
                </div>
                <div className="mt-4">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                        ></path>
                    </svg>
                </div>
            </div>
        );
    }

    // Nếu không tìm thấy quest (chỉ ở chế độ học)
    if (!isCreativeMode && !selectedQuest) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
                <InteractionBox
                    message={{ error: "Không tìm thấy nhiệm vụ", smartHints: "Kiểm tra lại kết nối hoặc thử lại sau!" }}
                    showHint={true}
                />
                <Button
                    onClick={() => window.location.reload()}
                    variant="pixel"
                    size="lg"
                    className="mt-4"
                >
                    Thử lại
                </Button>
            </div>
        );
    }


    return (
        <div className="w-full h-full flex flex-col md:flex-row p-1 gap-2 md:gap-4">
            <div className="w-full md:w-3/5 h-full flex flex-col">
                <div className="h-1/5">
                    <InteractionBox
                        message={hintMessage || (isCreativeMode ? "Tự do sáng tạo game của bạn!" : "Anh hùng nhỏ cùng học nhé!")}
                        showHint={showHint}
                    />
                </div>
                <div className="h-[80%] flex-1 min-h-0 pt-2">
                    <div className="w-full h-full aspect-[2/1] min-h-[360px] min-w-[720px] max-h-[1440px] max-w-[2880px]">
                        <GameCanvas quest={{ id: questId, mode: isCreativeMode ? "creative" : "learning" }} />
                    </div>
                </div>
            </div>
            <div className="w-full md:w-2/5 h-full relative flex flex-col">
                {selectedQuest && (
                    <CodeEditor
                        initialValue={isCreativeMode ? CREATIVE_MODE_CODE : selectedQuest?.baseCode}
                        onChange={setUserCode}
                        codeClear={userCode}
                        codeHelp={codeHelp}
                    />
                )}
                <div className="absolute bottom-4 right-2 z-10 flex gap-2 md:gap-4">
                    <Button
                        onClick={handleRun}
                        variant="pixelGreen"
                        size="lg"

                    >
                        <PlayIcon className="w-4 h-4" />
                        Chạy Code
                    </Button>
                    <Button
                        onClick={handleHelp}
                        variant="pixel"
                        size="lg"
                        disabled={isCreativeMode}
                    >
                        <HelpCircleIcon className="w-4 h-4" />
                        Trợ giúp
                    </Button>
                    <Button onClick={handleClear} variant="pixelDanger" size="lg">
                        <RefreshCwIcon className="w-4 h-4" />
                        Làm lại
                    </Button>
                    <Button onClick={() => setIsSavePopupOpen(true)} variant="pixelYellow" size="lg">
                        <SaveIcon className="w-4 h-4" />
                        Lưu game
                    </Button>
                </div>
            </div>
            {/* Popup lưu game */}
            {isSavePopupOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1c1c2e] p-6 rounded-lg border border-[#3a3a5a] w-full max-w-md">
                        <h2 className="text-xl font-bold text-white mb-4">Lưu và chia sẻ game</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-300">Tiêu đề game</label>
                                <Input
                                    value={gameTitle}
                                    onChange={(e: any) => setGameTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề game"
                                    className="bg-[#2a2a4a] text-white border-[#3a3a5a]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Mô tả game</label>
                                <Textarea
                                    value={gameDescription}
                                    onChange={(e: any) => setGameDescription(e.target.value)}
                                    placeholder="Mô tả game của bạn"
                                    className="bg-[#2a2a4a] text-white border-[#3a3a5a] h-24"
                                />
                            </div>
                            {shareLink && (
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={shareLink}
                                        readOnly
                                        className="bg-[#2a2a4a] text-white border-[#3a3a5a]"
                                    />
                                    <Button onClick={handleCopyLink} variant="pixelGreen">
                                        Sao chép
                                    </Button>
                                </div>
                            )}
                            <div className="flex justify-end gap-2">
                                <Button
                                    onClick={() => {
                                        setIsSavePopupOpen(false);
                                        setShareLink("");
                                        setGameTitle("");
                                        setGameDescription("");
                                    }}
                                    variant="pixel"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleSaveGame}
                                    variant="pixelYellow"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Đang lưu..." : "Lưu game"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};