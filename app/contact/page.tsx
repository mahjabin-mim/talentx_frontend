import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-mesh-gradient">
            <Container className="pb-32 pt-24 md:pt-32" aria-label="Main content">
                <header className="text-center mb-20">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-4 py-1.5">
                        <Sparkles size={16} className="text-brand-primary" />
                        <span className="text-xs font-black uppercase tracking-widest text-brand-primary">
                            Get in Touch
                        </span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Let&apos;s start a <span className="text-gradient">conversation.</span>
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have questions about our AI matching or need help with your account? Our team is here to support you.
                    </p>
                </header>

                <div className="grid gap-12 lg:grid-cols-5">
                    {/* CONTACT INFO */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-[2.5rem] border border-border bg-white p-10 shadow-sm">
                            <h2 className="text-2xl font-black tracking-tight mb-8">Contact Information</h2>
                            
                            <div className="space-y-8">
                                <ContactItem 
                                    icon={<Mail className="text-brand-primary" />} 
                                    title="Email Us" 
                                    value="hello@talentx.ai" 
                                />
                                <ContactItem 
                                    icon={<Phone className="text-ai-glow" />} 
                                    title="Call Us" 
                                    value="+1 (555) 000-0000" 
                                />
                                <ContactItem 
                                    icon={<MapPin className="text-emerald-500" />} 
                                    title="Visit Us" 
                                    value="123 AI Boulevard, Tech City, TC 94043" 
                                />
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-brand-primary p-10 text-white shadow-xl">
                            <h3 className="text-xl font-black">Support Hours</h3>
                            <p className="mt-4 text-brand-primary-foreground/80 leading-relaxed">
                                Our support team is available Monday through Friday, 9:00 AM to 6:00 PM EST.
                            </p>
                        </div>
                    </div>

                    {/* CONTACT FORM */}
                    <div className="lg:col-span-3">
                        <form className="rounded-[2.5rem] border border-border bg-white p-10 shadow-sm space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe"
                                        className="w-full h-12 px-4 rounded-xl border border-border bg-muted/20 outline-none focus:border-brand-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="john@example.com"
                                        className="w-full h-12 px-4 rounded-xl border border-border bg-muted/20 outline-none focus:border-brand-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Subject</label>
                                <Select defaultValue="General Inquiry">
                                    <SelectTrigger className="w-full h-12 px-4 rounded-xl border border-border bg-muted/20 outline-none focus:border-brand-primary transition-all">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                        <SelectItem value="Technical Support">Technical Support</SelectItem>
                                        <SelectItem value="Business Partnership">Business Partnership</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Message</label>
                                <textarea 
                                    rows={6}
                                    placeholder="How can we help you?"
                                    className="w-full p-4 rounded-xl border border-border bg-muted/20 outline-none focus:border-brand-primary transition-all resize-none"
                                />
                            </div>

                            <button className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-8 text-base font-black text-white shadow-lg transition-all hover:scale-[1.01] hover:bg-brand-hover active:scale-[0.99]">
                                Send Message <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
}

const ContactItem = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) => (
    <div className="flex gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-white shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{title}</p>
            <p className="text-lg font-bold text-foreground">{value}</p>
        </div>
    </div>
);
