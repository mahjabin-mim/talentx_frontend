import type { JobRow, JobStatus } from "./EmployerDashboard.type";

export interface JobsTableProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: "All" | JobStatus;
    setStatusFilter: (filter: "All" | JobStatus) => void;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    statusOptions: ("All" | JobStatus)[];
    jobsError: string | null;
    loading: boolean;
    hasFetchedOnce: boolean;
    displayJobs: JobRow[];
    isMutatingJob: string | null;
    pendingAction: "toggle" | "delete" | null;
    toggleStatus: (job: JobRow) => Promise<void>;
    setDeleteTarget: (job: JobRow | null) => void;
    setShareTarget: (job: JobRow | null) => void;
    router: { push: (url: string) => void };
}

export interface DeleteJobModalProps {
    deleteTarget: JobRow;
    setDeleteTarget: (target: JobRow | null) => void;
    deleteJob: (job: JobRow) => Promise<void>;
    isMutatingJob: string | null;
}

export interface ShareJobModalProps {
    shareTarget: JobRow;
    setShareTarget: (target: JobRow | null) => void;
}

export interface Applicant {
    applicationId: string;
    talentId: string;
    name: string;
    aiProfileMatchScore: number;
    status: string;
}

export interface ApplicantsTableProps {
    applicants: Applicant[];
    onViewResume: (applicant: Applicant) => void;
    onUpdateStatus?: (applicationId: string, newStatus: string) => Promise<void>;
    isUpdatingStatus?: string | null;
}

export interface ApplicantResume {
    resumeBlob: string;
    resumeContentType: string;
    fileName: string;
}

export interface ApplicantsApiResponse {
    applicants: Applicant[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
}
