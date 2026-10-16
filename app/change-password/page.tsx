"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Eye, EyeOff, LockKeyhole, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/Authentications/Authentications.hooks";
import { Container } from "@/components/ui/container";
import {
    changePasswordService,
    logoutAccountService,
} from "@/features/Authentications/Authentications.service";
import { extractApiError } from "@/features/Authentications/Authentications.helper";

const PASSWORD_RULES = {
    minLength: 9, // must be > 8
    hasLowercase: /[a-z]/,
    hasUppercase: /[A-Z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[^A-Za-z0-9]/,
};

export default function ChangePasswordPage() {
    const router = useRouter();
    const { token, reset } = useAuthStore();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const validateNewPassword = (value: string): string | null => {
        if (value.length < PASSWORD_RULES.minLength) {
            return "Password length must be greater than 8.";
        }

        if (!PASSWORD_RULES.hasLowercase.test(value)) {
            return "Password must contain at least 1 lowercase letter.";
        }

        if (!PASSWORD_RULES.hasUppercase.test(value)) {
            return "Password must contain at least 1 uppercase letter.";
        }

        if (!PASSWORD_RULES.hasNumber.test(value)) {
            return "Password must contain at least 1 number.";
        }

        if (!PASSWORD_RULES.hasSpecialChar.test(value)) {
            return "Password must contain at least 1 special character.";
        }

        return null;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        const newPasswordValidationError = validateNewPassword(newPassword);
        if (newPasswordValidationError) {
            setError(newPasswordValidationError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setError("Current password and new password cannot be the same.");
            return;
        }

        setLoading(true);
        void changePasswordService({
            currentPassword,
            newPassword,
        })
            .then(() => {
                setSuccess("Password changed successfully.");
                setShowSuccessModal(true);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                const logoutPromise = token
                    ? logoutAccountService().catch(() => {
                          // Continue with local logout even if API logout fails.
                      })
                    : Promise.resolve();

                return logoutPromise.finally(() => {
                    reset();
                    if (typeof window !== "undefined") {
                        window.localStorage.removeItem("talentx-auth-flow");
                    }

                    setTimeout(() => {
                        router.replace("/signin");
                    }, 1200);
                });
            })
            .catch((err) => {
                setError(extractApiError(err, "Failed to change password."));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <main className="min-h-screen bg-mesh-gradient text-foreground">
            {showSuccessModal ? (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-sm rounded-3xl border border-emerald-200/70 bg-white p-6 text-center shadow-2xl">
                        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                            <CheckCircle2 size={30} />
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-foreground">
                            Password Changed Successfully
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            You are being logged out and redirected to sign in.
                        </p>
                        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                            Redirecting now...
                        </div>
                    </div>
                </div>
            ) : null}
            <Container className="pb-20 pt-16">
                <header className="mx-auto mb-10 w-full max-w-2xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1">
                        <LockKeyhole size={14} className="text-brand-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                            Account Security
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                        Change Password
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Keep your account protected by setting a strong, unique password.
                    </p>
                </header>

                <section className="mx-auto w-full max-w-2xl rounded-[2.5rem] border border-border bg-white/60 p-6 shadow-xl backdrop-blur-xl md:p-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-muted-foreground">
                            Current Password{" "}
                            <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-11 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground cursor-pointer"
                                aria-label={
                                    showCurrentPassword
                                        ? "Hide current password"
                                        : "Show current password"
                                }
                            >
                                {showCurrentPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-muted-foreground">
                            New Password{" "}
                            <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="h-12 w-full rounded-xl border border-border bg-white px-4 pr-11 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground cursor-pointer"
                                aria-label={
                                    showNewPassword
                                        ? "Hide new password"
                                        : "Show new password"
                                }
                            >
                                {showNewPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                        <p className="mt-2 rounded-xl border border-brand-primary/15 bg-brand-primary/5 px-3 py-2 text-[11px] font-bold uppercase tracking-tight text-muted-foreground">
                            Password must be greater than 8 characters and
                            include at least 1 lowercase letter, 1 uppercase
                            letter, 1 number, and 1 special character.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-muted-foreground">
                            Confirm Password{" "}
                            <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                        />
                    </div>

                    {error ? (
                        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                            {error}
                        </p>
                    ) : null}
                    {success ? (
                        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                            {success}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-hover hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            "Saving..."
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                <Save size={16} />
                                Save Password
                            </span>
                        )}
                    </button>
                </form>
                </section>
            </Container>
        </main>
    );
}
