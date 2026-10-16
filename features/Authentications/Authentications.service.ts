import api from "@/lib/axios";
import {
    IAuthResponse,
    IChangePasswordRequest,
    IEmployerCreateProfileRequest,
    ILoginCredentials,
    IResendVerificationOtpRequest,
    IResendVerificationOtpResponse,
    IRefreshTokenRequest,
    IRegisterRequest,
    IRegisterResponse,
    IUpdateUserRoleRequest,
    IVerifyEmailRequest,
    IVerifyEmailResponse,
} from "./Authentications.interface";

export async function registerAccountService(
    payload: IRegisterRequest,
): Promise<IRegisterResponse> {
    const response = await api.post<IRegisterResponse>(
        "/auth/register",
        payload,
    );
    return response.data;
}

export async function loginAccountService(
    payload: ILoginCredentials,
): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>("/auth/login", payload);
    return response.data;
}

export async function verifyEmailService(
    payload: IVerifyEmailRequest,
): Promise<IVerifyEmailResponse> {
    const response = await api.post<IVerifyEmailResponse>(
        "/auth/verify-email",
        payload,
    );
    return response.data;
}

export async function resendVerificationOtpService(
    payload: IResendVerificationOtpRequest,
): Promise<IResendVerificationOtpResponse> {
    const response = await api.post<IResendVerificationOtpResponse>(
        "/auth/resend-verification-otp",
        payload,
    );
    return response.data;
}

export async function refreshTokenService(
    payload: IRefreshTokenRequest,
): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>("/auth/refresh", payload);
    return response.data;
}

export async function logoutAccountService(): Promise<void> {
    await api.post("/auth/logout");
}

export async function changePasswordService(
    payload: IChangePasswordRequest,
): Promise<void> {
    await api.post("/auth/change-password", payload);
}

export async function updateUserRoleService(
    payload: IUpdateUserRoleRequest,
    accessToken?: string,
): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>("/auth/role", payload, {
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined,
    });

    return response.data;
}

export async function createEmployerProfileService(
    payload: IEmployerCreateProfileRequest,
    accessToken?: string,
): Promise<void> {
    await api.post("/employer/create-profile", payload, {
        headers: accessToken
            ? {
                  Authorization: `Bearer ${accessToken}`,
              }
            : undefined,
    });
}
