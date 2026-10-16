import { Pencil, Info, MapPin, DollarSign, Briefcase, GraduationCap, Users, CalendarClock, Globe } from "lucide-react";

import type { JobSummaryDetailsSectionProps, JobSummaryEditableDetail } from "../Jobs.type";

export const JobSummaryDetailsSection = ({
    detailRows,
    onEdit,
}: JobSummaryDetailsSectionProps) => {
    
    // Mapping keys to relevant icons for a better UI
    const getIcon = (key: JobSummaryEditableDetail) => {
        switch (key) {
            case "title": return <Briefcase size={18} />;
            case "employmentType": return <Globe size={18} />;
            case "workLocation": return <MapPin size={18} />;
            case "experienceLevel": return <GraduationCap size={18} />;
            case "experienceRange": return <Users size={18} />;
            case "salary": return <DollarSign size={18} />;
            case "numberOfPositions": return <Users size={18} />;
            case "applicationDeadline": return <CalendarClock size={18} />;
            default: return <Info size={18} />;
        }
    };

    return (
        <section className="overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/40 p-8 shadow-lg backdrop-blur-md ring-1 ring-black/5">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary shadow-inner">
                    <Info size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-black tracking-tight text-foreground uppercase">
                        Core Job Details
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Verify the structural metadata of your role</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {detailRows.map((row) => (
                    <div
                        key={row.label}
                        className="group relative flex items-start gap-4 rounded-[2rem] border border-white/80 bg-white/50 p-5 shadow-sm transition-all hover:border-brand-primary/40 hover:bg-white/70 hover:shadow-2xl ring-1 ring-black/5"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white shadow-sm">
                            {getIcon(row.key)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                                {row.label}
                            </p>
                            <p className="text-sm font-black text-foreground tracking-tight leading-snug truncate">
                                {row.value}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onEdit(row.key)}
                            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-primary opacity-0 shadow-xl transition-all hover:scale-110 group-hover:opacity-100 border border-brand-primary/20"
                            aria-label={`Edit ${row.label}`}
                            title={`Edit ${row.label}`}
                        >
                            <Pencil size={12} strokeWidth={2.5} />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};
