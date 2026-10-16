import api from "@/lib/axios";
import type {
    ICreateJobRequest,
    ICreateJobResponse,
    IEmployerDashboardResponse,
    IGenerateJobDescriptionRequest,
    IGenerateJobDescriptionResponse,
    IJobDetailsResponse,
} from "./Jobs.type";
import type { JobStatusActionValue } from "./Jobs.type";

export async function generateJobDescriptionService(
    payload: IGenerateJobDescriptionRequest,
): Promise<IGenerateJobDescriptionResponse> {
    const response = await api.post<IGenerateJobDescriptionResponse>(
        "/jobs/generate",
        payload,
        {
            timeout: 120000,
        },
    );
    return response.data;
}

export async function createJobService(
    payload: ICreateJobRequest,
): Promise<ICreateJobResponse> {
    const response = await api.post<ICreateJobResponse>(
        "/jobs/create",
        payload,
        {
            timeout: 120000,
        },
    );
    return response.data;
}

export const updateJobService = async (jobId: string, payload: ICreateJobRequest): Promise<ICreateJobResponse> => {
    const response = await api.put(`/jobs/${jobId}`, payload);
    return response.data;
};

export async function getEmployerDashboardService(params?: {
    page?: number;
    searchTerm?: string;
    statusFilter?: string;
}): Promise<IEmployerDashboardResponse> {
    const response = await api.get<IEmployerDashboardResponse>(
        "/jobs/dashboard",
        { params },
    );
    return response.data;
}

export async function getJobByIdService(
    jobId: string,
): Promise<IJobDetailsResponse> {
    const response = await api.get<IJobDetailsResponse>(`/jobs/${jobId}`);
    return response.data;
}

export async function updateJobStatusService(
    jobId: string,
    action: JobStatusActionValue,
): Promise<void> {
    await api.patch(`/jobs/${jobId}/status`, { action });
}

export async function deleteJobService(jobId: string): Promise<void> {
    await api.delete(`/jobs/${jobId}`);
}
