import { format, isValid, parseISO } from "date-fns";

// Enums
export enum JobStatus {
    ACTIVE = "Active",
    CLOSED = "Closed",
    DRAFT = "Draft",
    EXPIRED = "Expired",
    DEACTIVATED = "Deactivated",
}

// Types
export type EmploymentTypeValue =
    | "FullTime"
    | "PartTime"
    | "Contract"
    | "Internship";

export type WorkArrangementValue = "Remote" | "Hybrid" | "Onsite";

export type ExperienceLevelValue =
    | "Junior"
    | "MidLevel"
    | "Senior"
    | "LeadPrincipal";

export type JobStatusValue =
    | "Active"
    | "Closed"
    | "Draft"
    | "Expired"
    | "Deactivated";

export type JobStatusActionValue = "Activate" | "Deactivate";

export type JobSummaryModalType =
    | "leave"
    | "draft"
    | "draftWarning"
    | "publish"
    | "loading"
    | "details"
    | null;

export type JobSummaryEditableDetail =
    | "title"
    | "employmentType"
    | "workLocation"
    | "experienceLevel"
    | "experienceRange"
    | "salary"
    | "numberOfPositions"
    | "applicationDeadline";

export type JobLifecycleStatus = JobStatusValue;

export type CountryOption = {
    code: string;
    name: string;
};

// Interfaces
export interface IJobPostingInput {
    jobId?: string;
    title: string;
    description: string;
    responsibilities: string;
    skills: string[];
    employmentType: EmploymentTypeValue;
    workArrangement: WorkArrangementValue;
    experienceLevel: ExperienceLevelValue;
    experienceMinYears: number;
    experienceMaxYears: number;
    salaryMin: number;
    salaryMax: number;
    countryCode?: string;
    city?: string;
    timezone?: string;
    currencyCode: string;
    numberOfPositions: number;
    applicationDeadline: string;
}

export type IGenerateJobDescriptionRequest = IJobPostingInput;

export interface IGenerateJobDescriptionResponse {
    description: string;
    message?: string;
}

export interface ICreateJobRequest extends IJobPostingInput {
    publishJob?: boolean;
}

export interface ICreateJobResponse {
    jobId: string;
    status: JobStatusValue;
    description: string;
    message: string;
}

export interface IEmployerDashboardJob {
    jobId: string;
    title: string;
    location: string;
    status: string;
    createdOn: string;
    applicants: number;
}

export interface IEmployerDashboardResponse {
    jobsPosted: number;
    activeJobs: number;
    closedJobs: number;
    totalHires: number;
    availableStatuses: string[];
    jobs: IEmployerDashboardJob[];
    currentPage: number;
    totalPages: number;
}

export interface IJobDetailsResponse {
    jobId: string;
    title: string;
    companyName?: string;
    description: string;
    responsibilities: string;
    skills: string[];
    employmentType: ICreateJobRequest["employmentType"];
    workArrangement: ICreateJobRequest["workArrangement"];
    experienceLevel: ICreateJobRequest["experienceLevel"];
    experienceMinYears: number;
    experienceMaxYears: number;
    salaryMin: number;
    salaryMax: number;
    countryCode?: string;
    city?: string;
    timezone?: string;
    currencyCode: string;
    numberOfPositions: number;
    applicationDeadline: string;
    status: JobStatusValue;
}

export interface JobSummaryHeaderProps {
    isEditMode: boolean;
    onClose: () => void;
}

export interface JobSummaryDetailRow {
    label: string;
    value: string;
    key: JobSummaryEditableDetail;
}

export interface JobSummaryDetailsSectionProps {
    detailRows: JobSummaryDetailRow[];
    onEdit: (key: JobSummaryEditableDetail) => void;
}

export interface SkillItem {
    id: string;
    value: string;
}

export interface JobSummarySkillsSectionProps {
    skills: SkillItem[];
    skillsError?: string;
    onAddSkill: () => void;
    onUpdateSkill: (id: string, value: string) => void;
    onRemoveSkill: (id: string) => void;
}

export interface JobSummaryDescriptionSectionProps {
    editableDescription: string;
    isGeneratingDescription: boolean;
    pageError: string | null;
    descriptionError?: string;
    onDescriptionChange: (value: string) => void;
}

export interface JobSummaryFooterProps {
    isEditMode: boolean;
    isSaving: boolean;
    isGeneratingDescription: boolean;
    originalStatus: JobLifecycleStatus | null;
    onDiscard: () => void;
    onDraft: () => void;
    onPublish: () => void;
    onSaveChanges: () => void;
}

export interface JobSummaryModalProps {
    modal: JobSummaryModalType;
    loadingMessage: string;
    editingDetail: JobSummaryEditableDetail | null;
    editDetailTitleMap: Record<JobSummaryEditableDetail, string>;
    detailError: string | null;
    detailDraft: Record<string, string>;
    isSaving: boolean;
    isGeneratingDescription: boolean;
    onClose: () => void;
    onConfirmLeave: () => void;
    onRequestDraftCancel: () => void;
    onCancelDraft: () => void;
    onSubmit: (mode: "draft" | "publish") => void;
    onDetailDraftChange: (key: string, value: string) => void;
    onSaveSingleDetail: () => void;
}

// Constants & helpers
export const editDetailTitleMap: Record<JobSummaryEditableDetail, string> = {
    title: "Edit Role title",
    employmentType: "Edit Employment type",
    workLocation: "Edit Work arrangement & location",
    experienceLevel: "Edit Experience level",
    experienceRange: "Edit Experience (years)",
    salary: "Edit Salary range",
    numberOfPositions: "Edit Open positions",
    applicationDeadline: "Edit Application deadline",
};

export const countryOptions: CountryOption[] = [
    { code: "BD", name: "Bangladesh" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "EU", name: "European Union" },
    { code: "IN", name: "India" },
];

export const timezoneOptions: string[] = [
    "UTC",
    "Asia/Dhaka",
    "Asia/Kolkata",
    "Asia/Dubai",
    "Asia/Singapore",
    "Europe/London",
    "Europe/Berlin",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
    "Australia/Sydney",
];

export const currencyOptions: string[] = [
    "USD",
    "BDT",
    "GBP",
    "CAD",
    "AUD",
    "EUR",
    "INR",
];

export const countryToCurrencyMap: Record<string, string> = {
    BD: "BDT",
    US: "USD",
    GB: "GBP",
    CA: "CAD",
    AU: "AUD",
    EU: "EUR",
    IN: "INR",
};

export const workArrangementOptions = [
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Onsite", label: "Onsite" },
];

export const JOB_FORM_LIMITS = {
    salaryMin: 0,
    salaryMax: 100000000,
    positionsMin: 1,
    positionsMax: 1000,
    experienceMin: 0,
    experienceMax: 80,
};

export const toDigitsOnly = (value: string): string => value.replace(/\D/g, "");

export const toDateInputValue = (isoDate: string): string => {
    const date = parseISO(isoDate);
    if (!isValid(date)) return "";
    return format(date, "yyyy-MM-dd");
};

export const formatDeadline = (value: string): string => {
    const date = parseISO(value);
    if (!isValid(date)) return "N/A";
    return format(date, "MMM d, yyyy");
};

export const normalizeDescription = (value?: string | null): string => {
    const trimmed = (value ?? "").trim();
    return value && trimmed ? value : "";
};
