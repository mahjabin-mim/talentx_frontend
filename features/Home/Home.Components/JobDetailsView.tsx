import { useEffect, useState } from "react";
import {
    Loader2,
    MapPin,
    DollarSign,
    Briefcase,
    Users,
    CalendarClock,
    GraduationCap,
    CheckCircle2,
    Building2,
    ArrowLeft,
    Sparkles,
} from "lucide-react";

import { getJobByIdService } from "@/features/Jobs/Jobs.service";
import type { IJobDetailsResponse } from "@/features/Jobs/Jobs.type";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatMoney } from "../Home.helper";
import { Container } from "@/components/ui/container";

export const JobDetailsView = ({
    jobId,
    fallbackCompanyName,
    showBackButton = false,
}: {
    jobId: string;
    fallbackCompanyName?: string | null;
    showBackButton?: boolean;
}) => {
    const [job, setJob] = useState<IJobDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromDashboard = searchParams.get("from") === "dashboard";

    useEffect(() => {
        let mounted = true;
        const fetchJob = async () => {
            try {
                const data = await getJobByIdService(jobId);
                if (mounted) setJob(data);
            } catch {
                if (mounted) setError("Failed to load job details.");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        void fetchJob();
        return () => {
            mounted = false;
        };
    }, [jobId]);

    const formatDeadline = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return "Invalid Date";
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
                <Loader2
                    className="animate-spin text-brand-primary"
                    size={48}
                />
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                    Parsing Job Data...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="py-20">
                <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center">
                    <p className="text-lg font-bold text-red-800">{error}</p>
                    <Link
                        href="/jobs"
                        className="mt-4 inline-block font-black text-brand-primary hover:underline"
                    >
                        Return to Jobs Board
                    </Link>
                </div>
            </Container>
        );
    }

    if (!job) return null;

    return (
        <Container className="pb-32 pt-16">
            <div className="animate-in fade-in duration-700">
                {showBackButton && (
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                fromDashboard ? "/talent-dashboard" : "/jobs",
                            )
                        }
                        className="mb-10 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground transition hover:text-brand-primary"
                    >
                        <ArrowLeft size={16} />
                        {fromDashboard
                            ? "Back to Dashboard"
                            : "Back to Browse Jobs"}
                    </button>
                )}

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* MAIN CONTENT (2/3) */}
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h1 className="text-4xl font-black tracking-tight md:text-6xl text-foreground">
                                {job.title}
                            </h1>
                            <div className="mt-6 flex items-center gap-4 text-xl font-bold text-brand-primary">
                                <Building2 size={24} />
                                {job.companyName ||
                                    fallbackCompanyName ||
                                    "Confidential Partner"}
                            </div>
                        </section>

                        <div className="space-y-12">
                            <section>
                                <h3 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2 mb-4">
                                    <Sparkles
                                        size={20}
                                        className="text-ai-glow"
                                    />
                                    Role Overview
                                </h3>
                                <div className="prose prose-slate max-w-none">
                                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">
                                        {job.description ||
                                            "No description provided."}
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2 mb-4">
                                    <CheckCircle2
                                        size={20}
                                        className="text-brand-primary"
                                    />
                                    Key Responsibilities
                                </h3>
                                <div className="prose prose-slate max-w-none">
                                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">
                                        {job.responsibilities ||
                                            "No responsibilities provided."}
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-black tracking-tight text-foreground mb-4">
                                    Required Skills
                                </h3>
                                {(job.skills ?? []).length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {(job.skills ?? []).map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:border-brand-primary/30 hover:shadow-md"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">
                                        No specific skills listed.
                                    </p>
                                )}
                            </section>
                        </div>
                    </div>

                    {/* SIDEBAR (1/3) */}
                    <aside className="space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl">
                                <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    Position Details
                                </h4>

                                <div className="space-y-6">
                                    <DetailItem
                                        icon={<MapPin size={18} />}
                                        label="Location"
                                        value={
                                            job.workArrangement === "Remote"
                                                ? `Remote (${job.timezone})`
                                                : `${job.city}, ${job.countryCode}`
                                        }
                                    />
                                    <DetailItem
                                        icon={<DollarSign size={18} />}
                                        label="Compensation"
                                        value={`${job.currencyCode} ${formatMoney(job.salaryMin)} - ${formatMoney(job.salaryMax)}`}
                                    />
                                    <DetailItem
                                        icon={<Briefcase size={18} />}
                                        label="Contract"
                                        value={job.employmentType}
                                    />
                                    <DetailItem
                                        icon={<GraduationCap size={18} />}
                                        label="Experience"
                                        value={job.experienceLevel}
                                    />
                                    <DetailItem
                                        icon={<Users size={18} />}
                                        label="Openings"
                                        value={`${job.numberOfPositions} Roles`}
                                    />
                                    <DetailItem
                                        icon={<CalendarClock size={18} />}
                                        label="Closing Date"
                                        value={formatDeadline(
                                            job.applicationDeadline,
                                        )}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(`/apply?jobId=${job.jobId}`)
                                    }
                                    className="mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 text-base font-black text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-brand-hover active:scale-[0.98] cursor-pointer"
                                >
                                    Apply Now <Sparkles size={20} />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </Container>
    );
};

const DetailItem = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                {label}
            </p>
            <p className="text-sm font-bold text-foreground line-clamp-2">
                {value}
            </p>
        </div>
    </div>
);
