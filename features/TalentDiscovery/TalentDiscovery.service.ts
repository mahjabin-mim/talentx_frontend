import api from "@/lib/axios";
import {
    TalentDiscoveryResponse,
    TalentProfileDetail,
} from "./TalentDiscovery.interface";

export const getJobTalentsService = async (
    jobId: string,
    params?: { page?: number; searchTerm?: string; minExperience?: number },
) => {
    const response = await api.get<TalentDiscoveryResponse>(
        `/jobs/${jobId}/talents`,
        { params },
    );
    return response.data;
};

export const getTalentDetailService = async (talentId: string) => {
    const response = await api.get<TalentProfileDetail>(
        `/jobs/talents/${talentId}`,
    );
    return response.data;
};

export const inviteTalentService = async (jobId: string, talentId: string) => {
    const response = await api.post(`/jobs/${jobId}/talents/${talentId}/invite`);
    return response.data;
};
