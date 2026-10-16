import { Building2, CalendarClock, MapPin, Sparkles, Users, ArrowUpRight } from "lucide-react";
import { formatJobDate, formatMoney } from "../Home.helper";
import { IPublicJobCard } from "../Home.interface";

interface JobCardProps {
    job: IPublicJobCard;
    onClick: () => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
    // Dynamic highlighting logic for seniority levels
    const getExperienceHighlight = (level: string) => {
        const normalized = level.toLowerCase();
        if (normalized.includes('junior')) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
        if (normalized.includes('mid')) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
        if (normalized.includes('senior')) return "bg-brand-primary/10 text-brand-primary border-brand-primary/20";
        if (normalized.includes('lead') || normalized.includes('principal')) return "bg-purple-500/10 text-purple-600 border-purple-500/20";
        return "bg-white/50 text-muted-foreground border-white/40";
    };

    return (
        <article
            onClick={onClick}
            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/40 p-8 shadow-sm backdrop-blur-md transition-all hover:-translate-y-2 hover:bg-white/60 hover:shadow-2xl cursor-pointer ring-1 ring-black/5"
        >
            {/* AI Match Badge */}
            <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-ai-glow/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-ai-glow border border-ai-glow/20">
                <Sparkles size={12} />
                Smart Match
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20">
                        <Building2 size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60">Hiring Company</span>
                        <span className="text-sm font-black text-foreground uppercase tracking-tight">
                            {job.companyName || "Secret Startup"}
                        </span>
                    </div>
                </div>
                <h3 className="line-clamp-2 text-2xl font-black tracking-tighter text-foreground transition-colors group-hover:text-brand-primary leading-tight">
                    {job.title}
                </h3>
            </div>

            <div className="mb-8 space-y-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-[12px] font-bold text-muted-foreground border border-white/40">
                        <MapPin size={14} className="text-brand-primary" />
                        <span className="truncate">{job.location}</span>
                    </div>
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-black uppercase tracking-widest border transition-all ${getExperienceHighlight(job.experienceLevel)}`}>
                        <Users size={14} />
                        <span className="truncate">{job.experienceLevel}</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-[12px] font-bold text-muted-foreground border border-white/40">
                        <CalendarClock size={14} className="text-brand-primary" />
                        <span className="truncate">Deadline: {formatJobDate(job.applicationDeadline)}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-brand-primary/5 px-3 py-2 text-[12px] font-bold text-brand-primary border border-brand-primary/10">
                        <Sparkles size={14} />
                        <span className="truncate">{job.workArrangement}</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-white/60">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Compensation Estimate</span>
                    <span className="text-xl font-black text-foreground tracking-tight">
                        <span className="text-brand-primary mr-1">{job.currencyCode}</span>
                        {formatMoney(job.salaryMin)} - {formatMoney(job.salaryMax)}
                    </span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-xl shadow-brand-primary/25 transition-all group-hover:scale-110 group-hover:rotate-6">
                    <ArrowUpRight size={28} strokeWidth={2.5} />
                </div>
            </div>
        </article>
    );
};
