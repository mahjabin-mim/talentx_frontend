import { Search } from "lucide-react";

type SearchBarProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
};

export default function SearchBar({
    value,
    onChange,
    placeholder = "Search applied jobs...",
}: SearchBarProps) {
    return (
        <div className="relative w-full md:w-[380px]">
            <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                aria-label={placeholder}
                placeholder={placeholder}
                className="h-11 w-full rounded-xl border border-border bg-muted/30 pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
        </div>
    );
}
