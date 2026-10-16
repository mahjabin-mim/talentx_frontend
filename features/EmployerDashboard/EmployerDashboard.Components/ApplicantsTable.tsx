import React from "react";
import Link from "next/link";
import { Applicant, ApplicantsTableProps } from "../EmployerDashboard.interface";
import { MAX_SCORE, MIN_SCORE } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const applicantStatusClassName: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-800 border-blue-200",
    NotSelected: "bg-red-100 text-red-800 border-red-200",
    Interviewed: "bg-purple-100 text-purple-800 border-purple-200",
    Shortlisted: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Hired: "bg-green-100 text-green-800 border-green-200",
    default: "bg-gray-100 text-gray-600 border-gray-200",
};

const statusOptions = [
    "Applied",
    "NotSelected",
    "Interviewed",
    "Shortlisted",
    "Hired",
];

export default function ApplicantsTable({
    applicants,
    onViewResume,
    onUpdateStatus,
    isUpdatingStatus,
}: ApplicantsTableProps) {
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
            <table className="w-full min-w-[800px] table-fixed border-separate border-spacing-0 text-left">
                <thead>
                    <tr>
                        <th className="w-[25%] rounded-tl-[7px] border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-500">
                            Name
                        </th>
                        <th className="w-[25%] border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-500">
                            Resume
                        </th>
                        <th className="w-[25%] border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-xs font-semibold text-gray-500">
                            AI Match Score
                        </th>
                        <th className="w-[25%] rounded-tr-[7px] border-b border-gray-200 bg-gray-50 px-6 py-3 text-center text-xs font-semibold text-gray-500">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.length === 0 ? (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-6 py-10 text-center text-sm text-gray-500"
                            >
                                No applicants found.
                            </td>
                        </tr>
                    ) : (
                        applicants.map((applicant, idx) => (
                            <tr key={idx}>
                                <td className="border-b border-gray-100 px-6 py-4 text-[13px] font-semibold">
                                    <Link
                                        href={`/talent/${applicant.talentId}`}
                                        className="text-brand-primary hover:underline"
                                    >
                                        {applicant.name}
                                    </Link>
                                </td>
                                <td className="border-b border-gray-100 px-6 py-4 text-[13px]">
                                    <button
                                        type="button"
                                        onClick={() => onViewResume(applicant)}
                                        className="font-semibold text-brand-primary hover:underline"
                                    >
                                        View Resume
                                    </button>
                                </td>
                                <td className="border-b border-gray-100 px-6 py-4 text-center text-[13px]">
                                    {renderAiScore(applicant.aiProfileMatchScore)}
                                </td>
                                <td className="border-b border-gray-100 px-6 py-4 text-center text-[13px]">
                                    <div className="flex justify-center">
                                        <Select
                                            value={applicant.status}
                                            onValueChange={(val) => onUpdateStatus?.(applicant.applicationId, val)}
                                            disabled={isUpdatingStatus === applicant.applicationId}
                                        >
                                            <SelectTrigger
                                                className={cn(
                                                    "h-8 w-32 rounded border px-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                                    applicantStatusClassName[applicant.status] || applicantStatusClassName.default
                                                )}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    {isUpdatingStatus === applicant.applicationId && (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    )}
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((status) => (
                                                    <SelectItem 
                                                        key={status} 
                                                        value={status}
                                                        className="text-[10px] font-black uppercase tracking-widest"
                                                    >
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
