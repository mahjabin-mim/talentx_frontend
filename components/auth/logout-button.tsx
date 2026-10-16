"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAccountService } from "@/features/Authentications/Authentications.service";
import { useAuthStore } from "@/features/Authentications/Authentications.hooks";

type LogoutButtonProps = {
    className: string;
    label?: string;
    signingOutLabel?: string;
    callbackUrl?: string;
};

export default function LogoutButton({
    className,
    label = "Logout",
    signingOutLabel = "Signing Out...",
    callbackUrl = "/signin",
}: LogoutButtonProps) {
    const router = useRouter();
    const { token, reset } = useAuthStore();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        if (isSigningOut) {
            return;
        }

        setIsSigningOut(true);

        try {
            if (token) {
                await logoutAccountService();
            }
        } catch {
            // Continue local cleanup even if backend logout fails.
        } finally {
            reset();
            if (typeof window !== "undefined") {
                window.localStorage.removeItem("talentx-auth-flow");
            }
            router.replace(callbackUrl);
        }
    };

    return (
        <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={className}
        >
            {isSigningOut ? (
                signingOutLabel
            ) : (
                <span className="inline-flex items-center gap-1.5">
                    <LogOut size={14} />
                    {label}
                </span>
            )}
        </button>
    );
}
