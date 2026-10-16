"use client";

import React from "react";
import { Search, Sparkles } from "lucide-react";
import TalentsTable from "./TalentsTable";
import { useJobTalents } from "../TalentDiscovery.hooks";
import { Container } from "@/components/ui/container";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TalentDiscoveryViewProps {
    jobId: string;
}

export default function TalentDiscoveryView({ jobId }: TalentDiscoveryViewProps) {
    const {
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
    } = useJobTalents(jobId);

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="pb-20 pt-16">
                {/* HEADER SECTION */}
                <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1">
                            <Sparkles size={14} className="text-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                AI Talent Discovery
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                            Discover <span className="text-gradient">Top Talents</span>
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Find and invite world-class professionals to join your team.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or tagline..."
                                className="h-12 w-[280px] pl-12 pr-4 rounded-2xl border border-border bg-white text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                            />
                        </div>
                        
                        <Select
                            value={minExperience === "" ? "none" : String(minExperience)}
                            onValueChange={(val) => setMinExperience(val === "none" ? "" : Number(val))}
                        >
                            <SelectTrigger className="!h-12 w-[220px] rounded-2xl border border-border bg-white px-4 py-0 text-sm font-medium text-foreground outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm">
                                <SelectValue placeholder="Experience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Any Experience</SelectItem>
                                <SelectItem value="1">1+ Year</SelectItem>
                                <SelectItem value="3">3+ Years</SelectItem>
                                <SelectItem value="5">5+ Years</SelectItem>
                                <SelectItem value="8">8+ Years</SelectItem>
                                <SelectItem value="10">10+ Years</SelectItem>
                            </SelectContent>
                        </Select>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setMinExperience("");
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
                        <p className="mt-6 text-lg font-bold text-muted-foreground animate-pulse">Scanning the global talent pool...</p>
                    </div>
                ) : (
                    <div
                        className={`transition-opacity duration-300 ${
                            loading ? "opacity-50" : "opacity-100"
                        }`}
                    >
                        <div className="overflow-hidden rounded-[2.5rem] border border-border bg-white shadow-xl">
                            <TalentsTable
                                talents={talents}
                                loading={loading}
                                hasFetchedOnce={hasFetchedOnce}
                                jobId={jobId}
                            />
                            
                            {/* PAGINATION SECTION */}
                            <div className="flex items-center justify-between border-t border-border bg-muted/20 px-8 py-6">
                                <p className="text-sm font-bold text-muted-foreground">
                                    Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
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
        </div>
    );
}
