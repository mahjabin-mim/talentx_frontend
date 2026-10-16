"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
    ArrowDown,
    BriefcaseBusiness,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Inbox,
    SearchX,
    Sparkles,
    Search,
    FileText,
    UsersRound,
    Briefcase,
} from "lucide-react";
import { useTalentDashboard } from "./TalentDashboard.hooks";
import {
    talentApplicationStatusClassName,
    talentDashboardStatusOptions,
    talentInvitationStatusClassName,
} from "./TalentDashboard.types";
import StatusFilter from "./TalentDashBoard.components/StatusFilter";
import PageLoader from "@/components/PageLoader/PageLoader";
import { Container } from "@/components/ui/container";
import { useAuthStore } from "@/features/Authentications/Authentications.hooks";

export const TalentDashboardView = () => {
    const invitationsSectionRef = useRef<HTMLElement | null>(null);
    const { fullName } = useAuthStore();
    const [appliedJobsPage, setAppliedJobsPage] = useState(1);
    const [invitationsPage, setInvitationsPage] = useState(1);
    const {
        appliedJobs,
        totalApplied,
        underReviewCount,
        interviewCount,
        invitations,
        applicationsPagination,
        invitationsPagination,
        isDashboardLoading,
        dashboardError,
    } = useTalentDashboard({
        applicationsPage: appliedJobsPage,
        invitationsPage,
    });
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<
        (typeof talentDashboardStatusOptions)[number]
    >(talentDashboardStatusOptions[0]);

    const formatDate = (value: string) =>
        format(parseISO(value), "MMM d, yyyy");

    const toJobDetailsPath = (jobLink: string) => {
        const [, queryString = ""] = jobLink.split("?");
        const params = new URLSearchParams(queryString);
        const jobIdFromQuery = params.get("jobId");

        if (jobIdFromQuery) {
            return `/jobs/${jobIdFromQuery}?from=dashboard`;
        }

        const pathSegments = jobLink.split("/").filter(Boolean);
        const jobIdFromPath = pathSegments[1];

        if (pathSegments[0] === "jobs" && jobIdFromPath) {
            return `/jobs/${jobIdFromPath}?from=dashboard`;
        }

        return jobLink;
    };

    const renderAiScore = (score: number | null) => {
        if (score === null || Number.isNaN(score)) {
            return (
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                    Analysing...
                </span>
            );
        }

        const badgeClassName =
            score < 50
                ? "border-rose-500/20 bg-rose-500/10 text-rose-600"
                : score < 80
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";

        return (
            <span
                className={`inline-flex min-w-[60px] items-center justify-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${badgeClassName}`}
            >
                {Math.round(score)}%
            </span>
        );
    };

    const normalizedSearch = search.trim().toLowerCase();
    const filteredJobs = useMemo(() => {
        return appliedJobs
            .filter((job) => {
                const matchesStatus =
                    selectedStatus === talentDashboardStatusOptions[0] ||
                    job.status === selectedStatus;

                if (!matchesStatus) {
                    return false;
                }

                if (!normalizedSearch) {
                    return true;
                }

                return [
                    job.jobTitle,
                    job.organization,
                    job.location,
                    job.salaryRange,
                    job.status,
                ].some((field) =>
                    field.toLowerCase().includes(normalizedSearch),
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.appliedDate).getTime() -
                    new Date(a.appliedDate).getTime(),
            );
    }, [appliedJobs, normalizedSearch, selectedStatus]);

    useEffect(() => {
        setAppliedJobsPage(1);
    }, [search, selectedStatus]);

    const totalAppliedJobsPages = Math.max(
        1,
        applicationsPagination.totalPages,
    );

    const filteredInvitations = invitations;
    const totalInvitationPages = Math.max(1, invitationsPagination.totalPages);

    if (isDashboardLoading) {
        return <PageLoader message="Synchronizing your talent profile..." />;
    }

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="pb-20 pt-16">
                {/* WELCOME HEADER */}
                <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="animate-in slide-in-from-left duration-700">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1">
                            <Sparkles
                                size={14}
                                className="text-brand-primary"
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                Talent Discovery Dashboard
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                            Welcome back,{" "}
                            <span className="text-gradient">
                                {fullName?.split(" ")[0] || "Talent"}
                            </span>
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Track your applications, manage invitations, and
                            discover your next major milestone.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            invitationsSectionRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                        }
                        className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white border-2 border-brand-primary/10 px-8 text-base font-bold text-brand-primary transition-all hover:scale-[1.02] hover:border-brand-primary/30 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                    >
                        View Invitations <ArrowDown size={18} />
                    </button>
                </header>

                {dashboardError && (
                    <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800 animate-in shake-1">
                        {dashboardError}
                    </div>
                )}

                {/* STATS GRID */}
                <section className="mb-16 rounded-[2rem] border border-border/60 bg-white p-5 shadow-md md:p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            {
                                title: "Jobs Applied",
                                value: totalApplied,
                                tone: "blue",
                                icon: <Briefcase size={20} />,
                            },
                            {
                                title: "Under Review",
                                value: underReviewCount,
                                tone: "green",
                                icon: <FileText size={20} />,
                            },
                            {
                                title: "Interviews",
                                value: interviewCount,
                                tone: "purple",
                                icon: <UsersRound size={20} />,
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className={`group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-lg ${
                                    stat.tone === "blue"
                                        ? "border-blue-200 bg-blue-50/80"
                                        : stat.tone === "green"
                                          ? "border-emerald-200 bg-emerald-50/80"
                                          : "border-purple-200 bg-purple-50/80"
                                }`}
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div
                                        className={`flex h-16 w-16 items-center justify-center rounded-full border ${
                                            stat.tone === "blue"
                                                ? "border-blue-200 bg-blue-100/70 text-blue-700"
                                                : stat.tone === "green"
                                                  ? "border-emerald-200 bg-emerald-100/70 text-emerald-700"
                                                  : "border-purple-200 bg-purple-100/70 text-purple-700"
                                        }`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span
                                            className={`text-[10px] font-black uppercase tracking-widest ${
                                                stat.tone === "blue"
                                                    ? "text-blue-700/80"
                                                    : stat.tone === "green"
                                                      ? "text-emerald-700/80"
                                                      : "text-purple-700/80"
                                            }`}
                                        >
                                            {stat.title}
                                        </span>
                                        <span
                                            className={`text-3xl font-black tracking-tight ${
                                                stat.tone === "blue"
                                                    ? "text-blue-700"
                                                    : stat.tone === "green"
                                                      ? "text-emerald-700"
                                                      : "text-purple-700"
                                            }`}
                                        >
                                            {stat.value}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* APPLIED JOBS SECTION */}
                <section className="mb-20">
                    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                                <BriefcaseBusiness
                                    size={24}
                                    className="text-brand-primary"
                                />
                                Applied{" "}
                                <span className="text-gradient">Jobs</span>
                            </h2>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                Monitor the status of your recent applications.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative group">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-primary transition-colors"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search applications..."
                                    className="h-11 w-full md:w-[320px] rounded-xl border border-border bg-white pl-10 pr-4 text-sm font-bold outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                />
                            </div>
                            <StatusFilter
                                options={talentDashboardStatusOptions}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                            />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white/60 shadow-xl backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
                                            Job & Organization
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-center">
                                            Applied Date
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-center">
                                            Location
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-center">
                                            Status
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-center">
                                            AI Match
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredJobs.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-20 text-center"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
                                                        <Search size={32} />
                                                    </div>
                                                    <h4 className="text-lg font-black text-foreground">
                                                        No applications found
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Your search didn&apos;t
                                                        return any results.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredJobs.map((job) => (
                                            <tr
                                                key={job.id}
                                                className="group hover:bg-brand-primary/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-black text-foreground">
                                                            {job.jobTitle}
                                                        </span>
                                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                            {job.organization}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center text-sm font-bold text-foreground">
                                                    {formatDate(
                                                        job.appliedDate,
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-center text-sm font-bold text-muted-foreground">
                                                    {job.location}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${talentApplicationStatusClassName[job.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                                                    >
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    {renderAiScore(
                                                        job.aiScoring,
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link
                                                        href={toJobDetailsPath(
                                                            job.jobLink,
                                                        )}
                                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all"
                                                    >
                                                        <ExternalLink
                                                            size={14}
                                                        />{" "}
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredJobs.length > 0 &&
                            totalAppliedJobsPages > 1 && (
                                <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        Page{" "}
                                        <span className="text-foreground">
                                            {appliedJobsPage}
                                        </span>{" "}
                                        of {totalAppliedJobsPages}
                                    </span>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                setAppliedJobsPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={appliedJobsPage === 1}
                                            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-4 text-xs font-black transition-all hover:bg-muted disabled:opacity-50"
                                        >
                                            <ChevronLeft size={14} /> Previous
                                        </button>
                                        <button
                                            onClick={() =>
                                                setAppliedJobsPage((p) =>
                                                    Math.min(
                                                        totalAppliedJobsPages,
                                                        p + 1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                appliedJobsPage ===
                                                totalAppliedJobsPages
                                            }
                                            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-4 text-xs font-black transition-all hover:bg-muted disabled:opacity-50"
                                        >
                                            Next <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                </section>

                {/* INVITATIONS SECTION */}
                <section ref={invitationsSectionRef}>
                    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                                <Inbox
                                    size={24}
                                    className="text-brand-primary"
                                />
                                Exclusive{" "}
                                <span className="text-gradient">
                                    Invitations
                                </span>
                            </h2>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                High-value opportunities hand-picked for your
                                profile.
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white/60 shadow-xl backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
                                            Opportunity
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-center">
                                            Invited On
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-center">
                                            Status
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredInvitations.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-20 text-center"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
                                                        <Inbox size={32} />
                                                    </div>
                                                    <h4 className="text-lg font-black text-foreground">
                                                        No invitations yet
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        Exclusive invites will
                                                        appear here.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredInvitations.map(
                                            (invitation) => (
                                                <tr
                                                    key={invitation.id}
                                                    className="group hover:bg-brand-primary/[0.02] transition-colors"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-base font-black text-foreground">
                                                                {
                                                                    invitation.jobTitle
                                                                }
                                                            </span>
                                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                                {
                                                                    invitation.organization
                                                                }{" "}
                                                                •{" "}
                                                                {
                                                                    invitation.employmentType
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center text-sm font-bold text-foreground">
                                                        {formatDate(
                                                            invitation.invitedAt,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <span
                                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${talentInvitationStatusClassName[invitation.status]}`}
                                                        >
                                                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                                                            {invitation.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <Link
                                                            href={toJobDetailsPath(
                                                                invitation.jobLink,
                                                            )}
                                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-brand-hover hover:shadow-lg transition-all"
                                                        >
                                                            <ExternalLink
                                                                size={14}
                                                            />{" "}
                                                            View Invite
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredInvitations.length > 0 &&
                            totalInvitationPages > 1 && (
                                <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        Page{" "}
                                        <span className="text-foreground">
                                            {invitationsPage}
                                        </span>{" "}
                                        of {totalInvitationPages}
                                    </span>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                setInvitationsPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={invitationsPage === 1}
                                            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-4 text-xs font-black transition-all hover:bg-muted disabled:opacity-50"
                                        >
                                            <ChevronLeft size={14} /> Previous
                                        </button>
                                        <button
                                            onClick={() =>
                                                setInvitationsPage((p) =>
                                                    Math.min(
                                                        totalInvitationPages,
                                                        p + 1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                invitationsPage ===
                                                totalInvitationPages
                                            }
                                            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-4 text-xs font-black transition-all hover:bg-muted disabled:opacity-50"
                                        >
                                            Next <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>
                </section>
            </Container>
        </div>
    );
};
