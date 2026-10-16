import api from "@/lib/axios";
import type { IGetPublicJobsResponse } from "./Home.interface";

export async function getPublicJobsService(
    searchTerm?: string,
    employmentType?: string,
    workArrangement?: string,
    experienceLevel?: string,
    page: number = 1
): Promise<IGetPublicJobsResponse> {
    const params = new URLSearchParams();
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (employmentType && employmentType !== "All") params.append("employmentType", employmentType);
    if (workArrangement && workArrangement !== "All") params.append("workArrangement", workArrangement);
    if (experienceLevel && experienceLevel !== "All") params.append("experienceLevel", experienceLevel);
    params.append("page", page.toString());

    const response = await api.get<IGetPublicJobsResponse>(`/jobs/public`, { params });
    return response.data;
}
