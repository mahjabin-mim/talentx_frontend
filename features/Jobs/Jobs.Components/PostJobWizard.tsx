"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { isValid, parseISO, startOfToday, isAfter } from "date-fns";

import {
    IGenerateJobDescriptionRequest,
    JOB_FORM_LIMITS,
    countryToCurrencyMap,
} from "../Jobs.type";

import { saveJobGenerationRequest } from "../JobGeneration.store";
import { useJobDescriptionDraftStore } from "../JobDescriptionDraft.store";

import { StepRoleDetails } from "./WizardSteps/StepRoleDetails";
import { StepLocationArrangement } from "./WizardSteps/StepLocationArrangement";
import { StepSalaryTimeline } from "./WizardSteps/StepSalaryTimeline";
import { StepDescriptionSkills } from "./WizardSteps/StepDescriptionSkills";

type EmploymentType = IGenerateJobDescriptionRequest["employmentType"];
type ExperienceLevel = IGenerateJobDescriptionRequest["experienceLevel"];
type WorkArrangement = IGenerateJobDescriptionRequest["workArrangement"];

type FormState = {
    title: string;
    employmentType: EmploymentType | "";
    experienceLevel: ExperienceLevel | "";
    experienceMinYears: string;
    experienceMaxYears: string;
    workArrangement: WorkArrangement | "";
    timezone: string;
    countryCode: string;
    city: string;
    currencyCode: string;
    salaryMin: string;
    salaryMax: string;
    numberOfPositions: string;
    applicationDeadline: string;
    description: string;
    responsibilities: string;
    skills: string[];
};

const totalSteps = 4;
const stepLabels = ["Role Info", "Location", "Budget", "Content"];

const isDeadlineInFuture = (dateValue: string): boolean => {
    if (!dateValue) return false;
    const selectedDate = parseISO(dateValue);
    if (!isValid(selectedDate)) return false;
    return isAfter(selectedDate, startOfToday());
};

export const PostJobWizard = () => {
    const router = useRouter();
    const resetJobDescriptionDraft = useJobDescriptionDraftStore((state) => state.reset);

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState<FormState>({
        title: "",
        employmentType: "",
        experienceLevel: "",
        experienceMinYears: "",
        experienceMaxYears: "",
        workArrangement: "",
        timezone: "",
        countryCode: "",
        city: "",
        currencyCode: "USD",
        salaryMin: "",
        salaryMax: "",
        numberOfPositions: "1",
        applicationDeadline: "",
        description: "",
        responsibilities: "",
        skills: [""],
    });

    const update = (partial: Partial<FormState>) => {
        setGeneralError(null);
        if (partial.countryCode) {
            const normalized = partial.countryCode.toUpperCase();
            const mappedCurrency = countryToCurrencyMap[normalized];
            setForm((prev) => ({ 
                ...prev, 
                ...partial, 
                countryCode: normalized,
                currencyCode: mappedCurrency ?? prev.currencyCode 
            }));
        } else {
            setForm((prev) => ({ ...prev, ...partial }));
        }
    };

    const validateStep = (step: number): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (step === 0) {
            if (!form.title.trim()) errors.title = "Job title is required.";
            if (!form.employmentType) errors.employmentType = "Select employment type.";
            if (!form.experienceLevel) errors.experienceLevel = "Select seniority.";
            if (!form.experienceMinYears) errors.experienceMinYears = "Required.";
            if (!form.experienceMaxYears) errors.experienceMaxYears = "Required.";
            
            if (form.experienceMinYears && form.experienceMaxYears) {
                const min = Number(form.experienceMinYears);
                const max = Number(form.experienceMaxYears);
                if (max < min) errors.experienceRange = "Max must be ≥ Min.";
                if (max > JOB_FORM_LIMITS.experienceMax) errors.experienceMaxYears = `Max is ${JOB_FORM_LIMITS.experienceMax}.`;
            }
        }
        if (step === 1) {
            if (!form.workArrangement) errors.workArrangement = "Select arrangement.";
            if (form.workArrangement === "Remote" && !form.timezone) errors.timezone = "Timezone required.";
            if ((form.workArrangement === "Hybrid" || form.workArrangement === "Onsite")) {
                if (!form.countryCode) errors.countryCode = "Country required.";
                if (!form.city) errors.city = "City required.";
            }
        }
        if (step === 2) {
            if (!form.salaryMin) errors.salaryMin = "Required.";
            if (!form.salaryMax) errors.salaryMax = "Required.";
            if (Number(form.salaryMax) < Number(form.salaryMin)) errors.salaryRange = "Max must be ≥ Min.";
            if (!form.applicationDeadline) errors.applicationDeadline = "Deadline required.";
            if (!isDeadlineInFuture(form.applicationDeadline)) errors.applicationDeadline = "Must be in future.";
        }
        if (step === 3) {
            if (!form.description.trim()) errors.description = "Description required.";
            if (!form.responsibilities.trim()) errors.responsibilities = "Responsibilities required.";
            
            const filledSkills = form.skills.filter(s => s.trim());
            if (filledSkills.length === 0) {
                errors.skills = "At least one skill required.";
            } else {
                const uniqueSkills = new Set(filledSkills.map(s => s.toLowerCase()));
                if (uniqueSkills.size !== filledSkills.length) {
                    errors.skills = "Skills must be unique.";
                }
            }
        }

        return errors;
    };

    const onNext = async () => {
        const errors = validateStep(currentStep);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        if (currentStep < totalSteps - 1) {
            setFieldErrors({});
            setCurrentStep((prev) => prev + 1);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: IGenerateJobDescriptionRequest = {
                ...form,
                experienceMinYears: Number(form.experienceMinYears),
                experienceMaxYears: Number(form.experienceMaxYears),
                salaryMin: Number(form.salaryMin),
                salaryMax: Number(form.salaryMax),
                numberOfPositions: Number(form.numberOfPositions),
                applicationDeadline: parseISO(form.applicationDeadline).toISOString(),
                skills: form.skills.filter(s => s.trim()),
                employmentType: form.employmentType as EmploymentType,
                workArrangement: form.workArrangement as WorkArrangement,
                experienceLevel: form.experienceLevel as ExperienceLevel,
            };

            saveJobGenerationRequest(payload);
            resetJobDescriptionDraft();
            router.push("/employer/jobs/summary");
        } catch {
            setGeneralError("Submission failed. Please check your data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onBack = () => {
        setFieldErrors({});
        if (currentStep === 0) {
            router.push("/employer/dashboard");
            return;
        }
        setCurrentStep((prev) => prev - 1);
    };

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground pb-32 pt-16">
            <main className="mx-auto max-w-[720px] px-6">
                
                {/* WIZARD HEADER */}
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1">
                            <Sparkles size={14} className="text-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                AI Job Architect
                            </span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Post a New <span className="text-gradient">Position</span></h1>
                    </div>
                    <button
                        onClick={() => router.push("/employer/dashboard")}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-border text-muted-foreground hover:text-foreground transition-all"
                    >
                        <X size={20} />
                    </button>
                </header>

                {/* PROGRESS TRACKER */}
                <div className="mb-12">
                    <div className="flex justify-between mb-4">
                        {stepLabels.map((label, idx) => (
                            <div key={label} className="flex flex-col items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all ${
                                    idx < currentStep ? "bg-emerald-500 text-white" :
                                    idx === currentStep ? "bg-brand-primary text-white ring-4 ring-brand-primary/20" :
                                    "bg-white border border-border text-muted-foreground"
                                }`}>
                                    {idx < currentStep ? "✓" : idx + 1}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                    idx === currentStep ? "text-brand-primary" : "text-muted-foreground/60"
                                }`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white border border-border">
                        <div 
                            className="absolute h-full bg-brand-primary transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* STEP CONTENT */}
                <div className="rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl md:p-12">
                    {generalError && (
                        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800 animate-in shake-1">
                            {generalError}
                        </div>
                    )}

                    {currentStep === 0 && <StepRoleDetails form={form} update={update} errors={fieldErrors} />}
                    {currentStep === 1 && <StepLocationArrangement form={form} update={update} errors={fieldErrors} />}
                    {currentStep === 2 && <StepSalaryTimeline form={form} update={update} errors={fieldErrors} />}
                    {currentStep === 3 && <StepDescriptionSkills form={form} update={update} errors={fieldErrors} />}
                </div>

                {/* NAVIGATION FOOTER */}
                <div className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-white/80 p-6 backdrop-blur-md">
                    <div className="mx-auto flex max-w-[720px] gap-4">
                        <button
                            onClick={onBack}
                            className="flex h-14 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-white text-base font-bold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
                        >
                            <ArrowLeft size={20} /> Back
                        </button>
                        <button
                            onClick={onNext}
                            disabled={isSubmitting}
                            className="flex h-14 flex-[2] cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-primary text-base font-bold text-white transition-all hover:bg-brand-hover hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {currentStep === totalSteps - 1 ? (
                                isSubmitting ? "Architecting..." : <>Review & Generate <Sparkles size={20} /></>
                            ) : (
                                <>Next Step <ArrowRight size={20} /></>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
