import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useMutation } from "@tanstack/react-query";
import {
    loginAccountService,
    registerAccountService,
} from "./Authentications.service";
import {
    IAuthResponse,
    ILoginCredentials,
    IRegisterRequest,
} from "./Authentications.interface";
import { UserRole } from "./Authentications.enum";
import { JwtToken } from "./Authentications.type";

// --- ZUSTAND STORE ---
interface AuthState {
    step: number;
    email: string | null;
    fullName: string | null;
    companyName: string | null;
    phoneNumber: string | null;
    token: JwtToken | null;
    refreshToken: string | null;
    userId: string | null;
    userRole: UserRole | null;
    hydrated: boolean;
    setStep: (step: number) => void;
    setCredentials: (data: { email: string }) => void;
    setProfileData: (data: { fullName: string; companyName?: string }) => void;
    setAuthTokens: (data: IAuthResponse) => void;
    setUserRole: (role: UserRole) => void;
    setHydrated: () => void;
    reset: () => void;
}

const initialState = {
    step: 1,
    email: null,
    fullName: null,
    companyName: null,
    phoneNumber: null,
    token: null,
    refreshToken: null,
    userId: null,
    userRole: null,
    hydrated: false,
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            ...initialState,
            setStep: (step) => set({ step }),
            setCredentials: (data) => set({ email: data.email }),
            setProfileData: (data) =>
                set({
                    fullName: data.fullName,
                    companyName: data.companyName ?? null,
                }),
            setAuthTokens: (data) =>
                set({
                    token: data.accessToken,
                    refreshToken: data.refreshToken,
                    userId: data.id,
                    email: data.email,
                    fullName: data.fullname ?? null,
                    phoneNumber: data.phoneNumber ?? null,
                    userRole: data.userRole ?? null,
                }),
            setUserRole: (role) => set({ userRole: role }),
            setHydrated: () => set({ hydrated: true }),
            reset: () => set({ ...initialState, hydrated: true }),
        }),
        {
            name: "talentx-auth-flow",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: (state) => {
                return () => state?.setHydrated?.();
            },
            partialize: (state) => ({
                step: state.step,
                email: state.email,
                fullName: state.fullName,
                companyName: state.companyName,
                phoneNumber: state.phoneNumber,
                token: state.token,
                refreshToken: state.refreshToken,
                userId: state.userId,
                userRole: state.userRole,
            }),
        },
    ),
);

// --- TANSTACK QUERIES ---
export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: async (credentials: IRegisterRequest) => {
            return await registerAccountService(credentials);
        },
    });
};

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: async (credentials: ILoginCredentials) => {
            return await loginAccountService(credentials);
        },
    });
};
