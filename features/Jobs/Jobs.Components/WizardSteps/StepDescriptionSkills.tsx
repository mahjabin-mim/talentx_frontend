import { useRef, useEffect } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";

interface StepDescriptionSkillsProps {
    form: {
        description: string;
        responsibilities: string;
        skills: string[];
    };
    update: (partial: any) => void;
    errors: Record<string, string>;
}

export const StepDescriptionSkills = ({ form, update, errors }: StepDescriptionSkillsProps) => {
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const responsibilitiesRef = useRef<HTMLTextAreaElement>(null);
    const skillsRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            const firstError = errorKeys[0];
            if (firstError === "description") descriptionRef.current?.focus();
            else if (firstError === "responsibilities") responsibilitiesRef.current?.focus();
            else if (firstError === "skills") skillsRef.current?.focus();
        }
    }, [errors]);

    const updateSkill = (index: number, value: string) => {
        update({
            skills: form.skills.map((skill, skillIndex) =>
                skillIndex === index ? value : skill,
            ),
        });
    };

    const addSkill = () => {
        update({ skills: ["", ...form.skills] });
    };

    const removeSkill = (index: number) => {
        update({
            skills:
                form.skills.length === 1
                    ? [""]
                    : form.skills.filter((_, skillIndex) => skillIndex !== index),
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="description">
                        Job Description <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5 rounded-full bg-ai-glow/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-ai-glow border border-ai-glow/20">
                        <Sparkles size={10} />
                        AI Refinement
                    </div>
                </div>
                <textarea
                    id="description"
                    ref={descriptionRef}
                    className={`min-h-[120px] w-full px-4 py-3 rounded-xl border bg-white text-sm font-bold leading-relaxed outline-none transition-all resize-y ${errors.description ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                    placeholder="Type a few rough sentences or key points about the role. Our AI will handle the professional phrasing for you..."
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                />
                <div className="flex items-start gap-2 text-[11px] font-medium text-muted-foreground/70 italic bg-ai-glow/5 p-2.5 rounded-lg border border-ai-glow/10">
                    <Sparkles size={12} className="text-ai-glow shrink-0 mt-0.5" />
                    <p>Don't worry about being perfect. Just provide the key details, and our AI will craft a polished, professional description for you in the next step.</p>
                </div>
                {errors.description && <p className="text-xs font-bold text-red-600">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="responsibilities">
                    Responsibilities <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="responsibilities"
                    ref={responsibilitiesRef}
                    className={`min-h-[120px] w-full px-4 py-3 rounded-xl border bg-white text-sm font-bold leading-relaxed outline-none transition-all resize-y ${errors.responsibilities ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                    placeholder="What will the candidate be doing on a daily basis?"
                    value={form.responsibilities}
                    onChange={(e) => update({ responsibilities: e.target.value })}
                />
                {errors.responsibilities && <p className="text-xs font-bold text-red-600">{errors.responsibilities}</p>}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                        Required Skills <span className="text-red-500">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={addSkill}
                        className="flex items-center gap-1.5 rounded-lg bg-brand-primary/10 px-3 py-1.5 text-xs font-black text-brand-primary transition-all hover:bg-brand-primary hover:text-white"
                    >
                        <Plus size={14} /> Add Skill
                    </button>
                </div>
                
                <div className="space-y-3">
                    {form.skills.map((skill, index) => (
                        <div key={index} className="group flex items-center gap-2 animate-in slide-in-from-left-2 duration-300">
                            <div className="relative flex-1">
                                <input
                                    ref={index === 0 ? skillsRef : null}
                                    type="text"
                                    className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10`}
                                    placeholder="e.g. TypeScript"
                                    value={skill}
                                    onChange={(e) => updateSkill(index, e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSkill(index)}
                                className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 opacity-60 transition-all hover:bg-red-500 hover:text-white hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                {errors.skills && <p className="text-xs font-bold text-red-600">{errors.skills}</p>}
            </div>
        </div>
    );
};
