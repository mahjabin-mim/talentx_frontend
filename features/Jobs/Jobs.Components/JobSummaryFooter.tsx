import type { JobSummaryFooterProps } from "../Jobs.type";
import { Save, Rocket, Sparkles } from "lucide-react";

export const JobSummaryFooter = ({
    isEditMode,
    isSaving,
    isGeneratingDescription,
    originalStatus,
    onDraft,
    onPublish,
    onSaveChanges,
}: JobSummaryFooterProps) => {
    const isLoading = isSaving || isGeneratingDescription;

    return (
        <div className="flex items-center justify-end gap-4 pt-8">
            {isEditMode ? (
                <>
                    {originalStatus === "Draft" ? (
                        <>
                            <button
                                type="button"
                                onClick={onDraft}
                                disabled={isLoading}
                                className="flex h-14 items-center gap-2 rounded-2xl border border-white/40 bg-white/60 px-6 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-white hover:shadow-lg disabled:opacity-50"
                            >
                                <Save size={18} className="text-brand-primary" />
                                Update Draft
                            </button>
                            <button
                                type="button"
                                onClick={onPublish}
                                disabled={isLoading}
                                className="group flex h-14 items-center gap-2 rounded-2xl bg-brand-primary px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/25 transition-all hover:scale-[1.02] hover:bg-brand-hover active:scale-[0.98] disabled:opacity-50"
                            >
                                <Rocket size={18} />
                                Launch Post
                                <Sparkles size={18} className="transition-transform group-hover:scale-125 group-hover:rotate-12" />
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={onSaveChanges}
                            disabled={isLoading}
                            className="flex h-14 items-center gap-2 rounded-2xl bg-brand-primary px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/25 transition-all hover:scale-[1.02] hover:bg-brand-hover active:scale-[0.98] disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isSaving ? "Syncing..." : "Sync Changes"}
                        </button>
                    )}
                </>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={onDraft}
                        disabled={isLoading}
                        className="flex h-14 items-center gap-2 rounded-2xl border border-white/40 bg-white/60 px-6 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-white hover:shadow-lg disabled:opacity-50"
                    >
                        <Save size={18} className="text-brand-primary" />
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={onPublish}
                        disabled={isLoading}
                        className="group flex h-14 items-center gap-2 rounded-2xl bg-brand-primary px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/25 transition-all hover:scale-[1.02] hover:bg-brand-hover active:scale-[0.98] disabled:opacity-50"
                    >
                        <Rocket size={18} />
                        Launch Post
                        <Sparkles size={18} className="transition-transform group-hover:scale-125 group-hover:rotate-12" />
                    </button>
                </>
            )}
        </div>
    );
};
