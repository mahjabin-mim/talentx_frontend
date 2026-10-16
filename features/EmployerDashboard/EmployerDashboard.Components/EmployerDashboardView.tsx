"use client";

import { useState } from "react";
import { useEmployerDashboard } from "../EmployerDashboard.hooks";
import { StatCard } from "./StatCard";
import { JobsTable } from "./JobsTable";
import { DeleteJobModal } from "./DeleteJobModal";
import { ShareJobModal } from "./ShareJobModal";
import type { JobRow, JobStatus } from "../EmployerDashboard.type";
import { Plus, Sparkles } from "lucide-react";
import { useAuthStore } from "@/features/Authentications/Authentications.hooks";
import { Container } from "@/components/ui/container";

export const EmployerDashboardView = () => {
    const [shareTarget, setShareTarget] = useState<JobRow | null>(null);
    const { fullName, companyName } = useAuthStore();

    const {
        dashboard,
        loading,
        hasFetchedOnce,
        isMutatingJob,
        pendingAction,
        jobsError,
        deleteTarget,
        searchTerm,
        statusFilter,
        page,
        displayJobs,
        statusOptions,
        setSearchTerm,
        setStatusFilter,
        setPage,
        setDeleteTarget,
        toggleStatus,
        deleteJob,
        router,
    } = useEmployerDashboard();

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="pb-20 pt-16">
                
                {/* WELCOME HEADER */}
                <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1">
                            <Sparkles size={14} className="text-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                Employer Command Center
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                            Welcome back, <span className="text-gradient">{fullName?.split(' ')[0] || 'Partner'}</span>
                            {companyName && (
                                <span className="text-muted-foreground/40 font-medium ml-2 text-3xl md:text-4xl tracking-tighter italic">
                                    @ {companyName}
                                </span>
                            )}
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Here&apos;s an overview of your active hiring campaigns and talent pipeline.
                        </p>
                    </div>
                </header>

                {/* STATS GRID */}
                <section className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Jobs Posted"
                        value={dashboard?.jobsPosted ?? 0}
                        tone="blue"
                    />
                    <StatCard
                        title="Active Jobs"
                        value={dashboard?.activeJobs ?? 0}
                        tone="green"
                    />
                    <StatCard
                        title="Closed Jobs"
                        value={dashboard?.closedJobs ?? 0}
                        tone="gray"
                    />
                    <StatCard
                        title="Total Hires"
                        value={dashboard?.totalHires ?? 0}
                        tone="purple"
                    />
                </section>

                {/* MAIN CONTENT AREA */}
                <JobsTable
                    searchTerm={searchTerm}
                    setSearchTerm={(term: string) => {
                        setSearchTerm(term);
                        setPage(1);
                    }}
                    statusFilter={statusFilter}
                    setStatusFilter={(filter: "All" | JobStatus) => {
                        setStatusFilter(filter);
                        setPage(1);
                    }}
                    page={page}
                    setPage={setPage}
                    totalPages={dashboard?.totalPages ?? 1}
                    statusOptions={statusOptions}
                    jobsError={jobsError}
                    loading={loading}
                    hasFetchedOnce={hasFetchedOnce}
                    displayJobs={displayJobs}
                    isMutatingJob={isMutatingJob}
                    pendingAction={pendingAction}
                    toggleStatus={toggleStatus}
                    setDeleteTarget={setDeleteTarget}
                    setShareTarget={setShareTarget}
                    router={router}
                />
            </Container>

            {deleteTarget && (
                <DeleteJobModal
                    deleteTarget={deleteTarget}
                    setDeleteTarget={setDeleteTarget}
                    deleteJob={deleteJob}
                    isMutatingJob={isMutatingJob}
                />
            )}

            {shareTarget && (
                <ShareJobModal
                    shareTarget={shareTarget}
                    setShareTarget={setShareTarget}
                />
            )}
        </div>
    );
};
