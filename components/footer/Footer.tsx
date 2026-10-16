"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Mail, Globe, BrainCircuit, Zap } from "lucide-react";
import { Container } from "@/components/ui/container";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-white/50 backdrop-blur-md">
            <Container className="py-16 md:py-24">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* BRAND SECTION */}
                    <div className="lg:col-span-1">
                        <Link
                            href="/"
                            className="group relative flex items-center gap-1 text-2xl font-black tracking-tighter mb-6"
                        >
                            <span className="text-foreground transition-colors group-hover:text-brand-primary">Talent</span>
                            <span className="relative text-brand-primary">
                                X
                                <motion.span 
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute -inset-1 blur-lg bg-ai-glow/20 -z-10 rounded-full"
                                />
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-muted-foreground max-w-[240px]">
                            The future of hiring is intelligent and human. 
                            Bridging the gap between visionaries and world-class talent.
                        </p>
                        <div className="mt-8 flex items-center gap-4">
                            <SocialLink href="#" label="LinkedIn">
                                <Image src="/icons/social/linkedin.svg" alt="LinkedIn" width={18} height={18} />
                            </SocialLink>
                            <SocialLink href="#" label="Facebook">
                                <Image src="/icons/social/facebook.svg" alt="Facebook" width={18} height={18} />
                            </SocialLink>
                            <SocialLink href="#" label="Website">
                                <Globe size={18} />
                            </SocialLink>
                            <SocialLink href="#" label="Email">
                                <Mail size={18} />
                            </SocialLink>
                        </div>
                    </div>

                    {/* LINKS SECTIONS */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
                        <FooterGroup title="Product">
                            <FooterLink href="/jobs">Browse Jobs</FooterLink>
                            <FooterLink href="/register">Post a Role</FooterLink>
                            <FooterLink href="/talent-dashboard">Talent Portal</FooterLink>
                            <FooterLink href="/employer/dashboard">Employer Hub</FooterLink>
                        </FooterGroup>

                        <FooterGroup title="Company">
                            <FooterLink href="/about">Our Story</FooterLink>
                            <FooterLink href="/how-it-works">How it Works</FooterLink>
                            <FooterLink href="/contact">Get in Touch</FooterLink>
                            <FooterLink href="#">Success Stories</FooterLink>
                        </FooterGroup>

                        <FooterGroup title="Legal">
                            <FooterLink href="#">Privacy Policy</FooterLink>
                            <FooterLink href="#">Terms of Service</FooterLink>
                            <FooterLink href="#">Cookie Policy</FooterLink>
                            <FooterLink href="#">Security</FooterLink>
                        </FooterGroup>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        &copy; {currentYear} TalentX Labs. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                            System Status: All systems go
                        </span>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

const FooterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            {title}
        </h3>
        <ul className="flex flex-col gap-3">
            {children}
        </ul>
    </div>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
        <Link 
            href={href} 
            className="text-sm font-bold text-foreground/70 transition-colors hover:text-brand-primary"
        >
            {children}
        </Link>
    </li>
);

const SocialLink = ({ href, children, label }: { href: string; children: React.ReactNode; label: string }) => (
    <a 
        href={href} 
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition-all hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary hover:shadow-md"
    >
        {children}
    </a>
);

export default Footer;
