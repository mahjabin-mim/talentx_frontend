export type JobStatus =
    | "Active"
    | "Closed"
    | "Draft"
    | "Expired"
    | "Deactivated";

export interface JobRow {
    jobId: string;
    title: string;
    location: string;
    status: JobStatus;
    createdOn: string;
    applicants: number;
}

export const statusClassName: Record<JobStatus, string> = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Closed: "bg-gray-100 text-gray-600 border-gray-200",
    Draft: "bg-orange-100 text-orange-700 border-orange-200",
    Expired: "bg-red-100 text-red-800 border-red-200",
    Deactivated: "bg-purple-100 text-purple-800 border-purple-200",
};

export type SharePlatform = {
    id: string;
    label: string;
    iconSrc: string;
    iconAlt: string;
    buttonVariantClassName: string;
    createShareUrl: (encodedUrl: string) => string;
};

export const sharePlatforms: SharePlatform[] = [
    {
        id: "linkedin",
        label: "LinkedIn",
        iconSrc: "/icons/social/linkedin.svg",
        iconAlt: "LinkedIn",
        buttonVariantClassName: "share-option-btn--linkedin",
        createShareUrl: (encodedUrl) =>
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
        id: "facebook",
        label: "Facebook",
        iconSrc: "/icons/social/facebook.svg",
        iconAlt: "Facebook",
        buttonVariantClassName: "share-option-btn--facebook",
        createShareUrl: (encodedUrl) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
];
