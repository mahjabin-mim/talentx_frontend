import { X, Briefcase } from "lucide-react";

import type { JobSummaryHeaderProps } from "../Jobs.type";

export const JobSummaryHeader = ({
    isEditMode,
    onClose,
}: JobSummaryHeaderProps) => {
    return (
        <header className="mb-10 flex items-center justify-between border-b border-white/40 pb-6">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20">
                    <Briefcase size={24} />
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/60">
                        {isEditMode ? "Action Required" : "Final Step"}
                    </span>
                    <h1 className="text-2xl font-black tracking-tighter text-foreground">
                        {isEditMode ? "Edit Job Posting" : "Publish New Job"}
                    </h1>
                </div>
            </div>
            <button
                type="button"
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/40 text-muted-foreground transition-all hover:bg-white/60 hover:text-foreground hover:shadow-md backdrop-blur-sm border border-white/20"
                onClick={onClose}
            >
                <X size={20} />
            </button>
        </header>
    );
};
