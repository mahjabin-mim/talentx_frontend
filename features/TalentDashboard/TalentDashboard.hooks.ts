import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { extractApiError } from "../Authentications/Authentications.helper";
import { UserRole } from "../Authentications/Authentications.enum";
import { useAuthStore } from "../Authentications/Authentications.hooks";
import { fetchTalentDashboardApplications } from "./TalentDashboard.service";

const talentDashboardApplicationsQueryKey = [
    "talent-dashboard",
    "applications",
] as const;

type UseTalentDashboardParams = {
    applicationsPage: number;
    invitationsPage: number;
};

export const useTalentDashboard = ({
    applicationsPage,
    invitationsPage,
}: UseTalentDashboardParams) => {
    const router = useRouter();
    const { token, userRole } = useAuthStore();
    const hasTalentRole = userRole === UserRole.TALENT;

    const applicationsQuery = useQuery({
        queryKey: [
            ...talentDashboardApplicationsQueryKey,
            applicationsPage,
            invitationsPage,
        ],
        queryFn: () =>
            fetchTalentDashboardApplications({
                applicationsPage,
                invitationsPage,
                pageSize: 5,
            }),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
        enabled: Boolean(token) && hasTalentRole,
    });

    const {
        applications: appliedJobs,
        invitations,
        applicationsPagination,
        invitationsPagination,
        summary,
    } = applicationsQuery.data ?? {
        applications: [],
        invitations: [],
        applicationsPagination: {
            page: 1,
            pageSize: 5,
            totalItems: 0,
            totalPages: 0,
        },
        invitationsPagination: {
            page: 1,
            pageSize: 5,
            totalItems: 0,
            totalPages: 0,
        },
        summary: {
            totalApplied: 0,
            underReviewCount: 0,
            interviewCount: 0,
            totalInvitations: 0,
            respondedCount: 0,
            pendingCount: 0,
        },
    };

    return {
        appliedJobs,
        invitations,
        applicationsPagination,
        invitationsPagination,
        totalApplied: summary.totalApplied,
        underReviewCount: summary.underReviewCount,
        interviewCount: summary.interviewCount,
        totalInvitations: summary.totalInvitations,
        respondedCount: summary.respondedCount,
        pendingCount: summary.pendingCount,
        isDashboardLoading:
            !applicationsQuery.data &&
            (applicationsQuery.isPending || applicationsQuery.isFetching),
        dashboardError: applicationsQuery.isError
            ? extractApiError(
                  applicationsQuery.error,
                  "Failed to load your dashboard data.",
              )
            : null,
    };
};
