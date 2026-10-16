import { FileText, Sparkles } from "lucide-react";

import type { JobSummaryDescriptionSectionProps } from "../Jobs.type";

export const JobSummaryDescriptionSection = ({
    editableDescription,
    isGeneratingDescription,
    pageError,
    descriptionError,
    onDescriptionChange,
}: JobSummaryDescriptionSectionProps) => {
    return (
        <section className={`overflow-hidden rounded-[2.5rem] border bg-white/40 shadow-lg backdrop-blur-md ring-1 ring-black/5 transition-all ${
            descriptionError 
                ? "border-red-500 ring-4 ring-red-500/10" 
                : "border-white/80"
        }`}>
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/20">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary shadow-inner">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-foreground uppercase">
                            Job Description
                        </h3>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Review the AI-generated narrative</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-ai-glow/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-ai-glow border border-ai-glow/20">
                    <Sparkles size={12} />
                    AI Assisted
                </div>
            </div>
            
            <div className="p-8">
                <p className="mb-6 text-sm font-medium text-muted-foreground leading-relaxed">
                    Review and refine the AI-generated description. Ensure it accurately reflects your company's culture and the specific needs of the role.
                </p>

                {pageError && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 animate-in shake-1">
                        {pageError}
                    </div>
                )}

                <div className="relative group">
                    <textarea
                        className={`min-h-[320px] w-full resize-none rounded-[2rem] border bg-white/50 p-8 text-[15px] leading-relaxed text-foreground outline-none transition-all shadow-sm ring-1 ring-black/5 ${
                            descriptionError
                                ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
                                : "border-white/80 focus:border-brand-primary/40 focus:bg-white/80 focus:shadow-lg"
                        }`}
                        value={editableDescription}
                        disabled={isGeneratingDescription}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        placeholder={
                            isGeneratingDescription
                                ? "Magic is happening... Generating your job description."
                                : "The canvas is yours. Refine the details here."
                        }
                    />
                    {isGeneratingDescription && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-[2rem] bg-white/20 backdrop-blur-[2px]">
                            <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-xl ring-1 ring-black/5">
                                <div className="h-2 w-2 animate-bounce rounded-full bg-ai-glow [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 animate-bounce rounded-full bg-ai-glow [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 animate-bounce rounded-full bg-ai-glow"></div>
                                <span className="text-sm font-black text-ai-glow uppercase tracking-widest ml-2">Crafting Content</span>
                            </div>
                        </div>
                    )}
                </div>

                {descriptionError && (
                    <p className="mt-4 text-sm font-bold text-red-600 animate-in shake-1">
                        {descriptionError}
                    </p>
                )}
            </div>
        </section>
    );
};
