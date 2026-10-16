import { useRef, useEffect } from "react";
import { IGenerateJobDescriptionRequest, ExperienceLevelValue, toDigitsOnly } from "../../Jobs.type";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type EmploymentType = IGenerateJobDescriptionRequest["employmentType"];

interface StepRoleDetailsProps {
    form: {
        title: string;
        employmentType: EmploymentType | "";
        experienceLevel: ExperienceLevelValue | "";
        experienceMinYears: string;
        experienceMaxYears: string;
    };
    update: (partial: any) => void;
    errors: Record<string, string>;
}

export const StepRoleDetails = ({ form, update, errors }: StepRoleDetailsProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const employmentTypeRef = useRef<HTMLButtonElement>(null);
    const experienceLevelRef = useRef<HTMLButtonElement>(null);
    const minYearsRef = useRef<HTMLInputElement>(null);
    const maxYearsRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            const firstError = errorKeys[0];
            if (firstError === "title") titleRef.current?.focus();
            else if (firstError === "employmentType") employmentTypeRef.current?.focus();
            else if (firstError === "experienceLevel") experienceLevelRef.current?.focus();
            else if (firstError === "experienceMinYears") minYearsRef.current?.focus();
            else if (firstError === "experienceMaxYears") maxYearsRef.current?.focus();
            else if (firstError === "experienceRange") minYearsRef.current?.focus();
        }
    }, [errors]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="title">
                    Role Title <span className="text-red-500">*</span>
                </label>
                <input
                    id="title"
                    ref={titleRef}
                    type="text"
                    className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all ${errors.title ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                    placeholder="e.g. Senior Product Designer"
                    value={form.title}
                    onChange={(e) => update({ title: e.target.value })}
                />
                {errors.title && <p className="text-xs font-bold text-red-600">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="employmentType">
                        Employment <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={form.employmentType}
                        onValueChange={(val) => update({ employmentType: val as EmploymentType })}
                    >
                        <SelectTrigger 
                            ref={employmentTypeRef}
                            className={`!h-12 w-full rounded-xl border bg-white px-4 py-0 text-sm font-bold outline-none transition-all ${errors.employmentType ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                        >
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FullTime">Full-time</SelectItem>
                            <SelectItem value="PartTime">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.employmentType && <p className="text-xs font-bold text-red-600">{errors.employmentType}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="experienceLevel">
                        Seniority <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={form.experienceLevel}
                        onValueChange={(val) => update({ experienceLevel: val as ExperienceLevelValue })}
                    >
                        <SelectTrigger 
                            ref={experienceLevelRef}
                            className={`!h-12 w-full rounded-xl border bg-white px-4 py-0 text-sm font-bold outline-none transition-all ${errors.experienceLevel ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                        >
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="MidLevel">Mid-level</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="LeadPrincipal">Lead / Principal</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.experienceLevel && <p className="text-xs font-bold text-red-600">{errors.experienceLevel}</p>}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                    Experience Range (Years) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <input
                            ref={minYearsRef}
                            type="text"
                            inputMode="numeric"
                            className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all ${errors.experienceMinYears ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                            placeholder="Min"
                            value={form.experienceMinYears}
                            onChange={(e) => update({ experienceMinYears: toDigitsOnly(e.target.value) })}
                        />
                        {errors.experienceMinYears && <p className="text-xs font-bold text-red-600">{errors.experienceMinYears}</p>}
                    </div>
                    <div className="space-y-2">
                        <input
                            ref={maxYearsRef}
                            type="text"
                            inputMode="numeric"
                            className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all ${errors.experienceMaxYears ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                            placeholder="Max"
                            value={form.experienceMaxYears}
                            onChange={(e) => update({ experienceMaxYears: toDigitsOnly(e.target.value) })}
                        />
                        {errors.experienceMaxYears && <p className="text-xs font-bold text-red-600">{errors.experienceMaxYears}</p>}
                    </div>
                </div>
                {errors.experienceRange && <p className="text-xs font-bold text-red-600">{errors.experienceRange}</p>}
            </div>
        </div>
    );
};
