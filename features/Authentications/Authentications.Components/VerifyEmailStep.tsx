"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { extractApiError } from "../Authentications.helper";
import { useAuthStore } from "../Authentications.hooks";
import {
    resendVerificationOtpService,
    verifyEmailService,
} from "../Authentications.service";

const isValidEmail = (value: string) =>
    value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidOtp = (value: string) => /^\d{6}$/.test(value);

export const VerifyEmailStep = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const storedEmail = useAuthStore((state) => state.email);
    const initialEmail = useMemo(
        () => searchParams.get("email") ?? storedEmail ?? "",
        [searchParams, storedEmail],
    );

    const [email, setEmail] = useState(initialEmail);
    const [otpCode, setOtpCode] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const validateEmail = () => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail) {
            setFormError("Email is required.");
            return null;
        }

        if (!isValidEmail(normalizedEmail)) {
            setFormError("Enter a valid email address.");
            return null;
        }

        return normalizedEmail;
    };

    const handleVerify = async (event: React.FormEvent) => {
        event.preventDefault();
        setFormError(null);
        setStatusMessage(null);

        const normalizedEmail = validateEmail();
        if (!normalizedEmail) return;

        const normalizedOtp = otpCode.trim();
        if (!isValidOtp(normalizedOtp)) {
            setFormError("OTP code must be a 6-digit number.");
            return;
        }

        setIsVerifying(true);

        try {
            await verifyEmailService({
                email: normalizedEmail,
                otpCode: normalizedOtp,
            });
            toast.success("Email verified successfully! Please sign in.");
            router.replace("/signin");
        } catch (error) {
            setFormError(
                extractApiError(
                    error,
                    "Unable to verify your email. Please try again.",
                ),
            );
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setFormError(null);
        setStatusMessage(null);

        const normalizedEmail = validateEmail();
        if (!normalizedEmail) return;

        setIsResending(true);

        try {
            const response = await resendVerificationOtpService({
                email: normalizedEmail,
            });
            setStatusMessage(response.message);
            toast.success("Verification code resent successfully.");
        } catch (error) {
            setFormError(
                extractApiError(
                    error,
                    "Unable to resend verification code. Please try again.",
                ),
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="bg-white rounded-[16px] py-[40px] px-[36px] w-[580px]">
            <div className="text-[20px] font-extrabold text-[#111827] mb-[28px]">
                <span className="text-[#111827]">Talent</span>
                <span className="text-[#5b86e5]">X</span>
            </div>

            <h1 className="text-[22px] font-bold text-[#111827] mb-[8px]">
                Verify Email
            </h1>
            <p className="text-[13px] text-[#6b7280] mb-[28px]">
                We have sent a 6-digit verification code to{" "}
                <span className="font-semibold text-[#111827]">{email}</span>.
                Please enter it below.
            </p>

            <form onSubmit={handleVerify}>
                {formError ? (
                    <div className="mb-[16px] rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-[12px] py-[10px] text-[13px] text-[#b91c1c]">
                        {formError}
                    </div>
                ) : null}

                {statusMessage ? (
                    <div className="mb-[16px] rounded-[6px] border border-[#bbf7d0] bg-[#f0fdf4] px-[12px] py-[10px] text-[13px] text-[#15803d]">
                        {statusMessage}
                    </div>
                ) : null}

                <div className="mb-[16px]">
                    <label
                        className="block text-[13px] font-semibold text-[#111827] mb-[8px]"
                        htmlFor="otpCode"
                    >
                        Verification Code{" "}
                        <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                        id="otpCode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(event) => {
                            setOtpCode(event.target.value.replace(/\D/g, ""));
                            if (formError) setFormError(null);
                        }}
                        className="w-full h-[44px] px-[14px] border border-[#d1d5db] rounded-[6px] text-[14px] text-[#111827] outline-none transition-colors duration-200 focus:border-[#5571a9] placeholder:text-[#9ca3af]"
                        placeholder="123456"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isVerifying || isResending}
                    className="w-full h-[44px] bg-[#5571a9] text-white border-none rounded-[6px] text-[14px] font-semibold cursor-pointer mt-[8px] transition-colors duration-200 hover:bg-[#465f91] disabled:bg-[#9ca3af] flex items-center justify-center"
                >
                    {isVerifying ? "Verifying..." : "Verify Email"}
                </button>
            </form>

            <button
                type="button"
                onClick={handleResend}
                disabled={isVerifying || isResending}
                className="mt-[16px] w-full h-[44px] rounded-[6px] border border-[#d1d5db] bg-white text-[14px] font-semibold text-[#111827] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:text-[#9ca3af]"
            >
                {isResending ? "Sending..." : "Resend Code"}
            </button>

            <p className="mt-[32px] text-[13px] text-[#6b7280]">
                Already verified?{" "}
                <Link
                    href="/signin"
                    className="text-[#5571a9] font-semibold no-underline hover:underline"
                >
                    Sign In
                </Link>
            </p>
        </div>
    );
};
