import { useQuery } from "@tanstack/react-query";
import { getPublicJobsService } from "./Home.service";

export const usePublicJobsQuery = (
    searchTerm: string,
    employmentType: string,
    workArrangement: string,
    experienceLevel: string,
    page: number
) => {
    return useQuery({
        queryKey: ["public-jobs", searchTerm, employmentType, workArrangement, experienceLevel, page],
        queryFn: () => getPublicJobsService(searchTerm, employmentType, workArrangement, experienceLevel, page),
    });
};