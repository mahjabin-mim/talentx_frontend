import { useRef, useEffect } from "react";
import { IGenerateJobDescriptionRequest, workArrangementOptions, timezoneOptions, countryOptions } from "../../Jobs.type";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type WorkArrangement = IGenerateJobDescriptionRequest["workArrangement"];

interface StepLocationArrangementProps {
    form: {
        workArrangement: WorkArrangement | "";
        timezone: string;
        countryCode: string;
        city: string;
    };
    update: (partial: any) => void;
    errors: Record<string, string>;
}

export const StepLocationArrangement = ({ form, update, errors }: StepLocationArrangementProps) => {
    const isRemote = form.workArrangement === "Remote";
    const isHybridOrOnsite = form.workArrangement === "Hybrid" || form.workArrangement === "Onsite";

    const timezoneRef = useRef<HTMLButtonElement>(null);
    const countryCodeRef = useRef<HTMLButtonElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            const firstError = errorKeys[0];
            if (firstError === "timezone") timezoneRef.current?.focus();
            else if (firstError === "countryCode") countryCodeRef.current?.focus();
            else if (firstError === "city") cityRef.current?.focus();
        }
    }, [errors]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                    Work Arrangement <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                    {workArrangementOptions.map((option) => (
                        <label
                            key={option.value}
                            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                                form.workArrangement === option.value
                                    ? "border-brand-primary bg-brand-primary/5 ring-4 ring-brand-primary/10"
                                    : "border-border hover:bg-muted/50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                                    form.workArrangement === option.value 
                                    ? "border-brand-primary bg-brand-primary" 
                                    : "border-muted-foreground/30"
                                }`}>
                                    {form.workArrangement === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
                                </div>
                                <span className={`text-sm font-bold ${form.workArrangement === option.value ? "text-brand-primary" : "text-foreground"}`}>
                                    {option.label}
                                </span>
                            </div>
                            <input
                                type="radio"
                                className="hidden"
                                name="workArrangement"
                                checked={form.workArrangement === option.value}
                                onChange={() => update({ workArrangement: option.value as WorkArrangement })}
                            />
                        </label>
                    ))}
                </div>
                {errors.workArrangement && <p className="text-xs font-bold text-red-600">{errors.workArrangement}</p>}
            </div>

            {isRemote && (
                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="timezone">
                        Required Timezone <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={form.timezone}
                        onValueChange={(val) => update({ timezone: val })}
                    >
                        <SelectTrigger 
                            ref={timezoneRef}
                            className={`!h-12 w-full rounded-xl border bg-white px-4 py-0 text-sm font-bold outline-none transition-all ${errors.timezone ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                        >
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            {timezoneOptions.map((tz) => (
                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.timezone && <p className="text-xs font-bold text-red-600">{errors.timezone}</p>}
                </div>
            )}

            {isHybridOrOnsite && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="country">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={form.countryCode}
                            onValueChange={(val) => update({ countryCode: val })}
                        >
                            <SelectTrigger 
                                ref={countryCodeRef}
                                className={`!h-12 w-full rounded-xl border bg-white px-4 py-0 text-sm font-bold outline-none transition-all ${errors.countryCode ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                            >
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countryOptions.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.countryCode && <p className="text-xs font-bold text-red-600">{errors.countryCode}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-muted-foreground" htmlFor="city">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="city"
                            ref={cityRef}
                            type="text"
                            className={`w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold outline-none transition-all ${errors.city ? 'border-red-500 ring-4 ring-red-500/10' : 'border-border focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'}`}
                            placeholder="e.g. Dhaka"
                            value={form.city}
                            onChange={(e) => update({ city: e.target.value })}
                        />
                        {errors.city && <p className="text-xs font-bold text-red-600">{errors.city}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};
