import { useMutation } from "@tanstack/react-query";
import {
    createJobService,
    deleteJobService,
    generateJobDescriptionService,
    updateJobStatusService,
} from "./Jobs.service";
import type {
    ICreateJobRequest,
    IGenerateJobDescriptionRequest,
} from "./Jobs.type";
import type { JobStatusActionValue } from "./Jobs.type";

export const useGenerateJobDescriptionMutation = () => {
    return useMutation({
        mutationFn: async (payload: IGenerateJobDescriptionRequest) => {
            return await generateJobDescriptionService(payload);
        },
    });
};

export const useCreateJobMutation = () => {
    return useMutation({
        mutationFn: async (payload: ICreateJobRequest) => {
            return await createJobService(payload);
        },
    });
};

export const useUpdateJobStatusMutation = () => {
    return useMutation({
        mutationFn: async (payload: {
            jobId: string;
            action: JobStatusActionValue;
        }) => {
            await updateJobStatusService(payload.jobId, payload.action);
        },
    });
};

export const useDeleteJobMutation = () => {
    return useMutation({
        mutationFn: async (jobId: string) => {
            await deleteJobService(jobId);
        },
    });
};
