import { Sparkles, Target, Users, Zap } from "lucide-react";
import { Container } from "@/components/ui/container";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-mesh-gradient">
            <Container className="pb-32 pt-24 md:pt-32" aria-label="Main content">
                {/* HERO SECTION */}
                <section className="text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-4 py-1.5">
                        <Sparkles size={16} className="text-brand-primary" />
                        <span className="text-xs font-black uppercase tracking-widest text-brand-primary">
                            Our Story
                        </span>
                    </div>
                    <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[1.1] tracking-tight md:text-7xl">
                        We are redefining the 
                        <span className="text-gradient block">talent ecosystem.</span>
                    </h1>
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                        TalentX was born out of a simple observation: the current hiring process is broken. 
                        It&apos;s too slow, too noisy, and lacks the human context needed for long-term success.
                    </p>
                </section>

                {/* VISION CARDS */}
                <section className="mt-24 grid gap-8 md:grid-cols-3">
                    <div className="rounded-[2.5rem] border border-border bg-white p-10 shadow-sm transition-all hover:shadow-xl">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                            <Target size={28} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground">Intelligent Matching</h3>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            We don&apos;t just match keywords. Our AI understands the context of a candidate&apos;s 
                            career path and the specific needs of a company&apos;s culture.
                        </p>
                    </div>

                    <div className="rounded-[2.5rem] border border-border bg-white p-10 shadow-sm transition-all hover:shadow-xl">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-ai-glow/10 text-ai-glow">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground">Efficiency First</h3>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            By automating the initial screening with high precision, we allow 
                            recruiters to focus on what they do best: building human relationships.
                        </p>
                    </div>

                    <div className="rounded-[2.5rem] border border-border bg-white p-10 shadow-sm transition-all hover:shadow-xl">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <Users size={28} />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground">Human Centric</h3>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            At the end of every data point is a human being. We ensure the technology 
                            serves the person, not the other way around.
                        </p>
                    </div>
                </section>

                {/* MISSION STATEMENT */}
                <section className="mt-32 rounded-[3rem] border border-white/40 bg-white/30 p-12 backdrop-blur-xl md:p-24 text-center">
                    <h2 className="text-4xl font-black tracking-tight md:text-5xl">Our Mission</h2>
                    <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground italic">
                        &quot;To bridge the gap between world-class talent and visionary companies through 
                        intelligent context-aware matching, creating a future where every professional 
                        finds their perfect role and every company finds their perfect fit.&quot;
                    </p>
                </section>
            </Container>
        </div>
    );
}
