"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FormDataType } from "./apply.types";
import {
    extractResumeData,
    submitApplication,
    getTalentProfileMe,
    downloadMyResumeFile,
    hasAlreadyAppliedToJob,
} from "./apply.services";
import { getJobByIdService } from "@/features/Jobs/Jobs.service";

import { isValidPhoneNumber } from "libphonenumber-js";
import {
    extractApiError,
    resolvePostAuthRoute,
    UserRole,
    useAuthStore,
} from "../Authentications/Authentications.index";

const defaultApplyFormValues: FormDataType = {
    Name: "",
    Email: "",
    ContactNumber: "",
    Education: "",
    Department: "",
    CGPA: "",
    LinkedInUrl: "",
    AdditionalUrl: "",
    Location: "",
    CoverLetter: "",
    ExpectedSalary: "",
    Experience: "",
};

const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
};

const isValidHttpUrl = (value: string) => {
    try {
        const url = new URL(value.trim());
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const isValidLinkedInUrl = (value: string) => {
    try {
        const url = new URL(value.trim());
        const isHttp = url.protocol === "http:" || url.protocol === "https:";
        const host = url.hostname.toLowerCase();
        const isLinkedInHost =
            host === "linkedin.com" || host.endsWith(".linkedin.com");

        return isHttp && isLinkedInHost;
    } catch {
        return false;
    }
};

export const useApply = () => {
    const router = useRouter();
    const { email, fullName, phoneNumber, token, userRole } = useAuthStore();
    const searchParams = useSearchParams();
    const jobId = searchParams.get("jobId");

    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    const { data: jobData, isLoading: isLoadingJob } = useQuery({
        queryKey: ["job", jobId],
        queryFn: () => (jobId ? getJobByIdService(jobId) : Promise.reject("No jobId")),
        enabled: !!jobId,
    });

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isExtracted, setIsExtracted] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [extractionError, setExtractionError] = useState<string | null>(null);
    const [savedResumeFile, setSavedResumeFile] = useState<File | null>(null);
    const [savedResumeName, setSavedResumeName] = useState<string>("");
    const [resumeError, setResumeError] = useState<string | null>(null);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const [pendingSubmission, setPendingSubmission] = useState<{
        formData: FormDataType;
        resumeFile: File;
        jobId: string;
    } | null>(null);

    const {
        register,
        handleSubmit: handleFormSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormDataType>({
        defaultValues: defaultApplyFormValues,
    });

    const applyExtractedData = (
        extractedData: Awaited<ReturnType<typeof extractResumeData>>,
    ) => {
        setExtractedField("Education", extractedData.education ?? undefined);
        setExtractedField("Department", extractedData.department ?? undefined);
        setExtractedField("CGPA", extractedData.cgpa ?? undefined);
        setExtractedField(
            "LinkedInUrl",
            extractedData.linkedInUrl ?? undefined,
        );
        setExtractedField(
            "AdditionalUrl",
            extractedData.additionalUrl ?? undefined,
        );
        setExtractedField("Location", extractedData.location ?? undefined);
        setExtractedField("Experience", extractedData.experience ?? "");
        setIsExtracted(true);
    };

    useEffect(() => {
        if (!email && !fullName && !phoneNumber) return;

        let cancelled = false;

        setValue("Name", fullName ?? "", {
            shouldDirty: false,
            shouldTouch: false,
        });
        setValue("Email", email ?? "", {
            shouldDirty: false,
            shouldTouch: false,
        });
        setValue("ContactNumber", phoneNumber ?? "", {
            shouldDirty: false,
            shouldTouch: false,
        });

        void getTalentProfileMe()
            .then((profile) => {
                if (cancelled) return;

                setValue("Name", profile.name || fullName || "", {
                    shouldDirty: false,
                    shouldTouch: false,
                });
                setValue("Email", profile.email || email || "", {
                    shouldDirty: false,
                    shouldTouch: false,
                });
                setValue(
                    "ContactNumber",
                    profile.phoneNumber || phoneNumber || "",
                    {
                        shouldDirty: false,
                        shouldTouch: false,
                    },
                );

                if (!profile.resumeUrl && !profile.resumeFileName) {
                    return;
                }

                return downloadMyResumeFile(profile.resumeFileName)
                    .then((resumeFromProfile) => {
                        if (cancelled) return;

                        setSavedResumeFile(resumeFromProfile);
                        setSavedResumeName(
                            profile.resumeFileName || resumeFromProfile.name,
                        );

                        return extractResumeMutation.mutateAsync(
                            resumeFromProfile,
                        );
                    })
                    .then((extracted) => {
                        if (cancelled || !extracted) return;
                        applyExtractedData(extracted);
                    });
            })
            .catch(() => {
                // silent fallback: user can still upload resume manually
            });

        return () => {
            cancelled = true;
        };
    }, [email, fullName, phoneNumber, setValue]);

    const applyRegister = {
        Name: register("Name", {
            required: "Name is required.",
        }),
        Email: register("Email", {
            required: "Email is required.",
            validate: (value) => isValidEmail(value) || "Email is not valid.",
        }),
        ContactNumber: register("ContactNumber", {
            required: "Contact number is required.",
            validate: (value) =>
                isValidPhoneNumber(value) || "Contact number is not valid.",
        }),
        Education: register("Education", {
            required: "Education is required.",
        }),
        Department: register("Department", {
            required: "Department is required.",
        }),
        CGPA: register("CGPA", {
            required: "CGPA is required.",
        }),
        LinkedInUrl: register("LinkedInUrl", {
            required: "LinkedIn URL is required.",
            validate: (value) =>
                isValidLinkedInUrl(value) || "LinkedIn URL is not valid.",
        }),
        AdditionalUrl: register("AdditionalUrl", {
            required: "Additional URL is required.",
            validate: (value) => isValidHttpUrl(value) || "URL is not valid.",
        }),
        Location: register("Location", {
            required: "Location is required.",
        }),
        CoverLetter: register("CoverLetter", {
            required: "Cover letter is required.",
        }),
        ExpectedSalary: register("ExpectedSalary", {
            required: "Expected salary is required.",
        }),
        Experience: register("Experience", {
            required: "Experience is required.",
        }),
    };

    const formErrors = Object.values(errors)
        .map((fieldError) => fieldError?.message)
        .filter((message): message is string => Boolean(message));

    const setExtractedField = (
        key: keyof FormDataType,
        value: string | undefined,
    ) => {
        if (typeof value !== "string") {
            return;
        }

        setValue(key, value, {
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    const extractResumeMutation = useMutation({
        mutationFn: extractResumeData,
    });

    const submitApplicationMutation = useMutation({
        mutationFn: ({
            formData,
            resumeFile,
            jobId,
        }: {
            formData: FormDataType;
            resumeFile: File;
            jobId: string;
        }) => submitApplication(formData, resumeFile, jobId),
        onSuccess: (response) => {
            const existingUserFound =
                response.existingUserFound ??
                response.ExistingUserFound ??
                false;

            const isLoggedInTalent =
                Boolean(token) && userRole === UserRole.TALENT;

            router.push(
                isLoggedInTalent
                    ? resolvePostAuthRoute(userRole)
                    : existingUserFound
                      ? "/talent-dashboard"
                      : "/password-sent",
            );
        },
    });

    const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setResumeFile(file);
        setSubmissionError(null);
        setExtractionError(null);
        setResumeError(null);
        setIsExtracted(false);

        if (!file) {
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert("File size must be 2MB or less");
            e.target.value = "";
            setResumeFile(null);
            setResumeError("File size must be 2MB or less.");
            return;
        }

        void extractResumeMutation
            .mutateAsync(file)
            .then((extractedData) => {
                applyExtractedData(extractedData);
            })
            .catch((error) => {
                setExtractionError(
                    extractApiError(error, "Resume extraction is temporarily unavailable. Please try again shortly."),
                );
            });
    };

    const handleSubmit = handleFormSubmit((formData) => {
        setSubmissionError(null);
        setResumeError(null);

        if (!jobId) {
            setSubmissionError(
                "Missing job reference. Please open the job and apply again.",
            );
            return;
        }

        const fileToSubmit = resumeFile ?? savedResumeFile;

        if (!fileToSubmit) {
            setResumeError("Resume is required.");
            return;
        }

        const isLoggedInTalent = Boolean(token) && userRole === UserRole.TALENT;

        const checkDuplicatePromise = isLoggedInTalent
            ? hasAlreadyAppliedToJob(jobId)
            : Promise.resolve(false);

        void checkDuplicatePromise
            .then((alreadyApplied) => {
                if (alreadyApplied) {
                    setPendingSubmission({
                        formData,
                        resumeFile: fileToSubmit,
                        jobId,
                    });
                    setShowDuplicateWarning(true);
                    return;
                }

                return submitApplicationMutation.mutateAsync({
                    formData,
                    resumeFile: fileToSubmit,
                    jobId,
                });
            })
            .catch((error) => {
                setSubmissionError(
                    extractApiError(
                        error,
                        "Something went wrong while submitting the application.",
                    ),
                );
            });
    });

    const confirmDuplicateAndSubmit = () => {
        if (!pendingSubmission) {
            return;
        }

        setSubmissionError(null);
        setShowDuplicateWarning(false);

        void submitApplicationMutation
            .mutateAsync(pendingSubmission)
            .then(() => {
                setPendingSubmission(null);
            })
            .catch((error) => {
                setSubmissionError(
                    extractApiError(
                        error,
                        "Something went wrong while submitting the application.",
                    ),
                );
            });
    };

    const cancelDuplicateSubmission = () => {
        setShowDuplicateWarning(false);
        setPendingSubmission(null);
    };

    const handleBack = () => {
        if (jobId) {
            router.push(`/jobs/${jobId}`);
            return;
        }

        router.push("/jobs");
    };

    return {
        register: applyRegister,
        resumeFile,
        savedResumeName,
        contactNumberError: errors.ContactNumber?.message,
        formErrors,
        fieldErrors: errors,
        resumeError,
        jobTitle: jobData?.title,
        isLoadingJob,
        isExtracting: extractResumeMutation.isPending,
        isExtracted,
        isSubmitting: submitApplicationMutation.isPending,
        submissionError,
        extractionError,
        showDuplicateWarning,
        handleResumeChange,
        handleSubmit,
        handleBack,
        confirmDuplicateAndSubmit,
        cancelDuplicateSubmission,
    };
};
