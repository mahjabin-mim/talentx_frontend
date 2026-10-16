import {
    TalentApplicationStatus,
    TalentInvitationStatus,
} from "./TalentDashboard.enum";

export type TalentAppliedJob = {
    id: string;
    jobTitle: string;
    organization: string;
    status: TalentApplicationStatus;
    jobLink: string;
    appliedDate: string;
    salaryRange: string;
    location: string;
    aiScoring: number | null;
};

export type TalentInvitation = {
    id: string;
    jobTitle: string;
    organization: string;
    invitedAt: string;
    status: TalentInvitationStatus;
    jobLink: string;
    employmentType: string;
};

export const talentDashboardStatusOptions = [
    "All Status",
    TalentApplicationStatus.APPLIED,
    TalentApplicationStatus.SHORTLISTED,
    TalentApplicationStatus.INTERVIEW,
    TalentApplicationStatus.HIRED,
    TalentApplicationStatus.NOT_SELECTED,
] as const;

export const talentInvitationStatusOptions = [
    "All Invitations",
    TalentInvitationStatus.RESPONDED,
    TalentInvitationStatus.PENDING,
] as const;

export const talentApplicationStatusClassName: Record<
    TalentApplicationStatus,
    string
> = {
    [TalentApplicationStatus.APPLIED]:
        "border border-sky-200 bg-sky-50 text-sky-700",
    [TalentApplicationStatus.UNDER_REVIEW]:
        "border border-blue-200 bg-blue-50 text-blue-700",
    [TalentApplicationStatus.SHORTLISTED]:
        "border border-emerald-200 bg-emerald-50 text-emerald-700",
    [TalentApplicationStatus.INTERVIEW]:
        "border border-violet-200 bg-violet-50 text-violet-700",
    [TalentApplicationStatus.HIRED]:
        "border border-amber-200 bg-amber-50 text-amber-700",
    [TalentApplicationStatus.NOT_SELECTED]:
        "border border-rose-200 bg-rose-50 text-rose-700",
};

export const talentInvitationStatusClassName: Record<
    TalentInvitationStatus,
    string
> = {
    [TalentInvitationStatus.RESPONDED]:
        "border border-blue-200 bg-blue-50 text-blue-700",
    [TalentInvitationStatus.PENDING]:
        "border border-purple-200 bg-purple-50 text-purple-700",
};

export const getTalentDashboardStats = (jobs: TalentAppliedJob[]) => ({
    totalApplied: jobs.length,
    underReviewCount: jobs.filter(
        (job) =>
            job.status === TalentApplicationStatus.UNDER_REVIEW ||
            job.status === TalentApplicationStatus.SHORTLISTED,
    ).length,
    interviewCount: jobs.filter(
        (job) => job.status === TalentApplicationStatus.INTERVIEW,
    ).length,
});

export const getTalentInvitationStats = (invitations: TalentInvitation[]) => ({
    totalInvitations: invitations.length,
    respondedCount: invitations.filter(
        (invitation) => invitation.status === TalentInvitationStatus.RESPONDED,
    ).length,
    pendingCount: invitations.filter(
        (invitation) => invitation.status === TalentInvitationStatus.PENDING,
    ).length,
});
