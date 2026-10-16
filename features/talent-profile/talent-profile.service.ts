import api from "@/lib/axios";
import {
    TalentProfileApiDto,
    TalentProfileApiResponseDto,
    TalentProfileForm,
} from "./talent-profile.types";

const PROFILE_ROUTE = "/talent-profile/me";
const PROFILE_RESUME_ROUTE = "/talent-profile/me/resume";
const PROFILE_PICTURE_ROUTE = "/talent-profile/me/picture";
const S3_PUBLIC_BASE_URL =
    process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL?.trim() ?? "";

const resolveAssetUrl = (rawValue?: string): string => {
    if (!rawValue) {
        return "";
    }

    const value = rawValue.trim();
    if (!value) {
        return "";
    }

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("blob:")
    ) {
        return value;
    }

    if (!S3_PUBLIC_BASE_URL) {
        return value;
    }

    return `${S3_PUBLIC_BASE_URL.replace(/\/+$/, "")}/${value.replace(
        /^\/+/,
        "",
    )}`;
};

const normalizeTalentProfileResponse = (
    profile: TalentProfileApiResponseDto,
): TalentProfileApiDto => {
    const {
        PictureUrl,
        PictureFileName,
        pictureUrl,
        pictureFileName,
        phoneNumber,
        ...rest
    } = profile;

    return {
        ...rest,
        phoneNumber: phoneNumber ?? "",
        pictureUrl: resolveAssetUrl(pictureUrl ?? PictureUrl ?? ""),
        pictureFileName: pictureFileName ?? PictureFileName ?? "",
        resumeUrl: resolveAssetUrl(rest.resumeUrl ?? ""),
    };
};

export const fetchTalentProfile = async (): Promise<TalentProfileApiDto> => {
    const response = await api.get<TalentProfileApiResponseDto>(PROFILE_ROUTE);
    return normalizeTalentProfileResponse(response.data);
};

export const submitProfile = async (
    data: TalentProfileForm,
): Promise<TalentProfileApiDto> => {
    if (Number.isNaN(data.experience) || Number.isNaN(data.expectedSalary)) {
        throw new Error(
            "Experience and expected salary must be valid numbers.",
        );
    }

    const normalizedSkills = data.skills
        .map((skill) => ({
            language: skill.language.trim(),
            experienceText: skill.experience.trim(),
        }))
        .filter(
            (skill) => skill.language !== "" || skill.experienceText !== "",
        );

    if (normalizedSkills.length > 5) {
        throw new Error("You can add up to 5 skills.");
    }

    const skills = normalizedSkills.map((skill) => {
        if (skill.language === "" || skill.experienceText === "") {
            throw new Error(
                "Each skill must include a language and experience.",
            );
        }

        const experience = Number(skill.experienceText);

        if (Number.isNaN(experience) || experience <= 0) {
            throw new Error(
                "Each skill experience must be a valid number greater than zero.",
            );
        }

        return {
            language: skill.language,
            experience,
        };
    });

    const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber.trim() || undefined,
        location: data.location.trim() || undefined,
        tagline: data.tagline.trim() || undefined,
        bio: data.bio.trim() || undefined,
        linkedin: data.linkedin.trim() || undefined,
        additionalUrl: data.additionalUrl.trim() || undefined,
        videoIntro: data.videoIntro.trim() || undefined,
        experience: data.experience,
        workplaces: data.workplaces.trim() || undefined,
        expectedSalary: data.expectedSalary,
        skills,
    };

    const response = await api.put<TalentProfileApiResponseDto>(
        PROFILE_ROUTE,
        payload,
    );
    return normalizeTalentProfileResponse(response.data);
};

export const uploadTalentProfileResume = async (
    file: File,
): Promise<TalentProfileApiDto> => {
    const payload = new FormData();
    payload.append("Resume", file);

    const response = await api.post<TalentProfileApiResponseDto>(
        PROFILE_RESUME_ROUTE,
        payload,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    return normalizeTalentProfileResponse(response.data);
};

export const uploadTalentProfilePicture = async (
    file: File,
): Promise<TalentProfileApiDto> => {
    const payload = new FormData();
    payload.append("Picture", file);

    const response = await api.post<TalentProfileApiResponseDto>(
        PROFILE_PICTURE_ROUTE,
        payload,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    return normalizeTalentProfileResponse(response.data);
};
