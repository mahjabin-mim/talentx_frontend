import { UserRole } from "./Authentications.enum";
import { JwtToken } from "./Authentications.type";

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRefreshTokenRequest {
    userId: string;
    refreshToken: string;
}

export interface IChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface IEmployerCreateProfileRequest {
    fullname: string;
    companyName: string;
}

export interface IUpdateUserRoleRequest {
    userRole: UserRole;
    fullname?: string;
    companyName?: string;
}

export interface IRegisterRequest {
    email: string;
    password: string;
    fullname?: string;
    companyName?: string;
    phoneNumber?: string;
    userRole?: UserRole;
}

export interface IRegisterResponse {
    message: string;
    requiresVerification?: boolean;
    nextAction?: string;
    verificationCodeExpiresAtUtc?: string;
}

export interface IVerifyEmailRequest {
    email: string;
    otpCode: string;
}

export interface IVerifyEmailResponse {
    message: string;
}

export interface IResendVerificationOtpRequest {
    email: string;
}

export interface IResendVerificationOtpResponse {
    message: string;
}

export interface IAuthResponse {
    id: string;
    fullname?: string;
    email: string;
    phoneNumber?: string;
    userRole?: UserRole;
    accessToken: JwtToken;
    refreshToken: string;
    refreshTokenExpiryTime: string;
    message: string;
}

export interface ICandidateOnboarding {
    role: UserRole.TALENT;
    name: string;
}

export interface IEmployerOnboarding {
    role: UserRole.EMPLOYER;
    name: string;
    companyName: string;
}

export type IOnboardingPayload = ICandidateOnboarding | IEmployerOnboarding;
