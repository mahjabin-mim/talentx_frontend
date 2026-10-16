export interface Talent {
    talentId: string;
    name: string;
    tagline: string;
    linkedInUrl: string;
    yearsOfExperience: number;
    aiScore: number | null;
    invitationSent: boolean;
}

export interface TalentProfileDetail {
    name: string;
    email: string;
    location: string;
    tagline: string;
    bio: string;
    linkedin: string;
    additionalUrl: string;
    videoIntro: string;
    workplaces: string;
    skills: string[];
}

export interface TalentDiscoveryResponse {
    talents: Talent[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

export interface TalentsTableProps {
    talents: Talent[];
    loading: boolean;
    hasFetchedOnce: boolean;
    jobId: string;
}
