import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface JobDescriptionDraftState {
    description: string;
    setDescription: (value: string) => void;
    hydrate: (payload: {
        description?: string;
    }) => void;
    reset: () => void;
}

const initialState = {
    description: "",
};

export const useJobDescriptionDraftStore = create<JobDescriptionDraftState>()(
    persist(
        (set) => ({
            ...initialState,
            setDescription: (value) => set({ description: value }),
            hydrate: (payload) =>
                set({
                    description: payload.description ?? "",
                }),
            reset: () => set(initialState),
        }),
        {
            name: "talentx-job-description-draft",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
