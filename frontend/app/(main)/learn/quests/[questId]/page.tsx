"use client"

import { fetchAllChapters, fetchLearnProgress, fetchQuestDetails, fetchSubmitCode, saveUserGame } from '@/apis';
import CodeEditor from '@/components/learn/quests/code-editor';
import GameCanvas from '@/components/learn/quests/game-canvas';
import InteractionBox from '@/components/learn/quests/interaction-box';
import { Button } from '@/components/ui/button';
import { useProgress } from "@/hooks/useProgress";
import { FrontendCodeValidator } from '@/lib/utils/codeValidatior';
import { playSound } from '@/lib/utils/sound';
import { HelpCircleIcon, PlayIcon, RefreshCwIcon, SaveIcon } from 'lucide-react';
import { use, useEffect, useState } from 'react';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useTrial } from '@/hooks/useTrial';
import { truncateBeforeDot } from '@/lib/utils/stringUtils';


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
    const { canSubmitCode, canSaveGame, isTrialMode } = useTrial();
    // Ẩn nút lưu game nếu là trial
    const showSaveButton = canSaveGame();

    // // Chỉ hiện nút lưu game ở chapter C07-Q07 và chế độ sáng tạo
    // const showSaveButton = canSaveGame() && (questId === "creative" || questId === "C07_Q07");

    const [selectedQuest, setSelectedQuest] = useState<any>(null);
    const [userCode, setUserCode] = useState("");
    const [beResult, setBeResult] = useState<BackendResult | null>(null);
    const [hintMessage, setHintMessage] = useState<
        string | { error?: string; smartHints?: string }
    >("Scriptbies luôn đồng hàng cùng bạn nhỏ!");
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
    const [isMobile, setIsMobile] = useState(false); // ngăn dùng trang chạy trên ứng dung mobile

    // Load quest and progress data
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                let quest = null;
                let progress = null;
                let allChapters = null;


                if (isCreativeMode) {
                    // Chế độ sáng tạo
                    progress = await fetchLearnProgress();
                } else if (isTrialMode) {
                    // Chế độ trial
                    quest = await fetchQuestDetails(questId);
                    progress = { totalScore: 0, completedQuests: 0, completedChallenges: 0, trialMode: true };
                } else {
                    // Chế độ học thường
                    [quest, progress, allChapters] = await Promise.all([
                        fetchQuestDetails(questId),
                        fetchLearnProgress(),
                        fetchAllChapters()
                    ]);
                }

                if (isMounted) {
                    if (isCreativeMode) {
                        setSelectedQuest({ id: "creative", mode: "creative" });
                        setUserCode(CREATIVE_MODE_CODE);
                    } else {
                        if (quest && allChapters) {
                            // 1. Tìm chương chứa nhiệm vụ hiện tại
                            const chapterOfThisQuest = allChapters.find((chapter: any) =>
                                chapter.quests.some((q: any) => q.id === questId)
                            );

                            // 2. Nếu tìm thấy, gán thông tin tiêu đề vào đối tượng quest
                            if (chapterOfThisQuest) {
                                // Tạo một thuộc tính 'chapter' mới cho quest
                                quest.chapter = {
                                    title: chapterOfThisQuest.name // Lấy 'name' từ chapter và gán vào 'title'
                                };
                            }
                        }

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
                setHintMessage("Scriptbies luôn đồng hàng cùng bạn nhỏ!");
                setCodeHelp("");
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [showHint]);

    useEffect(() => {
        // Kiểm tra kích thước màn hình khi component mount
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024 || window.innerHeight < 576);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Nếu là thiết bị di động, hiển thị thông báo
    if (isMobile) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Vui lòng sử dụng máy tính hoặc laptop</h1>
                <p className="text-gray-600">
                    Ứng dụng học lập trình game này được thiết kế cho máy tính.
                    Hãy truy cập bằng máy tính hoặc laptop để có trải nghiệm tốt nhất.
                </p>
                <Button
                    variant="pixel"
                    className="mt-6"
                    onClick={() => window.location.reload()}
                >
                    Tôi đang dùng máy tính, thử lại
                </Button>
            </div>
        );
    }

    // Nút chạy code
    const handleRun = async () => {
        // Nếu là trial mode và không được phép submit code
        if (isTrialMode && !canSubmitCode(questId)) {
            playSound("fail");
            setHintMessage({
                error: "Chế độ thử nghiệm",
                smartHints: "Chỉ có thể học chapter thử nghiệm. Nâng cấp tài khoản để mở khóa tất cả!"
            });
            setShowHint(true);
            return;
        }

        if (isCreativeMode) {
            // Validate creative mode
            const feResult = await FrontendCodeValidator.validate(userCode, { baseCode: "" }, "creative");
            if (!feResult.passed) {
                playSound("fail");
                setHintMessage({ error: feResult.error, smartHints: feResult.smartHints });
                setShowHint(true);
                return;
            }
            setHintMessage({ smartHints: "Chế độ sáng tạo: Code được chạy trực tiếp trên canvas!" });
            setShowHint(true);
            // Reset canvas trước khi chạy code mới
            window.dispatchEvent(new CustomEvent("reset-canvas"));
            setTimeout(() => {
                window.dispatchEvent(
                    new CustomEvent("run-user-code", {
                        detail: { code: userCode },
                    })
                );
            }, 200);
            return;
        }

        setShowHint(true);
        try {
            // 1. Kiểm tra frontend trước
            const feResult = await FrontendCodeValidator.validate(userCode, selectedQuest);
            if (!feResult.passed) {
                playSound("fail");
                setHintMessage({ error: feResult.error, smartHints: feResult.smartHints });
                return;
            }

            // 2. Gửi lên backend
            const result = await fetchSubmitCode(userCode, questId);
            if (!result.passed) {
                playSound("fail");
                setHintMessage({ error: result.error, smartHints: result.smartHints });
                return;
            }
            setBeResult(result);
            setHintMessage({ smartHints: "Code chạy tốt! Bạn làm rất tuyệt!" });

            // 3. Nếu backend pass thì chạy code trong game
            if (result.passed) {
                // Reset canvas trước khi chạy code mới
                window.dispatchEvent(new CustomEvent("reset-canvas"));
                setTimeout(() => {
                    window.dispatchEvent(
                        new CustomEvent("run-user-code", {
                            detail: { code: userCode },
                        })
                    );
                }, 200);
            }

            // Nếu thành công:
            playSound("success");
            // speak("Code chạy tốt! Bạn làm rất tuyệt!");
        } catch (error: any) {
            playSound("fail");
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

        if (selectedQuest) {
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
                playSound("success");
                window.dispatchEvent(new CustomEvent("reset-canvas"));
            } else {
                const quest = await fetchQuestDetails(questId);
                if (!quest) {
                    playSound("fail");
                    setHintMessage({ error: "Không tìm thấy nhiệm vụ", smartHints: "Kiểm tra lại kết nối hoặc thử lại sau!" });
                    setUserCode("");
                    setIsResetting(false);
                    return;
                }

                setSelectedQuest(quest);
                setUserCode(quest?.baseCode || "");
                setHintMessage({ smartHints: "Đã làm mới nhiệm vụ và đặt lại code về trạng thái ban đầu!" });
                playSound("success");
                window.dispatchEvent(new CustomEvent("reset-canvas"));
            }
        } catch (error) {
            playSound("fail");
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
            playSound("fail");
            setHintMessage({
                error: "Tiêu đề game phải từ 3 đến 100 ký tự!",
                smartHints: ""
            });
            setShowHint(true);
            return;
        }

        // Validate code
        if (!userCode || userCode.length < 10) {
            playSound("fail");
            setHintMessage({
                error: "Code game phải có ít nhất 10 ký tự!",
                smartHints: ""
            });
            setShowHint(true);
            return;
        }

        // Validate description
        if (gameDescription && gameDescription.length > 500) {
            playSound("fail");
            setHintMessage({
                error: "Mô tả game không được quá 500 ký tự!",
                smartHints: ""
            });
            setShowHint(true);
            return;
        }

        if (!user?.userId) {
            playSound("fail");
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

            const shareUrl = `${window.location.origin}/play/shared-game/${data.slug}`;
            console.log(shareLink)
            setShareLink(shareUrl);
            playSound("success");
            setHintMessage({ smartHints: "Game đã được lưu thành công! Chia sẻ link với bạn bè nhé!" });
            setShowHint(true);
        } catch (error: any) {
            playSound("fail");
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
        playSound("success");
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
        <div className="w-full h-full flex flex-col lg:flex-row p-1 gap-2 lg:gap-4">
            {/* Bên trái: Thông báo và game canvas */}
            <div className="w-full lg:w-3/5 h-full flex flex-col">
                <div className="flex-1 w-full max-h-[114px] min-h-[64px] pb-2">
                    <InteractionBox
                        message={hintMessage || (isCreativeMode ? "Tự do sáng tạo game của bạn!" : "Anh hùng nhỏ cùng học nhé!")}
                        showHint={showHint}
                    />
                </div>

                {/* Game canvas với container linh hoạt */}
                <div className="flex-1 min-h-0 p-2 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl">
                    <div className="w-auto max-w-full min-w-[590px] h-full max-h-full min-h-[295px] overflow-hidden rounded-lg shadow-inner">
                        <GameCanvas quest={{ id: questId, mode: isCreativeMode ? "creative" : "learning" }} />
                    </div>
                </div>
            </div>
            {/* Bên phải: Code editor */}
            <div className="w-full lg:w-2/5 h-full relative flex flex-col mt-4 lg:mt-0">
                {selectedQuest && (
                    <>
                        {!isCreativeMode && (
                            <div className="flex items-center p-2 bg-slate-800 text-white rounded-t-lg shadow-inner">
                                <span className="text-sm font-bold text-cyan-400 bg-cyan-900/50 px-2 py-1 rounded-md">
                                    {truncateBeforeDot(selectedQuest.chapter?.title) || "Chương"}
                                </span>
                                <span className="mx-2 text-slate-500">/</span>
                                <h3 className="text-md text-slate-200 truncate">
                                    {selectedQuest.name || "Nhiệm vụ"}
                                </h3>
                            </div>
                        )}
                        <CodeEditor
                            initialValue={isCreativeMode ? CREATIVE_MODE_CODE : selectedQuest?.baseCode}
                            onChange={setUserCode}
                            codeClear={userCode}
                            codeHelp={codeHelp}
                            className={!isCreativeMode ? "rounded-t-none" : ""}
                        />
                    </>
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
                    {showSaveButton && (
                        <Button onClick={() => setIsSavePopupOpen(true)} variant="pixelYellow" size="lg">
                            <SaveIcon className="w-4 h-4" />
                            Lưu game
                        </Button>
                    )}
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