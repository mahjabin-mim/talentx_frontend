import { Plus, Trash2, Cpu, CheckCircle2 } from "lucide-react";

import type { JobSummarySkillsSectionProps } from "../Jobs.type";

export const JobSummarySkillsSection = ({
    skills,
    skillsError,
    onAddSkill,
    onUpdateSkill,
    onRemoveSkill,
}: JobSummarySkillsSectionProps) => {
    return (
        <section className={`overflow-hidden rounded-[2.5rem] border bg-white/40 p-8 shadow-lg backdrop-blur-md ring-1 ring-black/5 transition-all ${
            skillsError 
                ? "border-red-500 ring-4 ring-red-500/10" 
                : "border-white/80"
        }`}>
            <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary shadow-inner">
                        <Cpu size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-foreground uppercase">
                            Required Expertise
                        </h3>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Define the core competencies</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onAddSkill}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg shadow-brand-primary/25 transition-all hover:scale-110 active:scale-95"
                    aria-label="Add skill"
                    title="Add skill"
                >
                    <Plus size={20} strokeWidth={2.5} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((skill) => (
                    <div key={skill.id} className="group flex items-center gap-3 rounded-[2rem] border border-white/80 bg-white/50 p-3 pr-4 shadow-sm transition-all focus-within:border-brand-primary/40 focus-within:bg-white/70 focus-within:shadow-lg ring-1 ring-black/5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary transition-colors group-focus-within:bg-brand-primary group-focus-within:text-white shadow-sm">
                            <CheckCircle2 size={16} />
                        </div>
                        <input
                            type="text"
                            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm font-black tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50 placeholder:font-medium"
                            placeholder="e.g. React"
                            value={skill.value}
                            onChange={(e) =>
                                onUpdateSkill(skill.id, e.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => onRemoveSkill(skill.id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive opacity-0 transition-all hover:bg-destructive hover:text-white group-hover:opacity-100 shadow-sm"
                            aria-label="Remove skill"
                            title="Remove skill"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {skillsError && (
                <p className="mt-4 text-sm font-bold text-red-600 animate-in shake-1">
                    {skillsError}
                </p>
            )}
        </section>
    );
};
