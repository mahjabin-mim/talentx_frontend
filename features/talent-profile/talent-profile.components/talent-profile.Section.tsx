import { cn } from "@/lib/utils";

type SectionProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
};

export default function Section({ title, children, className, icon }: SectionProps) {
    return (
        <section
            className={cn(
                "space-y-6 rounded-3xl border border-border bg-white/50 p-6 shadow-sm backdrop-blur-sm md:p-8",
                className,
            )}
        >
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                {icon && <div className="text-brand-primary">{icon}</div>}
                <h2 className="text-lg font-black tracking-tight text-foreground">
                    {title}
                </h2>
            </div>
            <div className="space-y-5">
                {children}
            </div>
        </section>
    );
}
