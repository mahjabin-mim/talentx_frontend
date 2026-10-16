import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { extractApiError } from "@/features/Authentications/Authentications.helper";
import { useAuthStore } from "../Authentications/Authentications.hooks";
import { UserRole } from "../Authentications/Authentications.enum";
import {
    deleteJobService,
    getEmployerDashboardService,
    updateJobStatusService,
} from "../Jobs/Jobs.service";
import type {
    IEmployerDashboardJob,
    IEmployerDashboardResponse,
} from "../Jobs/Jobs.type";
import {
    Applicant,
} from "./EmployerDashboard.interface";
import {
    getJobApplicantsService,
    updateApplicantStatusService,
} from "./EmployerDashboard.service";
import { isJobStatus, toJobRow } from "./EmployerDashboard.helper";
import type { JobRow, JobStatus } from "./EmployerDashboard.type";
import { useDebounce } from "@/hooks/use-debounce";

export const useEmployerDashboard = () => {
    const router = useRouter();
    const { token, userRole, reset, hydrated } = useAuthStore();
    const hasEmployerRole = userRole === UserRole.EMPLOYER;

    const [dashboard, setDashboard] =
        useState<IEmployerDashboardResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
    const [isMutatingJob, setIsMutatingJob] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<
        "toggle" | "delete" | null
    >(null);
    const [jobsError, setJobsError] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<JobRow | null>(null);

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | JobStatus>("All");

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const handleUnauthorized = useCallback(async () => {
        reset();
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("talentx-auth-flow");
        }
        router.replace("/");
    }, [reset, router]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, statusFilter]);

    const loadDashboard = useCallback(() => {
        setLoading(true);
        setJobsError(null);

        return getEmployerDashboardService({
            page,
            searchTerm: debouncedSearchTerm.trim() || undefined,
            statusFilter: statusFilter === "All" ? undefined : statusFilter,
        })
            .then((response) => {
                setDashboard(response);
            })
            .catch((error) => {
                if (isAxiosError(error) && error.response?.status === 401) {
                    void handleUnauthorized();
                    return;
                }

                setJobsError(
                    extractApiError(
                        error,
                        "Failed to load dashboard jobs. Please try again.",
                    ),
                );
                setDashboard({
                    jobsPosted: 0,
                    activeJobs: 0,
                    closedJobs: 0,
                    totalHires: 0,
                    availableStatuses: [],
                    jobs: [],
                    currentPage: 1,
                    totalPages: 1,
                });
            })
            .finally(() => {
                setLoading(false);
                setHasFetchedOnce(true);
            });
    }, [handleUnauthorized, page, debouncedSearchTerm, statusFilter]);

    useEffect(() => {
        if (!token || !hasEmployerRole) return;
        void loadDashboard();
    }, [token, hasEmployerRole, loadDashboard]);

    const displayJobs = useMemo(() => {
        return (dashboard?.jobs ?? []).map(toJobRow);
    }, [dashboard]);

    const statusOptions = useMemo<("All" | JobStatus)[]>(() => {
        const backendStatuses = (dashboard?.availableStatuses ?? []).filter(
            isJobStatus,
        );
        return ["All", ...backendStatuses];
    }, [dashboard]);

    const applyLocalJobsUpdate = (nextJobs: IEmployerDashboardJob[]) => {
        setDashboard((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                jobs: nextJobs,
            };
        });
    };

    const toggleStatus = (job: JobRow) => {
        const canToggle =
            job.status === "Active" || job.status === "Deactivated";
        if (!canToggle) return Promise.resolve();

        setIsMutatingJob(job.jobId);
        setPendingAction("toggle");
        setJobsError(null);

        const targetStatus: JobStatus =
            job.status === "Active" ? "Deactivated" : "Active";
        return updateJobStatusService(
            job.jobId,
            job.status === "Active" ? "Deactivate" : "Activate",
        )
            .then(() => {
                const nextJobs = (dashboard?.jobs ?? []).map((item) =>
                    item.jobId === job.jobId
                        ? { ...item, status: targetStatus }
                        : item,
                );
                applyLocalJobsUpdate(nextJobs);

                void loadDashboard();
            })
            .catch((error) => {
                if (isAxiosError(error) && error.response?.status === 401) {
                    void handleUnauthorized();
                    return;
                }
                setJobsError(
                    extractApiError(error, "Failed to update job status."),
                );
            })
            .finally(() => {
                setPendingAction(null);
                setIsMutatingJob(null);
            });
    };

    const deleteJob = (job: JobRow) => {
        setIsMutatingJob(job.jobId);
        setPendingAction("delete");
        setJobsError(null);

        return deleteJobService(job.jobId)
            .then(() => {
                setDeleteTarget(null);

                const nextJobs = (dashboard?.jobs ?? []).filter(
                    (item) => item.jobId !== job.jobId,
                );
                applyLocalJobsUpdate(nextJobs);

                void loadDashboard();
            })
            .catch((error) => {
                if (isAxiosError(error) && error.response?.status === 401) {
                    void handleUnauthorized();
                    return;
                }
                setJobsError(extractApiError(error, "Failed to delete job."));
            })
            .finally(() => {
                setPendingAction(null);
                setIsMutatingJob(null);
            });
    };

    return {
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
    };
};

export const useJobApplicants = (jobId: string) => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(
        null,
    );

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, statusFilter]);

    const fetchApplicants = useCallback(() => {
        setLoading(true);
        setError(null);
        return getJobApplicantsService(jobId, {
            page,
            searchTerm: debouncedSearchTerm.trim() || undefined,
            status: statusFilter || undefined,
        })
            .then((response) => {
                setApplicants(response.applicants);
                setTotalPages(response.totalPages);
            })
            .catch((error) => {
                if (isAxiosError(error) && error.response?.status === 401) {
                }
                setError(
                    extractApiError(
                        error,
                        "Failed to fetch applicants. Please try again.",
                    ),
                );
            })
            .finally(() => {
                setLoading(false);
                setHasFetchedOnce(true);
            });
    }, [jobId, page, debouncedSearchTerm, statusFilter]);

    useEffect(() => {
        if (!jobId) {
            setLoading(false);
            return;
        }

        void fetchApplicants();
    }, [jobId, fetchApplicants]);

    const updateApplicantStatus = (
        applicationId: string,
        newStatus: string,
    ) => {
        setIsUpdatingStatus(applicationId);
        return updateApplicantStatusService(applicationId, newStatus)
            .then(() => {
                setApplicants((prev) =>
                    prev.map((app) =>
                        app.applicationId === applicationId
                            ? { ...app, status: newStatus }
                            : app,
                    ),
                );
            })
            .catch((error) => {
                setError(
                    extractApiError(error, "Failed to update applicant status."),
                );
            })
            .finally(() => {
                setIsUpdatingStatus(null);
            });
    };

    return {
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
    };
};
