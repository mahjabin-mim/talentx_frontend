"use client";

import { useParams } from "next/navigation";
import { useJobApplicants } from "@/features/EmployerDashboard/EmployerDashboard.hooks";
import JobApplicantsView from "@/features/EmployerDashboard/EmployerDashboard.Components/JobApplicantsView";

export default function JobApplicantsPage() {
    const params = useParams();
    const jobId = params.jobId as string;
    const {
        applicants,
        loading,
        error,
        hasFetchedOnce,
        page,
        setPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        updateApplicantStatus,
        isUpdatingStatus,
    } = useJobApplicants(jobId);

    return (
        <JobApplicantsView
            applicants={applicants}
            loading={loading}
            error={error}
            hasFetchedOnce={hasFetchedOnce}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            updateApplicantStatus={updateApplicantStatus}
            isUpdatingStatus={isUpdatingStatus}
        />
    );
}
