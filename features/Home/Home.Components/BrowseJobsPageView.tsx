"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { extractApiError } from "@/features/Authentications/Authentications.helper";
import { usePublicJobsQuery } from "../Home.hooks";
import { JobCard } from "./JobCard";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Container } from "@/components/ui/container";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const BrowseJobsPageView = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    const [employmentType, setEmploymentType] = useState("All");
    const [workArrangement, setWorkArrangement] = useState("All");
    const [experienceLevel, setExperienceLevel] = useState("All");
    const [page, setPage] = useState(1);

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchTerm, employmentType, workArrangement, experienceLevel]);

    const { data, isLoading, error } = usePublicJobsQuery(
        debouncedSearchTerm,
        employmentType,
        workArrangement,
        experienceLevel,
        page,
    );

    const jobs = data?.jobs ?? [];
    const currentPage = data?.currentPage ?? 1;
    const totalPages = data?.totalPages ?? 1;

    const errorMessage = error
        ? extractApiError(error, "Unable to load jobs right now.")
        : null;

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="pb-20 pt-16" aria-label="Main content">
                
                {/* HEADER SECTION */}
                <header className="mb-12">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1">
                                <Sparkles size={14} className="text-brand-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                    Discover Your Future
                                </span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                                Explore <span className="text-gradient">Opportunities</span>
                            </h1>
                            <p className="mt-3 max-w-lg text-lg text-muted-foreground">
                                Find roles that match your passion and expertise using our AI-driven discovery engine.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Total Found</p>
                                <p className="text-xl font-black text-foreground">{data?.totalCount ?? 0} Jobs</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- FILTERS SECTION --- */}
                <div className="sticky top-20 z-30 mb-10">
                    <div className="flex flex-col gap-4 rounded-[2rem] border border-white/40 bg-white/60 p-4 shadow-xl backdrop-blur-xl md:flex-row md:items-center">
                        <div className="relative flex-1 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-primary transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by job title or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border bg-white text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                            />
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
                            <Select value={employmentType} onValueChange={setEmploymentType}>
                                <SelectTrigger className="w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal size={18} className="text-muted-foreground" />
                                        <SelectValue placeholder="Employment Type" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Types</SelectItem>
                                    <SelectItem value="FullTime">Full Time</SelectItem>
                                    <SelectItem value="PartTime">Part Time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={workArrangement} onValueChange={setWorkArrangement}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Work Arrangement" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Arrangements</SelectItem>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    <SelectItem value="Onsite">Onsite</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Experience Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Levels</SelectItem>
                                    <SelectItem value="Junior">Junior</SelectItem>
                                    <SelectItem value="MidLevel">Mid-Level</SelectItem>
                                    <SelectItem value="Senior">Senior</SelectItem>
                                    <SelectItem value="LeadPrincipal">Lead / Principal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* --- RESULTS SECTION --- */}
                <div className="space-y-10">
                    {errorMessage && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center animate-in shake-1">
                            <p className="text-sm font-bold text-red-800">{errorMessage}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div
                                    key={`skeleton-${idx}`}
                                    className="h-[280px] animate-pulse rounded-3xl border border-border bg-white/50"
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            {jobs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-border bg-white/30 py-20 px-6 text-center backdrop-blur-sm">
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                                        <Search size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground">No matches found</h3>
                                    <p className="mt-2 text-muted-foreground">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
                                    <button 
                                        onClick={() => {
                                            setSearchTerm("");
                                            setEmploymentType("All");
                                            setWorkArrangement("All");
                                            setExperienceLevel("All");
                                        }}
                                        className="mt-6 text-sm font-black text-brand-primary hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {jobs.map((job) => (
                                        <JobCard 
                                            key={job.jobId} 
                                            job={job} 
                                            onClick={() => router.push(`/jobs/${job.jobId}`)}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* --- PAGINATION SECTION --- */}
                            {totalPages > 1 && (
                                <div className="mt-16 flex items-center justify-between border-t border-border pt-10">
                                    <div className="text-sm font-bold text-muted-foreground">
                                        Showing page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="flex h-12 items-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-black transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft size={18} /> Previous
                                        </button>
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="flex h-12 items-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-black transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Container>
        </div>
    );
};
