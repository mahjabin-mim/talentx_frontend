export type FormDataType = {
    Name: string;
    Email: string;
    ContactNumber: string;
    Education: string;
    Department: string;
    CGPA: string;
    LinkedInUrl: string;
    AdditionalUrl: string;
    Location: string;
    CoverLetter: string;
    ExpectedSalary: string;
    Experience: string;
};

export type ApplySubmissionResponse = {
    existingUserFound?: boolean;
    ExistingUserFound: boolean;
    Name: string;
    Email: string;
    ContactNumber: string;
    Education: string;
    Department: string;
    CGPA: string;
    LinkedInUrl: string;
    AdditionalUrl: string;
    Location: string;
    CoverLetter: string;
    ExpectedSalary: number;
    Experience: number;
};

export type ExtractResumeResponse = {
    education?: string | null;
    department?: string | null;
    cgpa?: string | null;
    linkedInUrl?: string | null;
    additionalUrl?: string | null;
    location?: string | null;
    expectedSalary?: string | null;
    experience?: string | null;
};
