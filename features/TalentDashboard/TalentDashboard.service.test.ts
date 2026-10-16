import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    TalentApplicationStatus,
    TalentInvitationStatus,
} from "./TalentDashboard.enum";

const getMock = vi.fn();

vi.mock("@/lib/axios", () => ({
    default: {
        get: getMock,
    },
}));

describe("TalentDashboard.service", () => {
    beforeEach(() => {
        getMock.mockReset();
    });

    it("fetches talent dashboard applications from backend", async () => {
        getMock.mockResolvedValueOnce({
            data: {
                applications: [
                    {
                        id: "3a76b711-9aa8-4d1a-9809-6e7278d43442",
                        jobTitle: "Frontend Developer",
                        organization: "TechNova Ltd.",
                        status: TalentApplicationStatus.APPLIED,
                        jobLink:
                            "/jobs?jobId=045f9d16-95ca-4b52-8c07-a09f03215b34",
                        appliedDate: "2026-04-28T09:30:00Z",
                        salaryRange: "BDT 40000 - 60000",
                        location: "Dhaka, BD",
                    },
                ],
                invitations: [
                    {
                        id: "aa82ec9c-a6ee-4856-82c4-f89a73eab7b8",
                        jobTitle: "Backend Engineer",
                        organization: "Nova Labs",
                        invitedAt: "2026-05-01T10:00:00Z",
                        status: TalentInvitationStatus.PENDING,
                        jobLink:
                            "/jobs?jobId=ecb9582a-45c6-48f9-9c88-87eb02c9ed2c",
                        employmentType: "Full Time",
                    },
                ],
                applicationsPagination: {
                    page: 1,
                    pageSize: 5,
                    totalItems: 1,
                    totalPages: 1,
                },
                invitationsPagination: {
                    page: 1,
                    pageSize: 5,
                    totalItems: 1,
                    totalPages: 1,
                },
                summary: {
                    totalApplied: 1,
                    underReviewCount: 0,
                    interviewCount: 0,
                    totalInvitations: 1,
                    respondedCount: 0,
                    pendingCount: 1,
                },
            },
        });

        const { fetchTalentDashboardApplications } =
            await import("./TalentDashboard.service");

        const result = await fetchTalentDashboardApplications({
            applicationsPage: 1,
            invitationsPage: 1,
            pageSize: 5,
        });

        expect(getMock).toHaveBeenCalledWith("/talent-dashboard/applications", {
            params: { applicationsPage: 1, invitationsPage: 1, pageSize: 5 },
        });
        expect(result.applications).toHaveLength(1);
        expect(result.applications[0].jobTitle).toBe("Frontend Developer");
        expect(result.invitations).toHaveLength(1);
        expect(result.invitations[0].jobTitle).toBe("Backend Engineer");
        expect(result.applicationsPagination.totalPages).toBe(1);
        expect(result.invitationsPagination.totalPages).toBe(1);
    });

    it("returns empty collections when response has no dashboard data", async () => {
        getMock.mockResolvedValueOnce({
            data: {},
        });

        const { fetchTalentDashboardApplications } =
            await import("./TalentDashboard.service");

        const result = await fetchTalentDashboardApplications();

        expect(result).toEqual({
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
        });
    });
});
