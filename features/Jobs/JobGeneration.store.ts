import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { IGenerateJobDescriptionRequest } from "./Jobs.type";

type JobGenerationState = {
    request: IGenerateJobDescriptionRequest | null;
    setRequest: (payload: IGenerateJobDescriptionRequest) => void;
    clearRequest: () => void;
};

const initialState: Pick<JobGenerationState, "request"> = {
    request: null,
};

export const useJobGenerationStore = create<JobGenerationState>()(
    persist(
        (set) => ({
            ...initialState,
            setRequest: (payload) => set({ request: payload }),
            clearRequest: () => set(initialState),
        }),
        {
            name: "talentx.jobGeneration.request",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ request: state.request }),
        },
    ),
);

export function saveJobGenerationRequest(
    payload: IGenerateJobDescriptionRequest,
): void {
    if (typeof window === "undefined") return;
    useJobGenerationStore.getState().setRequest(payload);
}

export function getJobGenerationRequest(): IGenerateJobDescriptionRequest | null {
    if (typeof window === "undefined") return null;

    return useJobGenerationStore.getState().request;
}

export function clearJobGenerationState(): void {
    if (typeof window === "undefined") return;
    useJobGenerationStore.getState().clearRequest();
}
