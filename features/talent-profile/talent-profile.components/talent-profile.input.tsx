import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = {
    label: React.ReactNode;
    placeholder?: string;
    type?: string;
    helperText?: string;
    errorText?: string;
    required?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    className?: string;
} & Omit<React.ComponentPropsWithoutRef<"input">, "className">;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        label,
        placeholder,
        type = "text",
        helperText,
        errorText,
        required = false,
        disabled = false,
        invalid = false,
        className,
        ...inputProps
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
            <input
                ref={ref}
                type={type}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                {...inputProps}
                className={cn(
                    "h-12 w-full rounded-xl border border-border bg-white px-4 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:bg-muted/30 disabled:text-muted-foreground",
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
});

export default Input;
