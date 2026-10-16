"use client";

import Link from "next/link";
import { motion, useInView, Variants } from "framer-motion";
import {
    ArrowRight,
    Building2,
    Sparkles,
    Search,
    Zap,
    Target,
    BarChart3,
} from "lucide-react";
import { useRef } from "react";

import { Container } from "@/components/ui/container";

// --- WOW TEXT REVEAL COMPONENT ---
const RevealText = ({
    text,
    delay = 0,
    className = "",
}: {
    text: string;
    delay?: number;
    className?: string;
}) => {
    const letters = Array.from(text);
    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: delay * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: 90,
        },
    };

    return (
        <motion.span
            style={{ perspective: "1000px" }}
            className={`inline-block ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    className="inline-block whitespace-pre"
                >
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    );
};

// --- ANIMATED SECTION ---
const Section = ({
    children,
    title,
    subtitle,
}: {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-20%" });

    return (
        <section
            ref={ref}
            className="py-32 md:py-48 relative border-t border-brand-primary/5"
        >
            <div className="max-w-5xl mx-auto mb-20 text-center px-4">
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[1]">
                    {isInView && <RevealText text={title} />}
                </h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 40 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                    delay: 0.8,
                    duration: 1,
                    type: "spring",
                    bounce: 0.2,
                }}
            >
                {children}
            </motion.div>
        </section>
    );
};

export const HomePageView = () => {
    return (
        <div className="w-full bg-mesh-gradient text-foreground selection:bg-brand-primary/20 relative font-sans scroll-smooth">
            {/* HERO SECTION */}
            <section className="relative flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center py-20 overflow-hidden">
                <Container className="relative z-10 text-center pt-8 md:pt-12">
                    <div className="w-full space-y-12 md:space-y-16">
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                            >
                                <Sparkles size={14} className="text-ai-glow" />
                                <span>
                                    The Core Platform for AI-Native Recruitment
                                </span>
                            </motion.div>
                            <h1 className="text-4xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
                                <RevealText
                                    text="Hire faster."
                                    delay={0.2}
                                    className="block"
                                />
                                <RevealText
                                    text="Engage deeper."
                                    delay={0.6}
                                    className="text-brand-primary block"
                                />
                                <RevealText
                                    text="Impress better."
                                    delay={1.0}
                                    className="block"
                                />
                            </h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8, duration: 1 }}
                            className="w-full flex flex-col items-center"
                        >
                            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-2xl font-medium mb-16 px-4">
                                Evolve recruitment from a management task into a
                                strategic business function. TalentX uses{" "}
                                <span className="text-foreground font-bold">
                                    Conversion Design
                                </span>{" "}
                                and
                                <span className="text-foreground font-bold">
                                    {" "}
                                    MyTalent AI
                                </span>{" "}
                                to build talent experiences candidates love.
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto px-4">
                                <Link
                                    href="/jobs"
                                    className="group relative flex flex-col items-center justify-center text-center gap-8 rounded-[4rem] bg-white/40 border-2 border-white p-12 shadow-2xl backdrop-blur-2xl transition-all hover:bg-white/70 hover:scale-[1.02] active:scale-95"
                                >
                                    <div className="h-20 w-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                                        <Search size={40} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">
                                            Find Jobs
                                        </h3>
                                        <p className="text-base text-muted-foreground mt-4 font-medium max-w-xs mx-auto leading-relaxed">
                                            Discover opportunities that match
                                            your passion using our AI-driven
                                            discovery engine.
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-3 text-brand-primary font-black text-xl">
                                        Explore Roles{" "}
                                        <ArrowRight className="transition-transform group-hover:translate-x-4" />
                                    </div>
                                </Link>

                                <Link
                                    href="/register"
                                    className="group relative flex flex-col items-center justify-center text-center gap-8 rounded-[4rem] bg-white/40 border-2 border-white p-12 shadow-2xl backdrop-blur-2xl transition-all hover:bg-white/70 hover:scale-[1.02] active:scale-95"
                                >
                                    <div className="h-20 w-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-xl group-hover:-rotate-12 transition-transform duration-500">
                                        <Building2
                                            size={40}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">
                                            Post a Job
                                        </h3>
                                        <p className="text-base text-muted-foreground mt-4 font-medium max-w-xs mx-auto leading-relaxed">
                                            Scale your team with predictive
                                            offer management and AI-native
                                            employer branding.
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-3 text-brand-primary font-black text-xl">
                                        Post a Position{" "}
                                        <ArrowRight className="transition-transform group-hover:translate-x-4" />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            <Container className="relative z-10 px-6">
                {/* HOW IT WORKS SECTION */}
                <Section
                    title="Simple. Powerful. Precise."
                    subtitle="We've streamlined the connection between talent and vision."
                >
                    <div className="grid gap-12 lg:grid-cols-3 px-4">
                        {[
                            {
                                icon: <Search size={48} />,
                                title: "Analyze",
                                desc: "Our MyTalent AI looks beyond keywords to understand the core potential in every profile and project.",
                                color: "brand-primary",
                            },
                            {
                                icon: <Zap size={48} />,
                                title: "Connect",
                                desc: "Intelligent matching bridges the gap between world-class professionals and visionary companies.",
                                color: "ai-glow",
                            },
                            {
                                icon: <Sparkles size={48} />,
                                title: "Grow",
                                desc: "Skip the noise and focus on meaningful growth through verified opportunities and teams.",
                                color: "emerald-500",
                            },
                        ].map((card, i) => (
                            <motion.article
                                key={i}
                                whileHover={{ y: -15 }}
                                className="relative overflow-hidden rounded-[3rem] border-2 border-white bg-white/40 p-14 shadow-xl backdrop-blur-xl transition-all hover:bg-white hover:shadow-2xl"
                            >
                                <div
                                    className={`mb-10 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-${card.color}/10 text-${card.color} group-hover:scale-110 transition-transform duration-500`}
                                >
                                    {card.icon}
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-6 tracking-tight uppercase">
                                    {card.title}
                                </h3>
                                <p className="text-lg text-muted-foreground leading-relaxed font-medium italic opacity-80">
                                    "{card.desc}"
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </Section>
            </Container>

            {/* Background Grid Pattern */}
            <div
                className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 2px 2px, #5571a9 1px, transparent 0)",
                    backgroundSize: "80px 80px",
                }}
            />
        </div>
    );
};
