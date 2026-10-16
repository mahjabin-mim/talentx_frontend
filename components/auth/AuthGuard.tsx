"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/Authentications/Authentications.hooks";
import { UserRole } from "@/features/Authentications/Authentications.enum";
import PageLoader from "@/components/PageLoader/PageLoader";

export function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token, userRole, hydrated } = useAuthStore();

    useEffect(() => {
        if (!hydrated) return;

        const isEmployerPath =
            pathname.startsWith("/employer") || pathname.startsWith("/talent/");

        const isTalentPath =
            pathname.startsWith("/talent-dashboard") ||
            pathname.startsWith("/talent-profile");

        const isProtectedPath = isEmployerPath || isTalentPath;

        const isAuthFlowPath =
            pathname.startsWith("/signin") ||
            pathname.startsWith("/register") ||
            pathname.startsWith("/verify-email");

        if (isProtectedPath && !token) {
            router.replace("/signin");
            return;
        }

        if (token && userRole) {
            if (isEmployerPath && userRole !== UserRole.EMPLOYER) {
                router.replace("/talent-dashboard");
                return;
            }
            if (isTalentPath && userRole !== UserRole.TALENT) {
                router.replace("/employer/dashboard");
                return;
            }

            if (isAuthFlowPath) {
                if (userRole === UserRole.EMPLOYER) {
                    router.replace("/employer/dashboard");
                } else {
                    router.replace("/talent-dashboard");
                }
            }
        }
    }, [pathname, token, userRole, hydrated, router]);

    if (!hydrated) {
        return <PageLoader message="Initializing application..." />;
    }

    return <>{children}</>;
}
