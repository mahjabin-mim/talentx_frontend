import { useRef, useEffect } from "react";
import { currencyOptions, toDigitsOnly } from "../../Jobs.type";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface StepSalaryTimelineProps {
    form: {
        currencyCode: string;
        salaryMin: string;
        salaryMax: string;
        numberOfPositions: string;
        applicationDeadline: string;
    };
    update: (partial: any) => void;
    errors: Record<string, string>;
}

export const StepSalaryTimeline = ({ form, update, errors }: StepSalaryTimelineProps) => {
    const salaryMinRef = useRef<HTMLInputElement>(null);
    const salaryMaxRef = useRef<HTMLInputElement>(null);
    const numberOfPositionsRef = useRef<HTMLInputElement>(null);
    const applicationDeadlineRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            const firstError = errorKeys[0];
            if (firstError === "salaryMin" || firstError === "salaryRange") salaryMinRef.current?.focus();
            else if (firstError === "salaryMax") salaryMaxRef.current?.focus();
            else if (firstError === "numberOfPositions") numberOfPositionsRef.current?.focus();
            else if (firstError === "applicationDeadline") applicationDeadlineRef.current?.focus();
        }
    }, [errors]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                    Monthly Salary Range <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="w-full sm:w-32">
                        <Select
                            value={form.currencyCode}
                            onValueChange={(val) => update({ currencyCode: val })}
                        >
                            <SelectTrigger className="!h-12 w-[120px] rounded-xl border border-border bg-white px-4 py-0 text-sm font-bold outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10">
                                <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencyOptions.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <input
                                ref={salaryMinRef}
                                type="text"
                                inputMode="numeric"
                                className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all ${errors.salaryMin ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                                placeholder="Min"
                                value={form.salaryMin}
                                onChange={(e) => update({ salaryMin: toDigitsOnly(e.target.value) })}
                            />
                            {errors.salaryMin && <p className="text-xs font-bold text-red-600">{errors.salaryMin}</p>}
                        </div>
                        <div className="space-y-2">
                            <input
                                ref={salaryMaxRef}
                                type="text"
                                inputMode="numeric"
                                className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all ${errors.salaryMax ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                                placeholder="Max"
                                value={form.salaryMax}
                                onChange={(e) => update({ salaryMax: toDigitsOnly(e.target.value) })}
                            />
                            {errors.salaryMax && <p className="text-xs font-bold text-red-600">{errors.salaryMax}</p>}
                        </div>
                    </div>
                </div>
                {errors.salaryRange && <p className="text-xs font-bold text-red-600">{errors.salaryRange}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="numberOfPositions">
                        Open Positions <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="numberOfPositions"
                        ref={numberOfPositionsRef}
                        type="text"
                        inputMode="numeric"
                        className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all ${errors.numberOfPositions ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                        value={form.numberOfPositions}
                        onChange={(e) => update({ numberOfPositions: toDigitsOnly(e.target.value) })}
                    />
                    {errors.numberOfPositions && <p className="text-xs font-bold text-red-600">{errors.numberOfPositions}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="applicationDeadline">
                        Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="applicationDeadline"
                        ref={applicationDeadlineRef}
                        type="date"
                        className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all ${errors.applicationDeadline ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                        value={form.applicationDeadline}
                        onChange={(e) => update({ applicationDeadline: e.target.value })}
                    />
                    {errors.applicationDeadline && <p className="text-xs font-bold text-red-600">{errors.applicationDeadline}</p>}
                </div>
            </div>
        </div>
    );
};
