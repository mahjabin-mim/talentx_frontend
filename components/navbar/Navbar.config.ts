import { NavbarConfig, NavItemVariant, UserRole } from "./Navbar.types";

export const navbarConfigByRole: Record<UserRole, NavbarConfig> = {
    guest: {
        left: [
            { label: "Explore Jobs", href: "/jobs" },
            { label: "Contact", href: "#" },
        ],
        right: [
            { label: "Sign In", href: "/signin", variant: NavItemVariant.Primary },
        ],
    },

    talent: {
        left: [{ label: "Dashboard", href: "/talent-dashboard" }],
        right: [
            {
                label: "Find Jobs",
                href: "/jobs",
                variant: NavItemVariant.Primary,
            },
        ],
        showProfile: true,
        showBell: true,
        profileHref: "/talent-profile",
    },

    employer: {
        left: [{ label: "Dashboard", href: "/employer/dashboard" }],
        right: [
            {
                label: "Post a Job",
                href: "/employer/jobs/new",
                variant: NavItemVariant.Primary,
            },
        ],
        showProfile: true,
        showBell: true,
        profileHref: "#",
    },
};
