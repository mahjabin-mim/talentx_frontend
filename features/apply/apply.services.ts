import api from "@/lib/axios";
import {
    ApplySubmissionResponse,
    ExtractResumeResponse,
    FormDataType,
} from "./apply.types";
const APPLICATIONS_ROUTE = "/applications";

export type TalentProfileMeResponse = {
    name: string;
    email: string;
    phoneNumber: string;
    resumeUrl: string;
    resumeFileName: string;
};

export const extractResumeData = async (
    resumeFile: File,
): Promise<ExtractResumeResponse> => {
    const payload = new FormData();
    payload.append("Resume", resumeFile);

    const response = await api.post<ExtractResumeResponse>(
        `${APPLICATIONS_ROUTE}/extract`,
        payload,
        {
            timeout: 120000,
        },
    );

    return response.data;
};

export const getTalentProfileMe =
    async (): Promise<TalentProfileMeResponse> => {
        const response =
            await api.get<TalentProfileMeResponse>("/talent-profile/me");
        return response.data;
    };

export const downloadMyResumeFile = async (
    fallbackFileName?: string,
): Promise<File> => {
    const response = await api.get<Blob>("/talent-profile/me/resume", {
        responseType: "blob",
    });

    const blob = response.data;
    const header = response.headers["content-disposition"] as
        | string
        | undefined;
    const match = header?.match(/filename\*?=(?:UTF-8'')?"?([^\";]+)"?/i);
    const decoded = match?.[1]
        ? decodeURIComponent(match[1].replace(/"/g, ""))
        : "";
    const fileName = decoded || fallbackFileName || "resume.pdf";

    return new File([blob], fileName, {
        type: blob.type || "application/pdf",
    });
};

export const extractProfileResumeData = async () => {
    const response = await api.get("/applications/extract-profile-resume");
    return response.data;
};

export const submitApplication = async (
    formData: FormDataType,
    resumeFile: File,
    jobId: string,
): Promise<ApplySubmissionResponse> => {
    const expectedSalary = Number(formData.ExpectedSalary);
    const experience = Number(formData.Experience);

    if (Number.isNaN(expectedSalary) || Number.isNaN(experience)) {
        throw new Error(
            "Expected salary and experience must be valid numbers.",
        );
    }

    const payload = new FormData();
    payload.append("JobId", jobId);
    payload.append("Name", formData.Name.trim());
    payload.append("Email", formData.Email.trim());
    payload.append("ContactNumber", formData.ContactNumber.trim());
    payload.append("Education", formData.Education.trim());
    payload.append("Department", formData.Department.trim());
    payload.append("CGPA", formData.CGPA.trim());
    payload.append("LinkedInUrl", formData.LinkedInUrl.trim());
    payload.append("AdditionalUrl", formData.AdditionalUrl.trim());
    payload.append("Location", formData.Location.trim());
    payload.append("CoverLetter", formData.CoverLetter.trim());
    payload.append("ExpectedSalary", expectedSalary.toString());
    payload.append("Experience", experience.toString());
    payload.append("Resume", resumeFile);

    const response = await api.post<ApplySubmissionResponse>(
        APPLICATIONS_ROUTE,
        payload,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 120000,
        },
    );

    return response.data;
};

type TalentDashboardApplicationsResponse = {
    applications?: Array<{
        jobLink?: string;
    }>;
    applicationsPagination?: {
        totalPages?: number;
    };
};

const extractJobIdFromLink = (jobLink: string): string | null => {
    const [, queryString = ""] = jobLink.split("?");
    const params = new URLSearchParams(queryString);
    const jobIdFromQuery = params.get("jobId");

    if (jobIdFromQuery) {
        return jobIdFromQuery;
    }

    const pathSegments = jobLink?.split("/").filter(Boolean);
    if (pathSegments?.[0] !== "jobs" || !pathSegments?.[1]) {
        return null;
    }

    return pathSegments[1];
};

export const hasAlreadyAppliedToJob = async (
    jobId: string,
): Promise<boolean> => {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const response = await api.get<TalentDashboardApplicationsResponse>(
            "/talent-dashboard/applications",
            {
                params: {
                    applicationsPage: page,
                    invitationsPage: 1,
                    pageSize: 5,
                },
            },
        );

        const applications = response.data.applications ?? [];
        const hasMatch = applications.some((application) => {
            if (!application.jobLink) {
                return false;
            }

            return extractJobIdFromLink(application.jobLink) === jobId;
        });

        if (hasMatch) {
            return true;
        }

        totalPages = Math.max(
            1,
            response.data.applicationsPagination?.totalPages ?? 1,
        );
        page += 1;
    }

    return false;
};
