"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
    extractApiError,
    getPasswordRuleFailures,
} from "../Authentications.helper";
import { useAuthStore, useRegisterMutation } from "../Authentications.hooks";

const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const CredentialsStep = () => {
    const router = useRouter();
    const { setCredentials } = useAuthStore();
    const registerMutation = useRegisterMutation();

    const [showPass, setShowPass] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        useAuthStore.getState().reset();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setFieldErrors({});

        const fullName = formData.fullName.trim();
        const companyName = formData.companyName.trim();
        const phoneNumber = formData.phoneNumber.trim();
        const email = formData.email.trim().toLowerCase();
        const passwordFailures = getPasswordRuleFailures(formData.password);
        const nextErrors: Record<string, string> = {};

        if (fullName.length < 2) {
            nextErrors.fullName = "Full name is required.";
        }

        if (companyName.length < 2) {
            nextErrors.companyName = "Company name is required.";
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            nextErrors.phoneNumber = "Enter a valid phone number.";
        }

        if (!isValidEmail(email)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (passwordFailures.length > 0) {
            nextErrors.password = `Must include ${passwordFailures.join(", ")}.`;
        }

        if (formData.password !== formData.confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        const credentials = {
            email,
            password: formData.password,
            fullname: fullName,
            companyName,
            phoneNumber,
        };

        registerMutation.mutate(credentials, {
            onSuccess: () => {
                setCredentials({ email: credentials.email });
                toast.success(
                    "Registration completed. Please verify your email.",
                );
                router.push(
                    `/verify-email?email=${encodeURIComponent(credentials.email)}`,
                );
            },
            onError: (error) => {
                const message = extractApiError(
                    error,
                    "Registration failed. Please try again.",
                );
                setFormError(message);
            },
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                    Create your account
                </h1>
                <p className="mt-2 text-base text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/signin"
                        className="font-bold text-brand-primary hover:underline"
                    >
                        Sign in instead
                    </Link>
                </p>
            </header>

            <div className="mb-8 rounded-xl border border-brand-primary/10 bg-brand-primary/[0.02] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-2">Password Policy</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                        "At least 8 characters",
                        "One uppercase letter",
                        "One lowercase letter",
                        "One number",
                        "One special character"
                    ].map((rule, i) => (
                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                            <div className="h-1 w-1 rounded-full bg-brand-primary/40" />
                            {rule}
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {formError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 animate-in shake-1">
                        {formError}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="fullName">Full Name</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-primary"><User size={16} /></div>
                            <input
                                id="fullName"
                                type="text"
                                className={`w-full h-11 pl-10 pr-3 bg-white border rounded-xl text-sm font-medium transition-all outline-none ${fieldErrors.fullName ? "border-red-500 ring-4 ring-red-500/10" : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"}`}
                                placeholder="John Doe"
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        {fieldErrors.fullName && (
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{fieldErrors.fullName}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="companyName">Company</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-primary"><Building2 size={16} /></div>
                            <input
                                id="companyName"
                                type="text"
                                className={`w-full h-11 pl-10 pr-3 bg-white border rounded-xl text-sm font-medium transition-all outline-none ${fieldErrors.companyName ? "border-red-500 ring-4 ring-red-500/10" : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"}`}
                                placeholder="TalentX Inc."
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>
                        {fieldErrors.companyName && (
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{fieldErrors.companyName}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="phoneNumber">Phone Number</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-primary"><Phone size={16} /></div>
                        <input
                            id="phoneNumber"
                            type="tel"
                            className={`w-full h-11 pl-10 pr-3 bg-white border rounded-xl text-sm font-medium transition-all outline-none ${fieldErrors.phoneNumber ? "border-red-500 ring-4 ring-red-500/10" : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"}`}
                            placeholder="+8801234567890"
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                    </div>
                    {fieldErrors.phoneNumber && (
                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{fieldErrors.phoneNumber}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="email">Work Email</label>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-primary"><Mail size={16} /></div>
                        <input
                            id="email"
                            type="email"
                            className={`w-full h-11 pl-10 pr-3 bg-white border rounded-xl text-sm font-medium transition-all outline-none ${fieldErrors.email ? "border-red-500 ring-4 ring-red-500/10" : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"}`}
                            placeholder="name@company.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    {fieldErrors.email && (
                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{fieldErrors.email}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="password">Password</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-primary"><Lock size={16} /></div>
                            <input
                                id="password"
                                type={showPass ? "text" : "password"}
                                className={`w-full h-11 pl-10 pr-10 bg-white border rounded-xl text-sm font-medium transition-all outline-none ${fieldErrors.password ? "border-red-500 ring-4 ring-red-500/10" : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"}`}
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {fieldErrors.password && (
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider leading-tight">{fieldErrors.password}</p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="confirmPassword">Confirm</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-primary"><Lock size={16} /></div>
                            <input
                                id="confirmPassword"
                                type={showPass ? "text" : "password"}
                                className={`w-full h-11 pl-10 pr-3 bg-white border rounded-xl text-sm font-medium transition-all outline-none ${fieldErrors.confirmPassword ? "border-red-500 ring-4 ring-red-500/10" : "border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"}`}
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                        {fieldErrors.confirmPassword && (
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full h-12 bg-brand-primary text-white rounded-xl text-sm font-black tracking-wide transition-all hover:bg-brand-hover hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                    {registerMutation.isPending ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                            Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <p className="mt-8 text-center text-[10px] leading-relaxed text-muted-foreground/60">
                By creating an account, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
        </div>
    );
};
