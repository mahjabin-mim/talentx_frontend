"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "@/components/auth/logout-button";
import { NavbarConfig, NavItemVariant } from "./Navbar.types";
import {
    Bell,
    Briefcase,
    KeyRound,
    LogIn,
    UserCog,
    UserPlus,
    Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";

type Props = {
    config: NavbarConfig;
    isAuthenticated: boolean;
    userInitial: string;
};

export default function Navbar({
    config,
    isAuthenticated,
    userInitial,
}: Props) {
    const pathname = usePathname();
    const isTalentRoleMenu = config.profileHref === "/talent-profile";
    const hasValidProfileHref =
        Boolean(config.profileHref) && config.profileHref !== "#";
    const profileMenuLabel = isTalentRoleMenu ? "Edit Profile" : "Profile";
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setIsProfileMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-white/40 bg-white/70 backdrop-blur-xl">
            <Container className="flex h-20 items-center justify-between">
                {/* LEFT: LOGO & NAVIGATION */}
                <div className="flex items-center gap-12">
                    <Link
                        href="/"
                        className="group relative flex items-center gap-1 text-3xl font-black tracking-tighter"
                    >
                        <span className="text-foreground transition-colors group-hover:text-brand-primary">Talent</span>
                        <span className="relative text-brand-primary">
                            X
                            <motion.span 
                                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -inset-2 blur-xl bg-ai-glow/40 -z-10 rounded-full"
                            />
                        </span>
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-4"
                        >
                            <Sparkles size={12} className="text-ai-glow animate-pulse" />
                        </motion.div>
                    </Link>

                    <nav className="hidden items-center gap-10 lg:flex">
                        {config.left.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative text-sm font-black uppercase tracking-[0.15em] transition-colors hover:text-brand-primary ${
                                        isActive ? "text-brand-primary" : "text-muted-foreground/80"
                                    }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="nav-underline"
                                            className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-primary"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* RIGHT: ACTIONS & PROFILE */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        {config.right.map((item) => {
                            const isSecondary = item.variant === NavItemVariant.Secondary;
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group relative inline-flex h-11 items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-6 text-sm font-black transition-all active:scale-95 ${
                                        isSecondary 
                                            ? "bg-white border-2 border-brand-primary/10 text-brand-primary hover:border-brand-primary hover:shadow-xl hover:shadow-brand-primary/5" 
                                            : "bg-brand-primary text-white hover:bg-brand-hover hover:shadow-xl hover:shadow-brand-primary/20"
                                    }`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {item.label === "Find Jobs" && <Briefcase size={16} />}
                                        {item.label === "Post a Job" && <UserPlus size={16} />}
                                        {item.label === "Sign In" && <LogIn size={16} />}
                                        {item.label}
                                    </span>
                                    {isSecondary && (
                                        <motion.div 
                                            className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {config.showBell && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="relative grid h-11 w-11 place-items-center rounded-2xl border-2 border-brand-primary/10 bg-white text-muted-foreground transition-all hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-md"
                        >
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-ai-glow shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                        </motion.button>
                    )}

                    {config.showProfile && config.profileHref ? (
                        <div
                            className="flex items-center gap-3"
                            ref={profileMenuRef}
                        >
                            {isAuthenticated ? (
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                        className="relative h-11 w-11 overflow-hidden rounded-2xl border-2 border-brand-primary transition-all hover:shadow-xl cursor-pointer"
                                        aria-haspopup="menu"
                                        aria-expanded={isProfileMenuOpen}
                                    >
                                        <span className="grid h-full w-full items-center justify-center bg-brand-primary/5 text-sm font-black text-brand-primary uppercase">
                                            {userInitial}
                                        </span>
                                    </motion.button>

                                    <AnimatePresence>
                                        {isProfileMenuOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-64 origin-top-right rounded-[2.5rem] border border-white/60 bg-white/90 p-3 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 focus:outline-none"
                                            >
                                                <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 border-b border-brand-primary/5 mb-2">
                                                    Account Core
                                                </div>
                                                {hasValidProfileHref && (
                                                    <Link
                                                        href={config.profileHref!}
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                        className="flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-black text-foreground transition-all hover:bg-brand-primary/10 hover:text-brand-primary"
                                                    >
                                                        <UserCog size={18} />
                                                        {profileMenuLabel}
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/change-password"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className="flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-black text-foreground transition-all hover:bg-brand-primary/10 hover:text-brand-primary"
                                                >
                                                    <KeyRound size={18} />
                                                    Security
                                                </Link>
                                                <div className="my-2 h-px bg-brand-primary/5 mx-4" />
                                                <LogoutButton className="flex w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-sm font-black text-red-500 transition-all hover:bg-red-50 hover:text-red-700" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    href={config.profileHref}
                                    className="grid h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary text-sm font-black text-white uppercase transition-all hover:scale-110 hover:shadow-xl"
                                >
                                    {userInitial}
                                </Link>
                            )}
                        </div>
                    ) : null}
                </div>
            </Container>
        </header>
    );
}
