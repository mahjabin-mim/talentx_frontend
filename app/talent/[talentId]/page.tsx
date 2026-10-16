"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ExternalLink, Video, MapPin, Mail, Briefcase, Code } from "lucide-react";
import PageLoader from "@/components/PageLoader/PageLoader";
import { useTalentDetail } from "@/features/TalentDiscovery/TalentDiscovery.hooks";

interface PageProps {
    params: Promise<{ talentId: string }>;
}

export default function TalentDetailPage({ params }: PageProps) {
    const { talentId } = use(params);
    const { talent, loading, error } = useTalentDetail(talentId);

    if (loading) {
        return <PageLoader message="Loading talent profile..." />;
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-4 text-center">
                    <p className="text-destructive font-semibold">{error}</p>
                    <Link href="/employer/dashboard" className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline">
                        Go back to dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!talent) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <p className="text-muted-foreground">Talent not found.</p>
                <Link href="/employer/dashboard" className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline">
                    Go back to dashboard
                </Link>
            </div>
        );
    }

    const fieldLabelClass = "flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2";
    const panelClass = "rounded-xl border border-gray-100 bg-white p-6 shadow-sm";

    return (
        <main className="min-h-[calc(100vh-72px)] bg-gray-50/50 px-4 py-8 md:px-6">
            <div className="mx-auto max-w-4xl">
                <Link 
                    href="/employer/dashboard" 
                    className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-brand-primary"
                >
                    <ChevronLeft size={16} />
                    Back to Dashboard
                </Link>

                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="h-32 bg-brand-primary/10" />
                        <div className="px-6 pb-8">
                            <div className="-mt-12 flex flex-col gap-6 sm:flex-row sm:items-end">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-brand-primary text-3xl font-bold text-white shadow-md">
                                    {talent.name.slice(0, 1).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{talent.name}</h1>
                                    <p className="mt-1 text-lg font-medium text-brand-primary">{talent.tagline}</p>
                                </div>
                                <div className="flex gap-3">
                                    {talent.linkedin && (
                                        <a 
                                            href={talent.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-brand-primary hover:text-brand-primary"
                                        >
                                            <Image 
                                                src="/icons/social/linkedin.svg" 
                                                alt="LinkedIn" 
                                                width={20} 
                                                height={20} 
                                            />
                                        </a>
                                    )}
                                    {talent.additionalUrl && (
                                        <a 
                                            href={talent.additionalUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-brand-primary hover:text-brand-primary"
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Sidebar Info */}
                        <div className="space-y-6 md:col-span-1">
                            <div className={panelClass}>
                                <div className="space-y-5">
                                    <div>
                                        <label className={fieldLabelClass}>
                                            <Mail size={14} /> Email
                                        </label>
                                        <p className="text-sm font-medium text-gray-900 break-all">{talent.email}</p>
                                    </div>
                                    <div>
                                        <label className={fieldLabelClass}>
                                            <MapPin size={14} /> Location
                                        </label>
                                        <p className="text-sm font-medium text-gray-900">{talent.location}</p>
                                    </div>
                                    {talent.videoIntro && (
                                        <div>
                                            <label className={fieldLabelClass}>
                                                <Video size={14} /> Video Intro
                                            </label>
                                            <a 
                                                href={talent.videoIntro}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"
                                            >
                                                Watch Introduction
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={panelClass}>
                                <label className={fieldLabelClass}>
                                    <Code size={14} /> Skills
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {talent.skills.map((skill, idx) => (
                                        <span 
                                            key={idx}
                                            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-6 md:col-span-2">
                            <div className={panelClass}>
                                <label className={fieldLabelClass}>Professional Bio</label>
                                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                                    {talent.bio}
                                </p>
                            </div>

                            <div className={panelClass}>
                                <label className={fieldLabelClass}>
                                    <Briefcase size={14} /> Workplaces
                                </label>
                                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                                    {talent.workplaces}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
