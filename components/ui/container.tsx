import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Container = ({
    children,
    className,
    ...props
}: ContainerProps) => {
    return (
        <div
            className={cn("mx-auto w-full max-w-[1240px] px-6", className)}
            {...props}
        >
            {children}
        </div>
    );
};
