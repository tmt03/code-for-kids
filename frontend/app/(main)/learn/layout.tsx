"use client"

import RequireAuth from "@/components/auth/RequireAuth";
import { useTrial } from "@/hooks/useTrial";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode;
};

const LearnPageLayout = ({ children }: Props) => {
    const { isTrialMode, canAccessChapter, canAccessQuest } = useTrial();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isTrialMode) return;

        // Chặn truy cập quest không được phép
        if (pathname.startsWith('/learn/quests/')) {
            const questId = pathname.split('/').pop();
            if (questId && !canAccessQuest(questId)) {
                // Thêm delay nhỏ để tránh race condition
                setTimeout(() => {
                    router.replace("/learn/chapters");
                }, 100);
                return;
            }
        }

    }, [isTrialMode, pathname, canAccessChapter, canAccessQuest, router]);

    return (
        <RequireAuth>
            <div className="">
                <main className="">
                    {children}
                </main>
            </div>
        </RequireAuth>
    );
};

export default LearnPageLayout;