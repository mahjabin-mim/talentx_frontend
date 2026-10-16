import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { extractApiError } from "@/features/Authentications/Authentications.helper";
import { Talent, TalentProfileDetail } from "./TalentDiscovery.interface";
import {
    getJobTalentsService,
    getTalentDetailService,
    inviteTalentService,
} from "./TalentDiscovery.service";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

export const useJobTalents = (jobId: string) => {
    const [talents, setTalents] = useState<Talent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [minExperience, setMinExperience] = useState<number | "">("");

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, minExperience]);

    useEffect(() => {
        if (!jobId) {
            setLoading(false);
            return;
        }

        const fetchTalents = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getJobTalentsService(jobId, {
                    page,
                    searchTerm: debouncedSearchTerm.trim() || undefined,
                    minExperience:
                        minExperience === "" ? undefined : minExperience,
                });
                setTalents(response.talents);
                setTotalPages(response.totalPages);
            } catch (error) {
                setError(
                    extractApiError(
                        error,
                        "Failed to fetch talents. Please try again.",
                    ),
                );
            } finally {
                setLoading(false);
                setHasFetchedOnce(true);
            }
        };

        void fetchTalents();
    }, [jobId, page, debouncedSearchTerm, minExperience]);

    return {
        talents,
        loading,
        error,
        hasFetchedOnce,
        page,
        setPage,
        totalPages,
        searchTerm,
        setSearchTerm,
        minExperience,
        setMinExperience,
    };
};

export const useTalentDetail = (talentId: string) => {
    const [talent, setTalent] = useState<TalentProfileDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!talentId) {
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTalentDetailService(talentId);
                setTalent(data);
            } catch (err) {
                setError(
                    extractApiError(
                        err,
                        "Failed to load talent details. Please try again.",
                    ),
                );
            } finally {
                setLoading(false);
            }
        };

        void fetchDetail();
    }, [talentId]);

    return { talent, loading, error };
};

export const useTalentInvitation = () => {
    const [invitingId, setInvitingId] = useState<string | null>(null);

    const inviteTalent = async (jobId: string, talentId: string) => {
        setInvitingId(talentId);
        try {
            await inviteTalentService(jobId, talentId);
            toast.success("Invitation sent successfully!");
            return true;
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 409) {
                toast.info("Invitation has already been sent.");
                return true; // Treat as success for UI state
            }
            const message = extractApiError(
                error,
                "Failed to send invitation. Please try again.",
            );
            toast.error(message);
            return false;
        } finally {
            setInvitingId(null);
        }
    };

    return { inviteTalent, invitingId };
};
