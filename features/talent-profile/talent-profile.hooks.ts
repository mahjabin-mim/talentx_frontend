import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { UserRole } from "../Authentications/Authentications.enum";
import { extractApiError } from "../Authentications/Authentications.helper";
import { useAuthStore } from "../Authentications/Authentications.hooks";
import {
    createEmptyTalentProfileForm,
    TalentProfileApiDto,
    TalentProfileForm,
    TalentSkillForm,
    talentSkillLanguageOptions,
} from "./talent-profile.types";
import {
    fetchTalentProfile,
    submitProfile,
    uploadTalentProfilePicture,
    uploadTalentProfileResume,
} from "./talent-profile.service";

const talentProfileQueryKey = ["talent-profile", "me"] as const;
const MAX_SKILL_COUNT = 5;

const mapProfileToForm = (profile: TalentProfileApiDto): TalentProfileForm => ({
    name: profile.name ?? "",
    email: profile.email ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    resumeUrl: profile.resumeUrl ?? "",
    resumeFileName: profile.resumeFileName ?? "",
    pictureUrl: profile.pictureUrl ?? "",
    pictureFileName: profile.pictureFileName ?? "",
    location: profile.location ?? "",
    tagline: profile.tagline ?? "",
    bio: profile.bio ?? "",
    linkedin: profile.linkedin ?? "",
    additionalUrl: profile.additionalUrl ?? "",
    videoIntro: profile.videoIntro ?? "",
    experience: profile.experience ?? 0,
    workplaces: profile.workplaces ?? "",
    expectedSalary: profile.expectedSalary ?? 0,
    skills: (profile.skills ?? []).map((skill) => ({
        language: skill.language ?? "",
        experience: String(skill.experience ?? ""),
    })),
});

const createEmptySkill = (): TalentSkillForm => ({
    language: "",
    experience: "",
});

export const useTalentProfile = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { token, userRole, hydrated, setCredentials, setProfileData } = useAuthStore();
    const hasTalentRole = userRole === UserRole.TALENT;
    const MAX_RESUME_SIZE = 2 * 1024 * 1024;
    const MAX_PICTURE_SIZE = 5 * 1024 * 1024;
    const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(
        null,
    );
    const [selectedPictureFile, setSelectedPictureFile] = useState<File | null>(
        null,
    );
    const [resumeDisplayName, setResumeDisplayName] = useState("");
    const [pictureDisplayName, setPictureDisplayName] = useState("");
    const [isEditing, setIsEditing] = useState(true);
    const [localProfileError, setLocalProfileError] = useState<string | null>(
        null,
    );
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const {
        control,
        register,
        handleSubmit: handleFormSubmit,
        setError,
        clearErrors,
        getValues,
        reset,
        watch,
        formState: { errors },
    } = useForm<TalentProfileForm>({
        defaultValues: createEmptyTalentProfileForm(),
        criteriaMode: "all",
        shouldFocusError: false,
    });
    const {
        fields: skillFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "skills",
    });

    useEffect(() => {
        if (hydrated && (!token || !hasTalentRole)) {
            router.replace("/signin");
        }
    }, [token, hasTalentRole, router, hydrated]);

    const profileQuery = useQuery({
        queryKey: talentProfileQueryKey,
        queryFn: fetchTalentProfile,
        enabled: Boolean(token) && hasTalentRole,
        retry: 1,
    });

    const saveProfileMutation = useMutation({
        mutationFn: submitProfile,
    });

    const uploadResumeMutation = useMutation({
        mutationFn: uploadTalentProfileResume,
    });

    const uploadPictureMutation = useMutation({
        mutationFn: uploadTalentProfilePicture,
    });

    useEffect(() => {
        if (!profileQuery.data) {
            return;
        }

        const normalizedProfile = mapProfileToForm(profileQuery.data);
        reset(normalizedProfile);
        setCredentials({ email: profileQuery.data.email });
        setProfileData({
            fullName: profileQuery.data.name || profileQuery.data.email,
        });
        setResumeDisplayName(profileQuery.data.resumeFileName ?? "");
        setPictureDisplayName(profileQuery.data.pictureFileName ?? "");
    }, [profileQuery.data, reset, setCredentials, setProfileData]);

    const applyCustomFieldErrors = (formData: TalentProfileForm) => {
        clearErrors(["skills", "resumeUrl"]);

        const hasResume =
            Boolean(formData.resumeUrl.trim()) || Boolean(selectedResumeFile);
        let hasCustomValidationError = false;

        if (!hasResume) {
            setError("resumeUrl", {
                type: "manual",
                message: "Resume is required.",
            });
            hasCustomValidationError = true;
        }

        const duplicateLanguages = new Set<string>();
        const seenLanguages = new Map<string, number[]>();
        formData.skills.forEach((skill, index) => {
            const normalized = skill.language.trim().toLowerCase();
            if (!normalized) {
                return;
            }
            const indexes = seenLanguages.get(normalized) ?? [];
            indexes.push(index);
            seenLanguages.set(normalized, indexes);
            if (indexes.length > 1) {
                duplicateLanguages.add(normalized);
            }
        });

        if (duplicateLanguages.size > 0) {
            formData.skills.forEach((skill, index) => {
                const normalized = skill.language.trim().toLowerCase();
                if (duplicateLanguages.has(normalized)) {
                    setError(`skills.${index}.language`, {
                        type: "manual",
                        message: "Duplicate skill languages are not allowed.",
                    });
                }
            });
            hasCustomValidationError = true;
        }

        formData.skills.forEach((skill, index) => {
            const years = Number(skill.experience);
            if (Number.isNaN(years) || years <= 0) {
                setError(`skills.${index}.experience`, {
                    type: "manual",
                    message:
                        "Each skill experience must be a valid number greater than zero.",
                });
                hasCustomValidationError = true;
            }
        });

        return hasCustomValidationError;
    };

    const handleSubmit = handleFormSubmit(async (formData) => {
        setLocalProfileError(null);
        setSaveMessage(null);
        const hasCustomValidationError = applyCustomFieldErrors(formData);
        const pictureFileToUpload = selectedPictureFile;

        if (hasCustomValidationError) {
            return;
        }

        try {
            let profile = await saveProfileMutation.mutateAsync(formData);

            if (selectedResumeFile) {
                profile =
                    await uploadResumeMutation.mutateAsync(selectedResumeFile);
            }

            if (pictureFileToUpload) {
                profile =
                    await uploadPictureMutation.mutateAsync(
                        pictureFileToUpload,
                    );
            }

            const profileWithUploadFallbacks: TalentProfileApiDto = {
                ...profile,
                resumeFileName:
                    profile.resumeFileName ||
                    selectedResumeFile?.name ||
                    formData.resumeFileName,
                pictureFileName:
                    profile.pictureFileName ||
                    pictureFileToUpload?.name ||
                    formData.pictureFileName,
                resumeUrl: profile.resumeUrl || formData.resumeUrl,
                pictureUrl: profile.pictureUrl || formData.pictureUrl,
            };

            queryClient.setQueryData(
                talentProfileQueryKey,
                profileWithUploadFallbacks,
            );
            reset({
                ...mapProfileToForm(profileWithUploadFallbacks),
                skills: formData.skills,
            });
            setCredentials({ email: profileWithUploadFallbacks.email });
            setProfileData({
                fullName:
                    profileWithUploadFallbacks.name ||
                    profileWithUploadFallbacks.email,
            });
            setResumeDisplayName(profileWithUploadFallbacks.resumeFileName);
            setPictureDisplayName(profileWithUploadFallbacks.pictureFileName);
            setSelectedResumeFile(null);
            setSelectedPictureFile(null);
            setSaveMessage("Profile saved successfully.");
            setIsEditing(false);
        } catch (error) {
            setLocalProfileError(
                extractApiError(error, "Failed to save your talent profile."),
            );
        }
    }, () => {
        setSaveMessage(null);
        setLocalProfileError(null);
        applyCustomFieldErrors(getValues());
    });

    const startEditing = () => {
        console.log("Edit clicked");
        setSaveMessage(null);
        setLocalProfileError(null);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setSaveMessage(null);
        setLocalProfileError(null);
        setIsEditing(false);
        setSelectedResumeFile(null);
        setSelectedPictureFile(null);
        
        if (profileQuery.data) {
            const normalizedProfile = mapProfileToForm(profileQuery.data);
            reset(normalizedProfile);
            setResumeDisplayName(profileQuery.data.resumeFileName ?? "");
            setPictureDisplayName(profileQuery.data.pictureFileName ?? "");
        }
    };

    const addSkill = () => {
        if (!isEditing || skillFields.length >= MAX_SKILL_COUNT) {
            return;
        }

        setSaveMessage(null);
        setLocalProfileError(null);
        append(createEmptySkill());
    };

    const removeSkill = (index: number) => {
        if (!isEditing) {
            return;
        }

        setSaveMessage(null);
        setLocalProfileError(null);
        remove(index);
    };

    const handleResumeFileChange = (file: File | null) => {
        if (!isEditing) {
            return;
        }

        setSaveMessage(null);
        setLocalProfileError(null);
        clearErrors("resumeUrl");

        if (!file) {
            setSelectedResumeFile(null);
            setResumeDisplayName("");
            return;
        }

        if (file.size > MAX_RESUME_SIZE) {
            setError("resumeUrl", {
                type: "manual",
                message: "Resume file size must be 2MB or less.",
            });
            setSelectedResumeFile(null);
            return;
        }

        if (!file.name.toLowerCase().endsWith(".pdf")) {
            setError("resumeUrl", {
                type: "manual",
                message: "Only PDF resume files are supported.",
            });
            setSelectedResumeFile(null);
            return;
        }

        setSelectedResumeFile(file);
        setResumeDisplayName(file.name);
    };

    const handlePictureFileChange = (file: File | null) => {
        if (!isEditing) {
            return;
        }

        setSaveMessage(null);
        setLocalProfileError(null);

        if (!file) {
            setSelectedPictureFile(null);
            return;
        }

        if (file.size > MAX_PICTURE_SIZE) {
            setLocalProfileError("Profile picture size must be 5MB or less.");
            setSelectedPictureFile(null);
            return;
        }

        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        const lowerCaseName = file.name.toLowerCase();
        const isSupported = allowedExtensions.some((extension) =>
            lowerCaseName.endsWith(extension),
        );

        if (!isSupported) {
            setLocalProfileError(
                "Only JPG, JPEG, PNG, and WEBP profile pictures are supported.",
            );
            setSelectedPictureFile(null);
            return;
        }

        setSelectedPictureFile(file);
        setPictureDisplayName(file.name);
    };

    return {
        control,
        register,
        errors,
        watch,
        handleSubmit,
        handleResumeFileChange,
        handlePictureFileChange,
        skillFields,
        addSkill,
        removeSkill,
        canAddSkill: isEditing && skillFields.length < MAX_SKILL_COUNT,
        maxSkillCount: MAX_SKILL_COUNT,
        skillLanguageOptions: [...talentSkillLanguageOptions],
        loading:
            saveProfileMutation.isPending ||
            uploadResumeMutation.isPending ||
            uploadPictureMutation.isPending,
        isProfileLoading:
            Boolean(token) &&
            !profileQuery.data &&
            (profileQuery.isPending || profileQuery.isFetching),
        isEditing,
        profileError:
            localProfileError ??
            (profileQuery.isError
                ? extractApiError(
                      profileQuery.error,
                      "Failed to load your talent profile.",
                  )
                : null),
        saveMessage,
        startEditing,
        cancelEditing,
        selectedResumeFile,
        selectedPictureFile,
        resumeDisplayName,
        pictureDisplayName,
    };
};
