import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type StatusFilterProps<T extends string> = {
    options: readonly T[];
    value?: T;
    onChange?: (value: T) => void;
};

export default function StatusFilter<T extends string>({
    options,
    value,
    onChange,
}: StatusFilterProps<T>) {
    return (
        <Select
            value={value}
            onValueChange={(val) => onChange?.(val as T)}
        >
            <SelectTrigger 
                aria-label="Filter by status"
                className="!h-11 w-full md:w-[220px] rounded-xl border border-border bg-white px-4 py-0 text-sm font-bold outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm"
            >
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-border bg-white/80 backdrop-blur-xl shadow-2xl p-1">
                {options.map((status) => (
                    <SelectItem 
                        key={status} 
                        value={status}
                        className="rounded-xl text-sm font-bold text-muted-foreground focus:bg-brand-primary/10 focus:text-brand-primary transition-colors cursor-pointer"
                    >
                        {status}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
