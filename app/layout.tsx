import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/QueryProvider";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import Footer from "@/components/footer/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TalentX | AI-Powered Intelligent Hiring",
    description: "TalentX bridges the gap between top-tier talent and visionary companies using AI that understands context, not just keywords.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body className={inter.className}>
                <QueryProvider>
                    <AuthGuard>
                        <div className="flex flex-col min-h-screen">
                            <NavbarWrapper />
                            <main className="flex-grow">{children}</main>
                            <Footer />
                        </div>
                        <Toaster position="top-center" richColors />
                    </AuthGuard>
                </QueryProvider>
            </body>
        </html>
    );
}
