import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SelectFieldProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
  error?: string
  className?: string
  triggerClassName?: string
}

export const SelectField = ({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  error,
  className,
  triggerClassName,
}: SelectFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="mb-2 block text-[13px] font-bold text-foreground/80">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "h-11 w-full rounded-xl border border-border px-4 py-2 text-sm font-medium outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10",
            error && "border-destructive focus:border-destructive focus:ring-destructive/10",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder || (label ? `Select ${label.toLowerCase()}` : "Select option")} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  )
}
