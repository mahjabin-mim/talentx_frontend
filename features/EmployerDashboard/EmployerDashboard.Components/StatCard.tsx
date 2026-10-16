import { ReactNode } from "react";
import { Briefcase, CheckCircle2, Users, XCircle } from "lucide-react";

type Tone = "blue" | "green" | "gray" | "purple";

interface StatCardProps {
    title: string;
    value: number;
    tone: Tone;
}

export const StatCard = ({ title, value, tone }: StatCardProps) => {
    const config: Record<Tone, { icon: ReactNode; color: string; bg: string }> = {
        blue: {
            icon: <Briefcase size={20} />,
            color: "text-brand-primary",
            bg: "bg-brand-primary/10",
        },
        green: {
            icon: <CheckCircle2 size={20} />,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
        },
        gray: {
            icon: <XCircle size={20} />,
            color: "text-slate-600",
            bg: "bg-slate-500/10",
        },
        purple: {
            icon: <Users size={20} />,
            color: "text-purple-600",
            bg: "bg-purple-500/10",
        },
    };

    const { icon, color, bg } = config[tone];

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all hover:border-brand-primary/30 hover:shadow-xl">
            <div className="relative z-10 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${color}`}>
                    {icon}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        {title}
                    </span>
                    <span className="text-3xl font-black tracking-tight text-foreground">
                        {value.toLocaleString()}
                    </span>
                </div>
            </div>
            
            {/* Subtle background decoration */}
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full ${bg} blur-2xl opacity-0 transition-opacity group-hover:opacity-100`} />
        </div>
    );
};
