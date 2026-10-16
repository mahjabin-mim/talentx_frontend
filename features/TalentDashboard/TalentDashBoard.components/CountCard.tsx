import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseBusiness, FileText, UsersRound } from "lucide-react";

type StatCardProps = {
    title: string;
    value: number | string;
    color?: "emerald" | "blue" | "purple";
};

const colorVariants = {
    emerald: {
        border: "border-emerald-200",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        iconWrap: "border-emerald-200 bg-emerald-100/60",
    },
    blue: {
        border: "border-blue-200",
        bg: "bg-sky-50",
        text: "text-sky-700",
        iconWrap: "border-blue-200 bg-blue-100/60",
    },
    purple: {
        border: "border-purple-200",
        bg: "bg-purple-50",
        text: "text-purple-700",
        iconWrap: "border-purple-200 bg-purple-100/60",
    },
};

export default function CountCard({
    title,
    value,
    color = "emerald",
}: StatCardProps) {
    const styles = colorVariants[color];
    const Icon =
        color === "blue"
            ? BriefcaseBusiness
            : color === "emerald"
              ? FileText
              : UsersRound;

    return (
        <Card
            className={`border ${styles.border} ${styles.bg} py-0 shadow-none ring-0`}
        >
            <CardContent className="px-5 py-5">
                <div className="flex items-center gap-4">
                    <div
                        className={`grid h-16 w-16 place-items-center rounded-full border ${styles.iconWrap}`}
                    >
                        <Icon className={styles.text} size={28} />
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${styles.text}`}>
                            {title}
                        </p>
                        <p className={`mt-2 text-3xl font-bold ${styles.text}`}>
                            {value}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
