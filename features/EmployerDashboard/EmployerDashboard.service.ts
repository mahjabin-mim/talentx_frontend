import api from "@/lib/axios";
import { ApplicantsApiResponse } from "./EmployerDashboard.interface";

export const getJobApplicantsService = async (
    jobId: string,
    params?: { page?: number; searchTerm?: string; status?: string },
) => {
    const response = await api.get<ApplicantsApiResponse>(
        `/jobs/${jobId}/applicants`,
        { params },
    );
    return response.data;
};

export const getApplicantResumeService = async (applicationId: string) => {
    // We specify responseType: 'blob' to handle raw binary data (PDF)
    const response = await api.get(`/jobs/applicants/${applicationId}/resume`, {
        responseType: "blob",
    });
    return response.data; // This will be a Blob object
};

export const updateApplicantStatusService = async (
    applicationId: string,
    status: string,
) => {
    const response = await api.patch(
        `/jobs/applicants/${applicationId}/status`,
        { status },
    );
    return response.data;
};
