"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import {
    extractApiError,
    resolvePostAuthRoute,
} from "../Authentications.helper";
import { RegistrationStep } from "../Authentications.enum";
import { useAuthStore } from "../Authentications.hooks";
import {
    loginAccountService,
    resendVerificationOtpService,
} from "../Authentications.service";

export const SignInStep = () => {
    const router = useRouter();

    const {
        setCredentials,
        setAuthTokens,
        setProfileData,
        setStep,
        token,
        userRole,
    } = useAuthStore();

    const [showPass, setShowPass] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const isValidEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    useEffect(() => {
        if (!token || !userRole) {
            return;
        }

        router.replace(resolvePostAuthRoute(userRole));
    }, [router, token, userRole]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        const normalizedEmail = formData.email.trim().toLowerCase();
        const nextErrors: Record<string, string> = {};

        if (!isValidEmail(normalizedEmail)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!formData.password.trim()) {
            nextErrors.password = "Password can't be empty.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            setIsSubmitting(false);
            return;
        }

        const credentials = {
            email: normalizedEmail,
            password: formData.password,
        };

        try {
            const response = await loginAccountService(credentials);
            setAuthTokens(response);
            setCredentials({ email: credentials.email });
            setProfileData({
                fullName: response.fullname || response.email,
            });
            setStep(RegistrationStep.COMPLETED);

            router.replace(resolvePostAuthRoute(response.userRole ?? null));
        } catch (error) {
            if (isAxiosError(error)) {
                const data = error.response?.data as
                    | {
                          requiresVerification?: boolean;
                          nextAction?: string;
                      }
                    | undefined;

                if (
                    error.response?.status === 403 &&
                    data?.requiresVerification &&
                    data.nextAction === "verify_email"
                ) {
                    try {
                        await resendVerificationOtpService({
                            email: credentials.email,
                        });
                    } catch {
                        // ignore
                    }

                    router.push(
                        `/verify-email?email=${encodeURIComponent(credentials.email)}`,
                    );
                    return;
                }
            }

            const message = extractApiError(
                error,
                "Sign in failed. Please try again.",
            );
            setFormError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                    Welcome back
                </h1>
            </header>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {formError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 animate-in shake-1">
                        {formError}
                    </div>
                )}

                <div className="space-y-2">
                    <label
                        className="text-sm font-bold tracking-tight text-foreground"
                        htmlFor="email"
                    >
                        Email Address
                    </label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-primary">
                            <Mail size={18} />
                        </div>
                        <input
                            id="email"
                            type="email"
                            required
                            className={`w-full h-12 pl-11 pr-4 bg-white border rounded-xl text-sm font-medium transition-all outline-none ${
                                fieldErrors.email
                                    ? "border-red-500 ring-4 ring-red-500/10"
                                    : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                            }`}
                            placeholder="name@company.com"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>
                    {fieldErrors.email && (
                        <p className="text-sm font-bold text-red-600">
                            {fieldErrors.email}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            className="text-sm font-bold tracking-tight text-foreground"
                            htmlFor="password"
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-primary">
                            <Lock size={18} />
                        </div>
                        <input
                            id="password"
                            type={showPass ? "text" : "password"}
                            required
                            className={`w-full h-12 pl-11 pr-12 bg-white border rounded-xl text-sm font-medium transition-all outline-none ${
                                fieldErrors.password
                                    ? "border-red-500 ring-4 ring-red-500/10"
                                    : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
                            }`}
                            placeholder="••••••••"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            {showPass ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    {fieldErrors.password && (
                        <p className="text-sm font-bold text-red-600">
                            {fieldErrors.password}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-brand-primary text-white rounded-xl text-sm font-black tracking-wide transition-all hover:bg-brand-hover hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                            Signing In...
                        </>
                    ) : (
                        "Sign In to TalentX"
                    )}
                </button>
            </form>
        </div>
    );
};
