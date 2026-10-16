import { AlertTriangle, Loader2 } from "lucide-react";

import type { JobSummaryModalProps } from "../Jobs.type";

import {
    countryOptions,
    currencyOptions,
    timezoneOptions,
    workArrangementOptions,
    JOB_FORM_LIMITS,
    toDigitsOnly,
} from "../Jobs.type";
import { SelectField as Select } from "@/components/ui/select-field";

export const JobSummaryModal = ({
    modal,
    loadingMessage,
    editingDetail,
    editDetailTitleMap,
    detailError,
    detailDraft,
    isSaving,
    isGeneratingDescription,
    onClose,
    onConfirmLeave,
    onRequestDraftCancel,
    onCancelDraft,
    onSubmit,
    onDetailDraftChange,
    onSaveSingleDetail,
}: JobSummaryModalProps) => {
    if (!modal) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[4px]"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[400px] rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {modal === "loading" ? (
                    <div className="text-center py-4">
                        <div className="mb-6 flex justify-center">
                            <Loader2
                                className="animate-spin text-brand-primary"
                                size={40}
                            />
                        </div>
                        <p className="text-lg font-bold text-foreground">
                            {loadingMessage}
                        </p>
                    </div>
                ) : modal === "details" ? (
                    <div>
                        <h3 className="mb-6 text-2xl font-black tracking-tight">
                            {editingDetail
                                ? editDetailTitleMap[editingDetail]
                                : "Edit detail"}
                        </h3>

                        {detailError && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 animate-in shake-1">
                                {detailError}
                            </div>
                        )}

                        <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-1">
                            {editingDetail === "title" && (
                                <div>
                                    <label className="mb-2 block text-[13px] font-bold text-foreground/80">
                                        Role title
                                    </label>
                                    <input
                                        type="text"
                                        value={detailDraft.title ?? ""}
                                        onChange={(e) =>
                                            onDetailDraftChange(
                                                "title",
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                        placeholder="e.g. Senior Frontend Engineer"
                                    />
                                </div>
                            )}

                            {editingDetail === "employmentType" && (
                                <Select
                                    label="Employment type"
                                    value={detailDraft.employmentType ?? ""}
                                    onValueChange={(val) =>
                                        onDetailDraftChange(
                                            "employmentType",
                                            val,
                                        )
                                    }
                                    options={[
                                        { label: "Full Time", value: "FullTime" },
                                        { label: "Part Time", value: "PartTime" },
                                        { label: "Contract", value: "Contract" },
                                        { label: "Internship", value: "Internship" },
                                    ]}
                                />
                            )}

                            {editingDetail === "workLocation" && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-3 block text-[13px] font-bold text-foreground/80">
                                            Work arrangement
                                        </label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {workArrangementOptions.map(
                                                (option) => (
                                                    <label
                                                        key={option.value}
                                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${
                                                            detailDraft.workArrangement ===
                                                            option.value
                                                                ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                                                : "border-border hover:bg-muted/50 text-muted-foreground"
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="workArrangementEdit"
                                                            className="h-4 w-4 accent-brand-primary"
                                                            checked={
                                                                detailDraft.workArrangement ===
                                                                option.value
                                                            }
                                                            onChange={() =>
                                                                onDetailDraftChange(
                                                                    "workArrangement",
                                                                    option.value,
                                                                )
                                                            }
                                                        />
                                                        {option.label}
                                                    </label>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {detailDraft.workArrangement ===
                                        "Remote" && (
                                        <Select
                                            label="Required timezone"
                                            value={detailDraft.timezone ?? ""}
                                            onValueChange={(val) =>
                                                onDetailDraftChange(
                                                    "timezone",
                                                    val,
                                                )
                                            }
                                            options={timezoneOptions.map(tz => ({ label: tz, value: tz }))}
                                        />
                                    )}

                                    {(detailDraft.workArrangement ===
                                        "Hybrid" ||
                                        detailDraft.workArrangement ===
                                            "Onsite") && (
                                        <>
                                            <Select
                                                label="Country"
                                                value={detailDraft.countryCode ?? ""}
                                                onValueChange={(val) =>
                                                    onDetailDraftChange(
                                                        "countryCode",
                                                        val,
                                                    )
                                                }
                                                options={countryOptions.map(c => ({ label: c.name, value: c.code }))}
                                            />
                                            <div>
                                                <label className="mb-2 block text-[13px] font-bold text-foreground/80">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength={120}
                                                    value={detailDraft.city ?? ""}
                                                    onChange={(e) =>
                                                        onDetailDraftChange(
                                                            "city",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                                    placeholder="e.g. Dhaka"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {editingDetail === "experienceLevel" && (
                                <Select
                                    label="Experience level"
                                    value={detailDraft.experienceLevel ?? ""}
                                    onValueChange={(val) =>
                                        onDetailDraftChange(
                                            "experienceLevel",
                                            val,
                                        )
                                    }
                                    options={[
                                        { label: "Junior", value: "Junior" },
                                        { label: "Mid Level", value: "MidLevel" },
                                        { label: "Senior", value: "Senior" },
                                        { label: "Lead / Principal", value: "LeadPrincipal" },
                                    ]}
                                />
                            )}

                            {editingDetail === "experienceRange" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-[13px] font-bold text-foreground/80">
                                            Min years
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={JOB_FORM_LIMITS.experienceMax}
                                            value={
                                                detailDraft.experienceMinYears ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                onDetailDraftChange(
                                                    "experienceMinYears",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                            placeholder="Min"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[13px] font-bold text-foreground/80">
                                            Max years
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={JOB_FORM_LIMITS.experienceMax}
                                            value={
                                                detailDraft.experienceMaxYears ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                onDetailDraftChange(
                                                    "experienceMaxYears",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            )}

                            {editingDetail === "salary" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-2 block text-[13px] font-bold text-foreground/80">
                                                Min salary
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={detailDraft.salaryMin ?? ""}
                                                onChange={(e) => {
                                                    const raw = toDigitsOnly(
                                                        e.target.value,
                                                    );
                                                    onDetailDraftChange(
                                                        "salaryMin",
                                                        raw,
                                                    );
                                                }}
                                                className="h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                                placeholder="Min"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[13px] font-bold text-foreground/80">
                                                Max salary
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={detailDraft.salaryMax ?? ""}
                                                onChange={(e) => {
                                                    const raw = toDigitsOnly(
                                                        e.target.value,
                                                    );
                                                    onDetailDraftChange(
                                                        "salaryMax",
                                                        raw,
                                                    );
                                                }}
                                                className="h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                    <Select
                                        label="Currency code"
                                        value={detailDraft.currencyCode ?? ""}
                                        onValueChange={(val) =>
                                            onDetailDraftChange(
                                                "currencyCode",
                                                val,
                                            )
                                        }
                                        options={currencyOptions.map(c => ({ label: c, value: c }))}
                                    />
                                </div>
                            )}

                            {editingDetail === "numberOfPositions" && (
                                <div>
                                    <label className="mb-2 block text-[13px] font-bold text-foreground/80">
                                        Number of positions
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={
                                            detailDraft.numberOfPositions ?? ""
                                        }
                                        onChange={(e) => {
                                            const raw = toDigitsOnly(
                                                e.target.value,
                                            );
                                            if (!raw) {
                                                onDetailDraftChange(
                                                    "numberOfPositions",
                                                    "",
                                                );
                                                return;
                                            }
                                            const bounded = Math.min(
                                                Math.max(
                                                    Number.parseInt(raw, 10),
                                                    JOB_FORM_LIMITS.positionsMin,
                                                ),
                                                JOB_FORM_LIMITS.positionsMax,
                                            );
                                            onDetailDraftChange(
                                                "numberOfPositions",
                                                String(bounded),
                                            );
                                        }}
                                        className="h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                        placeholder="Positions"
                                    />
                                </div>
                            )}

                            {editingDetail === "applicationDeadline" && (
                                <div>
                                    <label className="mb-2 block text-[13px] font-bold text-foreground/80">
                                        Application deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            detailDraft.applicationDeadline ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            onDetailDraftChange(
                                                "applicationDeadline",
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                type="button"
                                className="h-12 flex-1 rounded-2xl border border-border bg-white text-sm font-black transition-all hover:bg-muted/50 active:scale-[0.98]"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="h-12 flex-1 rounded-2xl bg-brand-primary text-sm font-black text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-hover active:scale-[0.98]"
                                onClick={onSaveSingleDetail}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : modal === "leave" ? (
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                            <AlertTriangle size={30} />
                        </div>
                        <h3 className="mb-2 text-2xl font-black tracking-tight">
                            Discard unsaved work?
                        </h3>
                        <p className="mb-8 text-sm font-medium text-muted-foreground leading-relaxed">
                            If you leave now, you will be prompted to save this job as a draft to prevent losing your progress.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="h-12 flex-1 rounded-2xl border border-border bg-white text-sm font-black transition-all hover:bg-muted/50 active:scale-[0.98]"
                                onClick={onClose}
                            >
                                No, stay
                            </button>
                            <button
                                type="button"
                                className="h-12 flex-1 rounded-2xl bg-amber-600 text-sm font-black text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-700 active:scale-[0.98]"
                                onClick={onConfirmLeave}
                            >
                                Yes, leave
                            </button>
                        </div>
                    </div>
                ) : modal === "draftWarning" ? (
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/5 text-destructive">
                            <AlertTriangle size={30} />
                        </div>
                        <h3 className="mb-2 text-2xl font-black tracking-tight text-destructive">
                            Lose everything?
                        </h3>
                        <p className="mb-8 text-sm font-medium text-muted-foreground leading-relaxed">
                            Unsaved changes will be permanently lost. We recommend saving as a draft to resume later.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                className="h-12 w-full rounded-2xl bg-brand-primary text-sm font-black text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-hover active:scale-[0.98]"
                                onClick={() => onSubmit("draft")}
                                disabled={isSaving || isGeneratingDescription}
                            >
                                {isSaving ? "Saving..." : "Save as Draft"}
                            </button>
                            <button
                                type="button"
                                className="h-12 w-full rounded-2xl border border-border bg-white text-sm font-black transition-all hover:bg-muted/50 active:scale-[0.98]"
                                onClick={onClose}
                            >
                                Keep Editing
                            </button>
                            <button
                                type="button"
                                className="h-12 w-full rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/5 transition-all"
                                onClick={onCancelDraft}
                            >
                                Discard & Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${modal === 'publish' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-muted text-muted-foreground'}`}>
                            {modal === "publish" ? <Sparkles size={30} /> : <Loader2 size={30} className={isSaving ? 'animate-spin' : ''} />}
                        </div>
                        <h3 className="mb-2 text-2xl font-black tracking-tight">
                            {modal === "draft"
                                ? "Save to Drafts?"
                                : "Ready to Publish?"}
                        </h3>
                        <p className="mb-8 text-sm font-medium text-muted-foreground leading-relaxed">
                            {modal === "draft" 
                                ? "Your progress will be saved so you can finish this job posting later." 
                                : "Your job posting will go live immediately and become visible to all talents."}
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="h-12 flex-1 rounded-2xl border border-border bg-white text-sm font-black transition-all hover:bg-muted/50 active:scale-[0.98]"
                                onClick={() => {
                                    if (modal === "draft") {
                                        onRequestDraftCancel();
                                        return;
                                    }
                                    onClose();
                                }}
                            >
                                No
                            </button>
                            <button
                                type="button"
                                className="h-12 flex-1 rounded-2xl bg-brand-primary text-sm font-black text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-hover active:scale-[0.98]"
                                disabled={isSaving || isGeneratingDescription}
                                onClick={() => onSubmit(modal)}
                            >
                                {isSaving ? "Saving..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for consistency
const Sparkles = ({ size }: { size: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
);
