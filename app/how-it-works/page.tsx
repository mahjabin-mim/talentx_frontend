import { 
    Users, 
    FileUp, 
    Cpu, 
    Briefcase, 
    CheckCircle, 
    Send,
    Rocket,
    Zap
} from "lucide-react";
import { Container } from "@/components/ui/container";

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-mesh-gradient">
            <Container className="pb-32 pt-24 md:pt-32" aria-label="Main content">
                <header className="text-center mb-20">
                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        How <span className="text-gradient">TalentX</span> Works
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                        A seamless, AI-driven experience designed to get the right people into the right roles faster than ever.
                    </p>
                </header>

                <div className="grid gap-16 lg:grid-cols-2">
                    {/* FOR TALENTS */}
                    <section>
                        <div className="mb-10 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg">
                                <Briefcase size={24} />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">For Talents</h2>
                        </div>
                        
                        <div className="space-y-12">
                            <Step 
                                number="01" 
                                title="Upload your Resume" 
                                description="Our AI instantly parses your experience, skills, and career trajectory. No more tedious manual entry."
                                icon={<FileUp className="text-brand-primary" />}
                            />
                            <Step 
                                number="02" 
                                title="AI Skill Analysis" 
                                description="Our engine identifies hidden strengths and suggests improvements to your profile for better matching."
                                icon={<Cpu className="text-ai-glow" />}
                            />
                            <Step 
                                number="03" 
                                title="One-Click Apply" 
                                description="Get matched with roles that actually fit your profile. Apply to multiple positions with a single click."
                                icon={<Send className="text-emerald-500" />}
                            />
                        </div>
                    </section>

                    {/* FOR EMPLOYERS */}
                    <section>
                        <div className="mb-10 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ai-glow text-white shadow-lg">
                                <Users size={24} />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">For Employers</h2>
                        </div>

                        <div className="space-y-12">
                            <Step 
                                number="01" 
                                title="Define your Role" 
                                description="Use our AI wizard to generate comprehensive job descriptions that attract the right quality of talent."
                                icon={<Rocket className="text-brand-primary" />}
                            />
                            <Step 
                                number="02" 
                                title="Automated Screening" 
                                description="Sit back as our AI ranks applicants based on deep context, not just keyword density."
                                icon={<Zap className="text-ai-glow" />}
                            />
                            <Step 
                                number="03" 
                                title="Hire the Best" 
                                description="Access a curated shortlist of the top 1% of candidates who are a perfect fit for your team."
                                icon={<CheckCircle className="text-emerald-500" />}
                            />
                        </div>
                    </section>
                </div>
            </Container>
        </div>
    );
}

const Step = ({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) => (
    <div className="relative flex gap-6 group">
        <div className="flex-shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white text-xl font-black shadow-sm transition-all group-hover:border-brand-primary/30 group-hover:shadow-md">
                {icon}
            </div>
            <div className="absolute left-7 top-14 h-full w-[1px] bg-border last:hidden" />
        </div>
        <div>
            <span className="text-xs font-black uppercase tracking-widest text-brand-primary/60">{number}</span>
            <h3 className="mt-1 text-xl font-black tracking-tight text-foreground">{title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
        </div>
    </div>
);
