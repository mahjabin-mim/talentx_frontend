export interface IPublicJobCard {
    jobId: string;
    title: string;
    companyName: string;
    employmentType: string;
    workArrangement: string;
    experienceLevel: string;
    experienceMinYears: number;
    experienceMaxYears: number;
    salaryMin: number;
    salaryMax: number;
    currencyCode: string;
    numberOfPositions: number;
    location: string;
    applicationDeadline: string;
    createdOn: string;
    status: string;
}

export interface IGetPublicJobsResponse {
    jobs: IPublicJobCard[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
}
