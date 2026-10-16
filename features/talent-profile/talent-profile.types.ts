export type TalentSkillApiDto = {
    language: string;
    experience: number;
};

export type TalentProfileApiDto = {
    name: string;
    email: string;
    phoneNumber: string;
    resumeUrl: string;
    resumeFileName: string;
    pictureUrl: string;
    pictureFileName: string;
    location: string;
    tagline: string;
    bio: string;
    linkedin: string;
    additionalUrl: string;
    videoIntro: string;
    experience: number;
    workplaces: string;
    expectedSalary: number;
    skills: TalentSkillApiDto[];
};

export type TalentProfileApiResponseDto = Omit<
    TalentProfileApiDto,
    "pictureUrl" | "pictureFileName"
> & {
    pictureUrl?: string;
    pictureFileName?: string;
    PictureUrl?: string;
    PictureFileName?: string;
};

export type TalentSkillForm = {
    language: string;
    experience: string;
};

export type TalentProfileForm = Omit<TalentProfileApiDto, "skills"> & {
    skills: TalentSkillForm[];
};

export enum TalentSkillLanguage {
    JAVASCRIPT = "JavaScript",
    TYPESCRIPT = "TypeScript",
    PYTHON = "Python",
    JAVA = "Java",
    CSHARP = "C#",
    CPLUSPLUS = "C++",
    GO = "Go",
    PHP = "PHP",
    RUBY = "Ruby",
    SWIFT = "Swift",
    KOTLIN = "Kotlin",
    DART = "Dart",
    RUST = "Rust",
    SQL = "SQL",

    // Frameworks & Libraries
    REACTJS = "React.js",
    NEXTJS = "Next.js",
    NESTJS = "NestJS",
    ASPDOTNETCORE = "ASP.NET Core",
}

export const talentSkillLanguageOptions = Object.values(TalentSkillLanguage);

export const createEmptyTalentProfileForm = (): TalentProfileForm => ({
    name: "",
    email: "",
    phoneNumber: "",
    resumeUrl: "",
    resumeFileName: "",
    pictureUrl: "",
    pictureFileName: "",
    location: "",
    tagline: "",
    bio: "",
    linkedin: "",
    additionalUrl: "",
    videoIntro: "",
    experience: 0,
    workplaces: "",
    expectedSalary: 0,
    skills: [],
});
