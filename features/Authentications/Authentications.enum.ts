export enum UserRole {
    TALENT = "Talent",
    EMPLOYER = "Employer",
}

export enum AuthSessionStatus {
    AUTHENTICATED = "authenticated",
    UNAUTHENTICATED = "unauthenticated",
    LOADING = "loading",
}

export enum RegistrationStep {
    CREDENTIALS = 1,
    ROLE_SELECTION = 2,
    ONBOARDING = 3,
    COMPLETED = 4,
}
