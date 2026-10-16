export type UserRole = "guest" | "talent" | "employer";

export enum NavItemVariant {
    Primary = "primary",
    Secondary = "secondary",
}

export type NavItem = {
    label: string;
    href: string;
    variant?: NavItemVariant;
};

export type NavbarConfig = {
    left: NavItem[];
    right: NavItem[];
    showProfile?: boolean;
    showBell?: boolean;
    profileHref?: string;
};
