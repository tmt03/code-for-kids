"use client";

import { BookText, XIcon, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Quest = {
    id: string;
    name: string;
    type: 'quest' | 'challenge';
};

type Chapter = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    isSpecial: boolean;
    _destroy?: boolean;
    quests: Quest[];
};

interface ChapterQuestListPopupProps {
    chapters: Chapter[];
    currentQuestId: string;
    onClose: () => void;
}

const ChapterListPopup: React.FC<ChapterQuestListPopupProps> = ({ chapters, currentQuestId, onClose }) => {
    const router = useRouter();

    const handleQuestClick = (questId: string) => {
        router.push(`/learn/quests/${questId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border-4 border-blue-300">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">Mục lục khóa học</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="overflow-y-auto p-6 space-y-6">
                    {chapters.map(chapter => (
                        <div key={chapter.id}>
                            <h3 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-3 mb-3">
                                {chapter.name}
                            </h3>
                            <ul className="space-y-1">
                                {chapter.quests.map(quest => (
                                    <li key={quest.id}>
                                        <button
                                            onClick={() => handleQuestClick(quest.id)}
                                            className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition-colors text-sm ${quest.id === currentQuestId
                                                ? 'bg-blue-100 text-blue-800 font-bold'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {quest.type === 'quest' ? (
                                                <BookText className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Zap className="w-4 h-4 text-yellow-600" />
                                            )}
                                            <span>{quest.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChapterListPopup;