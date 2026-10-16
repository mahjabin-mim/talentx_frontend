import { describe, expect, it, vi } from "vitest";
import { UserRole } from "./Authentications.enum";

const postMock = vi.fn();

vi.mock("@/lib/axios", () => ({
    default: {
        post: postMock,
    },
}));

describe("registerAccountService", () => {
    it("calls backend register endpoint and returns response body", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                message: "Registration completed successfully.",
            },
        });

        const { registerAccountService } =
            await import("./Authentications.service");

        const payload = {
            email: "jane@example.com",
            password: "StrongP@ssw0rd!",
            fullname: "Jane Doe",
            companyName: "Acme Corp",
            phoneNumber: "+8801234567890",
        };

        const result = await registerAccountService(payload);

        expect(postMock).toHaveBeenCalledWith("/auth/register", payload);
        expect(result.message).toBe("Registration completed successfully.");
    });

    it("updates the authenticated user role and returns new tokens", async () => {
        const authResponse = {
            id: "user-1",
            email: "jane@example.com",
            userRole: "Talent",
            accessToken: "access-token",
            refreshToken: "refresh-token",
            refreshTokenExpiryTime: "2026-05-11T12:00:00+00:00",
            message: "Role updated successfully.",
        };

        postMock.mockResolvedValueOnce({ data: authResponse });

        const { updateUserRoleService } =
            await import("./Authentications.service");

        const result = await updateUserRoleService(
            { userRole: UserRole.TALENT },
            "existing-access-token",
        );

        expect(postMock).toHaveBeenCalledWith(
            "/auth/role",
            { userRole: "Talent" },
            {
                headers: {
                    Authorization: "Bearer existing-access-token",
                },
            },
        );
        expect(result).toEqual(authResponse);
    });

    it("verifies an email with an OTP code", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                message: "Email verified successfully.",
            },
        });

        const { verifyEmailService } =
            await import("./Authentications.service");

        const payload = {
            email: "jane@example.com",
            otpCode: "123456",
        };

        const result = await verifyEmailService(payload);

        expect(postMock).toHaveBeenCalledWith("/auth/verify-email", payload);
        expect(result.message).toBe("Email verified successfully.");
    });

    it("resends a verification OTP", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                message:
                    "A new verification code has been sent to your email.",
            },
        });

        const { resendVerificationOtpService } =
            await import("./Authentications.service");

        const payload = {
            email: "jane@example.com",
        };

        const result = await resendVerificationOtpService(payload);

        expect(postMock).toHaveBeenCalledWith(
            "/auth/resend-verification-otp",
            payload,
        );
        expect(result.message).toBe(
            "A new verification code has been sent to your email.",
        );
    });
});
