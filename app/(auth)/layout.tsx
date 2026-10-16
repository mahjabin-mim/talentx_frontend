import { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-mesh-gradient">
            {/* LEFT SIDE: Brand & Visuals */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-primary p-12 text-white lg:flex">
                <div className="relative z-10">
                    <Link
                        href="/"
                        className="group text-2xl font-black tracking-tighter"
                    >
                        <span>Talent</span>
                        <span className="text-white transition-colors">
                            X
                        </span>
                    </Link>
                </div>

                <div className="relative z-10 mb-12">
                    <h2 className="text-5xl font-black leading-tight tracking-tight">
                        Hire the top 1% <br />
                        <span className="opacity-60">without the noise.</span>
                    </h2>
                    <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
                        Join 500+ companies using TalentX to find their most
                        critical hires with context-aware AI matching.
                    </p>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-ai-glow/20 blur-[120px]" />
                <div className="absolute top-1/2 -right-20 h-64 w-64 -translate-y-1/2 rounded-full bg-white/5 blur-[80px]" />
            </div>

            {/* RIGHT SIDE: Auth Form */}
            <div className="flex w-full items-center justify-center p-6 lg:w-1/2 lg:p-12">
                <div className="w-full max-w-[480px]">
                    <div className="mb-10 lg:hidden">
                        <Link
                            href="/"
                            className="text-2xl font-black tracking-tighter"
                        >
                            <span className="text-foreground">Talent</span>
                            <span className="text-brand-primary">X</span>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
