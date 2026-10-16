"use client";

import { useState, useEffect } from "react";
import ApplicantsTable from "@/features/EmployerDashboard/EmployerDashboard.Components/ApplicantsTable";
import { Applicant } from "@/features/EmployerDashboard/EmployerDashboard.interface";
import { Search, Sparkles } from "lucide-react";
import { ResumeViewerModal } from "./ResumeViewerModal";
import { getApplicantResumeService } from "../EmployerDashboard.service";
import { Container } from "@/components/ui/container";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface JobApplicantsViewProps {
    applicants: Applicant[];
    loading: boolean;
    hasFetchedOnce: boolean;
    error: string | null;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    updateApplicantStatus: (applicationId: string, newStatus: string) => Promise<void>;
    isUpdatingStatus: string | null;
}

const statusOptions = [
    "All",
    "Applied",
    "NotSelected",
    "Interviewed",
    "Shortlisted",
    "Hired",
];

export default function JobApplicantsView({
    applicants,
    loading,
    hasFetchedOnce,
    error,
    page,
    setPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    updateApplicantStatus,
    isUpdatingStatus,
}: JobApplicantsViewProps) {
    const [viewingApplicant, setViewingApplicant] =
        useState<Applicant | null>(null);
    const [resumeBlobUrl, setResumeBlobUrl] = useState<string | null>(null);
    const [isResumeLoading, setIsResumeLoading] = useState(false);
    const [resumeError, setResumeError] = useState<string | null>(null);

    useEffect(() => {
        if (!viewingApplicant) {
            return;
        }

        const fetchResume = async () => {
            setIsResumeLoading(true);
            setResumeBlobUrl(null);
            setResumeError(null);
            try {
                const blob = await getApplicantResumeService(
                    viewingApplicant.applicationId,
                );
                // Create a local URL for the PDF blob
                const url = URL.createObjectURL(blob);
                setResumeBlobUrl(url);
            } catch (err) {
                setResumeError("Failed to load resume.");
            } finally {
                setIsResumeLoading(false);
            }
        };

        void fetchResume();
    }, [viewingApplicant]);

    const handleCloseModal = () => {
        // Important: Clean up the blob URL to prevent memory leaks
        if (resumeBlobUrl) {
            URL.revokeObjectURL(resumeBlobUrl);
        }
        setViewingApplicant(null);
        setResumeBlobUrl(null);
        setResumeError(null);
    };

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="pb-20 pt-16">
                <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1">
                            <Sparkles size={14} className="text-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                Applicant Management
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                            Job <span className="text-gradient">Applicants</span>
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Review and manage candidates for this position.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search applicants..."
                                className="h-12 w-[280px] pl-12 pr-4 rounded-2xl border border-border bg-white text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                            />
                        </div>
                        
                        <Select
                            value={statusFilter || "All"}
                            onValueChange={(val) => setStatusFilter(val === "All" ? "" : val)}
                        >
                            <SelectTrigger className="!h-12 w-[280px] rounded-2xl border border-border bg-white px-4 py-0 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm">
                                <SelectValue placeholder="Status Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("");
                            }}
                            className="h-12 rounded-2xl border border-border bg-white px-6 text-sm font-black text-foreground transition-all hover:bg-muted/50 active:scale-[0.98]"
                        >
                            Reset
                        </button>
                    </div>
                </header>

                {error ? (
                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center animate-in shake-1">
                        <p className="text-sm font-bold text-red-800">{error}</p>
                    </div>
                ) : null}

                {!hasFetchedOnce ? (
                    <div className="flex flex-col items-center justify-center py-24 rounded-[3rem] border border-dashed border-border bg-white/30 backdrop-blur-sm">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent shadow-lg shadow-brand-primary/20"></div>
                        <p className="mt-6 text-lg font-bold text-muted-foreground animate-pulse">Loading applicants data...</p>
                    </div>
                ) : (
                    <div
                        className={`transition-opacity duration-300 ${
                            loading ? "opacity-50" : "opacity-100"
                        }`}
                    >
                        <div className="overflow-hidden rounded-[2.5rem] border border-border bg-white shadow-xl">
                            <ApplicantsTable
                                applicants={applicants}
                                onViewResume={setViewingApplicant}
                                onUpdateStatus={updateApplicantStatus}
                                isUpdatingStatus={isUpdatingStatus}
                            />
                            
                            <div className="flex items-center justify-between border-t border-border bg-muted/20 px-8 py-6">
                                <p className="text-sm font-bold text-muted-foreground">
                                    Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page <= 1 || loading}
                                        className="flex h-12 items-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-black transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= totalPages || loading}
                                        className="flex h-12 items-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-black transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Container>

            {viewingApplicant ? (
                <ResumeViewerModal
                    isLoading={isResumeLoading}
                    dataUrl={resumeBlobUrl}
                    applicantName={viewingApplicant.name}
                    onClose={handleCloseModal}
                    error={resumeError}
                />
            ) : null}
        </div>
    );
}
