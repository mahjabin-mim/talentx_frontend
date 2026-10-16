import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TalentsTableProps, Talent } from "../TalentDiscovery.interface";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { useTalentInvitation } from "../TalentDiscovery.hooks";
import { MAX_SCORE, MIN_SCORE } from "@/lib/constants";

export default function TalentsTable({
    talents: initialTalents,
    loading,
    hasFetchedOnce,
    jobId,
}: TalentsTableProps) {
    const { inviteTalent, invitingId } = useTalentInvitation();
    const [localTalents, setLocalTalents] = useState<Talent[]>(initialTalents);

    // Sync local state when props change
    useEffect(() => {
        setLocalTalents(initialTalents);
    }, [initialTalents]);

    const handleInvite = async (talentId: string) => {
        const success = await inviteTalent(jobId, talentId);
        if (success) {
            setLocalTalents((prev) =>
                prev.map((t) =>
                    t.talentId === talentId
                        ? { ...t, invitationSent: true }
                        : t,
                ),
            );
        }
    };

    const renderAiScore = (score: number | null) => {
        if (score === null || Number.isNaN(score) || score === undefined) {
            return (
                <span className="badge-ai-calculating">
                    Calculating...
                </span>
            );
        }

        const badgeVariant =
            score < MIN_SCORE
                ? "badge-ai-low"
                : score < MAX_SCORE
                  ? "badge-ai-mid"
                  : "badge-ai-high";

        return (
            <span className={`badge-ai-score ${badgeVariant}`}>
                {Math.round(score)}%
            </span>
        );
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0 text-left">
                <thead>
                    <tr>
                        <th className="w-[18%] rounded-tl-[7px] border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-500">
                            Name
                        </th>
                        <th className="w-[30%] border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-500">
                            Tagline
                        </th>
                        <th className="w-[10%] border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-xs font-semibold text-gray-500">
                            LinkedIn
                        </th>
                        <th className="w-[12%] border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-xs font-semibold text-gray-500">
                            Experience
                        </th>
                        <th className="w-[15%] border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-xs font-semibold text-gray-500">
                            Match Score
                        </th>
                        <th className="w-[15%] rounded-tr-[7px] border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-xs font-semibold text-gray-500">
                            Invitation
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {localTalents.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-6 py-10 text-center text-sm text-gray-500"
                            >
                                No talents found.
                            </td>
                        </tr>
                    ) : (
                        localTalents.map((talent) => (
                            <tr key={talent.talentId}>
                                <td className="border-b border-gray-100 px-6 py-4 text-[13px] font-semibold">
                                    <Link
                                        href={`/talent/${talent.talentId}`}
                                        className="text-brand-primary hover:underline"
                                    >
                                        {talent.name}
                                    </Link>
                                </td>
                                <td className="border-b border-gray-100 px-6 py-4 text-[13px] text-gray-600">
                                    <span className="line-clamp-2">
                                        {talent.tagline}
                                    </span>
                                </td>
                                <td className="border-b border-gray-100 px-6 py-4 text-center">
                                    <a
                                        href={talent.linkedInUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block transition-transform hover:scale-110"
                                    >
                                        <Image
                                            src="/icons/social/linkedin.svg"
                                            alt="LinkedIn"
                                            width={20}
                                            height={20}
                                        />
                                    </a>
                                </td>
                                <td className="border-b border-gray-100 px-6 py-4 text-center text-[13px]">
                                    {talent.yearsOfExperience} years
                                </td>
                                <td className="border-b border-gray-100 px-6 py-4 text-center">
                                    {renderAiScore(talent.aiScore)}
                                </td>
                                <td className="border-b border-gray-100 px-6 py-4 text-center">
                                    {talent.invitationSent ? (
                                        <div className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-brand-primary">
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                            <span className="text-center leading-tight">Invitation has already<br />been sent</span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={invitingId === talent.talentId}
                                            onClick={() => handleInvite(talent.talentId)}
                                            className="inline-flex items-center gap-1.5 rounded-md bg-brand-primary/10 px-3 py-1.5 text-xs font-semibold text-brand-primary transition hover:bg-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {invitingId === talent.talentId ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    Inviting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={14} /> Invite
                                                </>
                                            )}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
