import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = {
    label: string;
    placeholder?: string;
    helperText?: string;
    errorText?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    rows?: number;
    className?: string;
} & Omit<React.ComponentPropsWithoutRef<"textarea">, "className">;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    function Textarea(
        {
            label,
            placeholder,
            helperText,
            errorText,
            required = false,
            disabled = false,
            invalid = false,
            rows = 4,
            className,
            ...textareaProps
        },
        ref,
    ) {
        return (
            <div className={cn("space-y-2", className)}>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                    {label}
                    {required ? (
                        <span className="ml-1 text-destructive">*</span>
                    ) : null}
                </label>
                <textarea
                    ref={ref}
                    rows={rows}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    {...textareaProps}
                    className={cn(
                        "w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:bg-muted/30 disabled:text-muted-foreground",
                        invalid &&
                            "border-destructive focus:border-destructive focus:ring-destructive/20",
                    )}
                />
                {errorText ? (
                    <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                        {errorText}
                    </p>
                ) : null}
                {helperText ? (
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    },
);

export default Textarea;
