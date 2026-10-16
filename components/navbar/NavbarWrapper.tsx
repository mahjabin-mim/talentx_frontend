"use client";

import { usePathname } from "next/navigation";
import {
    UserRole as AuthUserRole,
} from "@/features/Authentications/Authentications.enum";
import { useAuthStore } from "@/features/Authentications/Authentications.hooks";
import Navbar from "./Navbar";
import { navbarConfigByRole } from "./Navbar.config";
import { UserRole } from "./Navbar.types";

export default function NavbarWrapper() {
    const pathname = usePathname();
    const {
        token,
        userRole: storedUserRole,
        fullName,
        email,
    } = useAuthStore();

    const authRoutes = ["/signin", "/register", "/verify-email", "/password-sent"];
    if (authRoutes.includes(pathname)) {
        return null;
    }

    const isAuthenticated = Boolean(token);

    // Route-based override to keep global navbar aligned with page section.
    const roleFromPath: UserRole | null = pathname.startsWith("/employer")
        ? "employer"
        : pathname.startsWith("/talent-dashboard") ||
            pathname.startsWith("/talent-profile")
          ? "talent"
          : null;

    const roleFromStore: UserRole | null =
        storedUserRole === AuthUserRole.EMPLOYER
            ? "employer"
            : storedUserRole === AuthUserRole.TALENT
              ? "talent"
              : null;

    const role: UserRole = !isAuthenticated
        ? "guest"
        : roleFromPath ?? roleFromStore ?? "guest";

    const config = navbarConfigByRole[role];

    const userInitial =
        fullName?.charAt(0)?.toUpperCase() ||
        email?.charAt(0)?.toUpperCase() ||
        "U";

    return (
        <Navbar
            config={config}
            isAuthenticated={isAuthenticated}
            userInitial={userInitial}
        />
    );
}
