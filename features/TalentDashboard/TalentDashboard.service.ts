import api from "@/lib/axios";
import { TalentAppliedJob, TalentInvitation } from "./TalentDashboard.types";

type GetTalentDashboardApplicationsResponse = {
    applications: TalentAppliedJob[];
    invitations: TalentInvitation[];
    applicationsPagination?: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
    invitationsPagination?: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
    summary?: {
        totalApplied: number;
        underReviewCount: number;
        interviewCount: number;
        totalInvitations: number;
        respondedCount: number;
        pendingCount: number;
    };
};

export type TalentDashboardData = {
    applications: TalentAppliedJob[];
    invitations: TalentInvitation[];
    applicationsPagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
    invitationsPagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
    summary: {
        totalApplied: number;
        underReviewCount: number;
        interviewCount: number;
        totalInvitations: number;
        respondedCount: number;
        pendingCount: number;
    };
};

type TalentDashboardPaginationParams = {
    applicationsPage?: number;
    invitationsPage?: number;
    pageSize?: number;
};

export const fetchTalentDashboardApplications = async (
    params: TalentDashboardPaginationParams = {},
): Promise<TalentDashboardData> => {
    const response = await api.get<GetTalentDashboardApplicationsResponse>(
        "/talent-dashboard/applications",
        { params },
    );

    return {
        applications: response.data.applications ?? [],
        invitations: response.data.invitations ?? [],
        applicationsPagination: {
            page: response.data.applicationsPagination?.page ?? 1,
            pageSize: response.data.applicationsPagination?.pageSize ?? 5,
            totalItems: response.data.applicationsPagination?.totalItems ?? 0,
            totalPages: response.data.applicationsPagination?.totalPages ?? 0,
        },
        invitationsPagination: {
            page: response.data.invitationsPagination?.page ?? 1,
            pageSize: response.data.invitationsPagination?.pageSize ?? 5,
            totalItems: response.data.invitationsPagination?.totalItems ?? 0,
            totalPages: response.data.invitationsPagination?.totalPages ?? 0,
        },
        summary: {
            totalApplied: response.data.summary?.totalApplied ?? 0,
            underReviewCount: response.data.summary?.underReviewCount ?? 0,
            interviewCount: response.data.summary?.interviewCount ?? 0,
            totalInvitations: response.data.summary?.totalInvitations ?? 0,
            respondedCount: response.data.summary?.respondedCount ?? 0,
            pendingCount: response.data.summary?.pendingCount ?? 0,
        },
    };
};
