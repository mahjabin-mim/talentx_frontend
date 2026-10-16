"use client";
import { Container } from "@/components/ui/container";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { isAfter, isValid, parseISO } from "date-fns";

import { extractApiError } from "@/features/Authentications/Authentications.helper";
import {
    createJobService,
    updateJobService,
    generateJobDescriptionService,
    getJobByIdService,
    updateJobStatusService,
} from "../Jobs.service";
import type {
    ICreateJobRequest,
    IGenerateJobDescriptionRequest,
    JobLifecycleStatus,
    JobSummaryEditableDetail,
    JobSummaryModalType,
    SkillItem,
} from "../Jobs.type";
import {
    editDetailTitleMap,
    formatDeadline,
    normalizeDescription,
    toDateInputValue,
    JOB_FORM_LIMITS,
} from "../Jobs.type";
import {
    clearJobGenerationState,
    getJobGenerationRequest,
    saveJobGenerationRequest,
} from "../JobGeneration.store";
import { useJobDescriptionDraftStore } from "../JobDescriptionDraft.store";
import { JobSummaryHeader } from "./JobSummaryHeader";
import { JobSummaryDetailsSection } from "./JobSummaryDetailsSection";
import { JobSummarySkillsSection } from "./JobSummarySkillsSection";
import { JobSummaryDescriptionSection } from "./JobSummaryDescriptionSection";
import { JobSummaryFooter } from "./JobSummaryFooter";
import { JobSummaryModal } from "./JobSummaryModal";

export const JobSummaryView = ({
    mode = "create",
}: {
    mode?: "create" | "edit";
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editingJobId = searchParams.get("jobId");
    const isEditMode = mode === "edit";

    const [request, setRequest] =
        useState<IGenerateJobDescriptionRequest | null>(null);
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [originalStatus, setOriginalStatus] =
        useState<JobLifecycleStatus | null>(null);

    const [editableDescription, setEditableDescription] = useState("");
    const [skills, setSkills] = useState<SkillItem[]>([]);

    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] =
        useState(false);
    const [isCompletingAction, setIsCompletingAction] = useState(false);
    const [pageError, setPageError] = useState<string | null>(null);
    const [descriptionGenerationError, setDescriptionGenerationError] =
        useState<string | null>(null);
    const [contentErrors, setContentErrors] = useState<{
        description?: string;
        responsibilities?: string;
        skills?: string;
    }>({});

    const [modal, setModal] = useState<JobSummaryModalType>(null);
    const [detailError, setDetailError] = useState<string | null>(null);
    const [editingDetail, setEditingDetail] =
        useState<JobSummaryEditableDetail | null>(null);
    const [detailDraft, setDetailDraft] = useState<Record<string, string>>({});
    const [loadingMessage, setLoadingMessage] = useState(
        "Please wait a moment...",
    );

    const hydratedRouteKeyRef = useRef<string | null>(null);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    useEffect(() => {
        const routeKey = `${isEditMode ? "edit" : "create"}:${editingJobId ?? "new"}`;

        if (hydratedRouteKeyRef.current === routeKey) {
            return;
        }

        if (isCompletingAction) {
            return;
        }

        const hydrate = async () => {
            if (editingJobId) {
                try {
                    const job = await getJobByIdService(editingJobId);

                    const hydratedRequest: IGenerateJobDescriptionRequest = {
                        jobId: job.jobId,
                        title: job.title,
                        description: job.description,
                        responsibilities: job.responsibilities,
                        skills: job.skills ?? [],
                        employmentType: job.employmentType,
                        workArrangement: job.workArrangement,
                        experienceLevel: job.experienceLevel,
                        experienceMinYears: job.experienceMinYears,
                        experienceMaxYears: job.experienceMaxYears,
                        salaryMin: job.salaryMin,
                        salaryMax: job.salaryMax,
                        countryCode: job.countryCode,
                        city: job.city,
                        timezone: job.timezone,
                        currencyCode: job.currencyCode,
                        numberOfPositions: job.numberOfPositions,
                        applicationDeadline: job.applicationDeadline,
                    };

                    setRequest(hydratedRequest);
                    setJobId(job.jobId);

                    setEditableDescription(
                        normalizeDescription(job.description),
                    );
                    setOriginalStatus(job.status as JobLifecycleStatus);

                    const initialSkills = (job.skills ?? []).map((s) => ({
                        id: generateId(),
                        value: s,
                    }));
                    setSkills(
                        initialSkills.length > 0
                            ? initialSkills
                            : [{ id: generateId(), value: "" }],
                    );

                    saveJobGenerationRequest(hydratedRequest);
                    hydratedRouteKeyRef.current = routeKey;
                    return;
                } catch (error) {
                    setPageError(
                        extractApiError(
                            error as AxiosError,
                            "Failed to load job details.",
                        ),
                    );
                    return;
                }
            }

            if (isEditMode && !editingJobId) {
                router.replace("/employer/dashboard");
                return;
            }

            const cachedRequest = getJobGenerationRequest();

            if (!cachedRequest) {
                router.replace("/employer/jobs/new");
                return;
            }

            const safeResponsibilities =
                cachedRequest.responsibilities ||
                (cachedRequest as any).requirements ||
                "";

            setRequest(cachedRequest);
            setJobId(cachedRequest.jobId);

            const initialSkills = (cachedRequest.skills ?? []).map((s) => ({
                id: generateId(),
                value: s,
            }));
            setSkills(
                initialSkills.length > 0
                    ? initialSkills
                    : [{ id: generateId(), value: "" }],
            );

            // Lock the ref BEFORE the async gap so Strict Mode Mount 2 ignores it entirely
            hydratedRouteKeyRef.current = routeKey;

            // FIX: Removed the faulty if-check. We ALWAYS generate the AI description for new jobs.
            setIsGeneratingDescription(true);
            setPageError(null);
            setDescriptionGenerationError(null);

            try {
                // Send the context to the backend
                const payloadToGenerate = {
                    ...cachedRequest,
                    responsibilities: safeResponsibilities,
                };
                const generated =
                    await generateJobDescriptionService(payloadToGenerate);

                // Instantly replace the textarea with the newly generated AI text
                setEditableDescription(
                    normalizeDescription(generated.description),
                );
            } catch (error) {
                const apiError = extractApiError(
                    error as AxiosError,
                    "Job description generation is temporarily unavailable. Please try again shortly.",
                );
                setDescriptionGenerationError(apiError);
                // Fallback to the short wizard text instead of showing error IN the box
                setEditableDescription(
                    normalizeDescription(cachedRequest.description),
                );
            } finally {
                setIsGeneratingDescription(false);
            }
        };

        void hydrate();
    }, [router, editingJobId, isEditMode, isCompletingAction]);

    const closeModal = () => {
        setModal(null);
        setEditingDetail(null);
        setDetailError(null);
        setDetailDraft({});
    };

    const validateContentSections = () => {
        const nextErrors: { description?: string; skills?: string } = {};

        if (!editableDescription.trim()) {
            nextErrors.description = "Job description is required.";
        }

        const validSkills = skills.map((s) => s.value.trim()).filter(Boolean);
        if (validSkills.length === 0) {
            nextErrors.skills = "At least one skill is required.";
        } else {
            const uniqueSkills = new Set(validSkills.map((s) => s.toLowerCase()));
            if (uniqueSkills.size !== validSkills.length) {
                nextErrors.skills = "Skills must be unique.";
            }
        }

        setContentErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const submitJob = async (mode: "draft" | "publish" | "saveChanges") => {
        if (!request) return;

        if (mode !== "draft") {
            const isSectionsValid = validateContentSections();
            
            // Comprehensive check for mandatory API fields
            const missingFields = [];
            if (!request.title?.trim()) missingFields.push("Role Title");
            if (!request.employmentType) missingFields.push("Employment Type");
            if (!request.workArrangement) missingFields.push("Work Arrangement");
            if (!request.experienceLevel) missingFields.push("Experience Level");
            
            if (missingFields.length > 0) {
                setPageError(`Missing required details: ${missingFields.join(", ")}`);
                setModal(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            if (!isSectionsValid) {
                setModal(null);
                return;
            }
        }

        setIsSaving(true);
        setPageError(null);

        try {
            const normalizedRequest: IGenerateJobDescriptionRequest =
                request.workArrangement === "Remote"
                    ? {
                          ...request,
                          countryCode: undefined,
                          city: undefined,
                          timezone: request.timezone?.trim() || undefined,
                      }
                    : {
                          ...request,
                          countryCode: request.countryCode?.trim() || undefined,
                          city: request.city?.trim() || undefined,
                          timezone: undefined,
                      };

            const payload: ICreateJobRequest = {
                ...normalizedRequest,
                jobId,
                publishJob: mode === "publish",
                description: editableDescription.trim(),
                responsibilities: request.responsibilities, // Change back to this
                skills: skills
                    .map((skill) => skill.value.trim())
                    .filter(Boolean),
            };

            let saved;
            if (isEditMode && jobId) {
                saved = await updateJobService(jobId, payload);
            } else {
                saved = await createJobService(payload);
            }

            if (mode === "publish" && saved.status !== "Active") {
                await updateJobStatusService(saved.jobId, "Activate");
            }

            if (mode === "saveChanges") {
                const action: "Activate" | "Deactivate" | null =
                    originalStatus === "Deactivated"
                        ? "Deactivate"
                        : originalStatus === "Active" ||
                            originalStatus === "Expired" ||
                            originalStatus === "Closed"
                          ? "Activate"
                          : null;

                if (action) {
                    await updateJobStatusService(saved.jobId, action);
                }
            }

            saveJobGenerationRequest(payload);
            setJobId(saved.jobId);

            setLoadingMessage(
                mode === "draft"
                    ? "Saving your draft. Please wait a moment."
                    : mode === "publish"
                      ? "Publishing your job. Please wait a moment."
                      : "Saving your changes. Please wait a moment.",
            );

            setIsCompletingAction(true);
            setModal("loading");
            clearJobGenerationState();
            router.replace("/employer/dashboard");
        } catch (error) {
            const message = extractApiError(
                error as AxiosError,
                "Failed to save job. Please try again.",
            );
            setPageError(message);
            setModal(null);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishClick = () => {
        if (!validateContentSections()) {
            return;
        }
        setPageError(null);
        setModal("publish");
    };

    const handleSaveChangesClick = () => {
        if (!validateContentSections()) {
            return;
        }
        setPageError(null);
        void submitJob("saveChanges");
    };

    const updateSkill = (id: string, value: string) => {
        setSkills((prev) =>
            prev.map((s) => (s.id === id ? { ...s, value } : s)),
        );
        if (contentErrors.skills) {
            setContentErrors((prev) => ({
                ...prev,
                skills: undefined,
            }));
        }
    };

    const addSkill = () => {
        setSkills((prev) => [...prev, { id: generateId(), value: "" }]);
        if (contentErrors.skills) {
            setContentErrors((prev) => ({
                ...prev,
                skills: undefined,
            }));
        }
    };

    const removeSkill = (id: string) => {
        setSkills((prev) =>
            prev.length === 1
                ? [{ id: generateId(), value: "" }]
                : prev.filter((s) => s.id !== id),
        );
        if (contentErrors.skills) {
            setContentErrors((prev) => ({
                ...prev,
                skills: undefined,
            }));
        }
    };

    const handleDescriptionChange = (value: string) => {
        setEditableDescription(value);
        if (contentErrors.description) {
            setContentErrors((prev) => ({
                ...prev,
                description: undefined,
            }));
        }
    };

    const openDetailEditor = (detail: JobSummaryEditableDetail) => {
        if (!request) return;
        setEditingDetail(detail);
        setDetailError(null);

        if (detail === "title") {
            setDetailDraft({ title: request.title });
        } else if (detail === "employmentType") {
            setDetailDraft({ employmentType: request.employmentType });
        } else if (detail === "workLocation") {
            setDetailDraft({
                workArrangement: request.workArrangement,
                countryCode: request.countryCode ?? "",
                city: request.city ?? "",
                timezone: request.timezone ?? "",
            });
        } else if (detail === "experienceLevel") {
            setDetailDraft({ experienceLevel: request.experienceLevel });
        } else if (detail === "experienceRange") {
            setDetailDraft({
                experienceMinYears: String(request.experienceMinYears),
                experienceMaxYears: String(request.experienceMaxYears),
            });
        } else if (detail === "salary") {
            setDetailDraft({
                salaryMin: String(request.salaryMin),
                salaryMax: String(request.salaryMax),
                currencyCode: request.currencyCode,
            });
        } else if (detail === "numberOfPositions") {
            setDetailDraft({
                numberOfPositions: String(request.numberOfPositions),
            });
        } else if (detail === "applicationDeadline") {
            setDetailDraft({
                applicationDeadline: toDateInputValue(
                    request.applicationDeadline,
                ),
            });
        } else {
            setDetailDraft({
                workArrangement: request.workArrangement,
                countryCode: request.countryCode ?? "",
                city: request.city ?? "",
                timezone: request.timezone ?? "",
            });
        }
        setModal("details");
    };

    const onDetailDraftChange = (key: string, value: string) => {
        if (detailError) {
            setDetailError(null);
        }
        setDetailDraft((prev) => ({ ...prev, [key]: value }));
    };

    const saveSingleDetail = () => {
        if (!request || !editingDetail) return;
        let updatedRequest: IGenerateJobDescriptionRequest | null = null;

        if (editingDetail === "title") {
            const title = (detailDraft.title ?? "").trim();
            if (!title) {
                setDetailError("Role title is required.");
                return;
            }
            updatedRequest = { ...request, title };
        }
        if (editingDetail === "employmentType") {
            const employmentType = detailDraft.employmentType as
                | IGenerateJobDescriptionRequest["employmentType"]
                | undefined;

            const valid = ["FullTime", "PartTime", "Contract", "Internship"];
            if (!employmentType || !valid.includes(employmentType)) {
                setDetailError("Employment type is invalid.");
                return;
            }
            updatedRequest = { ...request, employmentType };
        }

        if (editingDetail === "workLocation") {
            const workArrangement = detailDraft.workArrangement as
                | IGenerateJobDescriptionRequest["workArrangement"]
                | undefined;

            const valid = ["Remote", "Hybrid", "Onsite"];
            if (!workArrangement || !valid.includes(workArrangement)) {
                setDetailError("Work arrangement is invalid.");
                return;
            }
            const countryCode = (detailDraft.countryCode ?? "")
                .trim()
                .toUpperCase();
            const city = (detailDraft.city ?? "").trim();
            const timezone = (detailDraft.timezone ?? "").trim();

            if (workArrangement === "Remote") {
                if (!timezone) {
                    setDetailError("Timezone is required for remote jobs.");
                    return;
                }
                updatedRequest = {
                    ...request,
                    workArrangement,
                    timezone,
                    countryCode: undefined,
                    city: undefined,
                };
            } else {
                if (!countryCode || !city) {
                    setDetailError(
                        "Country and city are required for hybrid/onsite jobs.",
                    );
                    return;
                }
                updatedRequest = {
                    ...request,
                    workArrangement,
                    countryCode,
                    city,
                    timezone: undefined,
                };
            }
        }
        if (editingDetail === "experienceLevel") {
            const experienceLevel = detailDraft.experienceLevel as
                | IGenerateJobDescriptionRequest["experienceLevel"]
                | undefined;

            const valid = ["Junior", "MidLevel", "Senior", "LeadPrincipal"];
            if (!experienceLevel || !valid.includes(experienceLevel)) {
                setDetailError("Experience level is invalid.");
                return;
            }
            updatedRequest = { ...request, experienceLevel };
        }
        if (editingDetail === "experienceRange") {
            const minYears = Number(detailDraft.experienceMinYears);
            const maxYears = Number(detailDraft.experienceMaxYears);

            if (Number.isNaN(minYears) || Number.isNaN(maxYears)) {
                setDetailError("Experience years must be numbers.");
                return;
            }
            if (
                minYears < JOB_FORM_LIMITS.experienceMin ||
                maxYears < minYears ||
                maxYears > JOB_FORM_LIMITS.experienceMax
            ) {
                setDetailError("Experience years range is invalid.");
                return;
            }
            updatedRequest = {
                ...request,
                experienceMinYears: minYears,
                experienceMaxYears: maxYears,
            };
        }
        if (editingDetail === "salary") {
            const salaryMin = Number(detailDraft.salaryMin);
            const salaryMax = Number(detailDraft.salaryMax);
            const currencyCode = (detailDraft.currencyCode ?? "")
                .trim()
                .toUpperCase();

            if (Number.isNaN(salaryMin) || Number.isNaN(salaryMax)) {
                setDetailError("Salary values must be numbers.");
                return;
            }
            if (
                salaryMin < JOB_FORM_LIMITS.salaryMin ||
                salaryMax < salaryMin ||
                salaryMax > JOB_FORM_LIMITS.salaryMax
            ) {
                setDetailError("Salary range is invalid.");
                return;
            }
            if (!currencyCode || currencyCode.length > 3) {
                setDetailError("Currency code is invalid.");
                return;
            }
            updatedRequest = {
                ...request,
                salaryMin,
                salaryMax,
                currencyCode,
            };
        }
        if (editingDetail === "numberOfPositions") {
            const numberOfPositions = Number(detailDraft.numberOfPositions);
            if (
                Number.isNaN(numberOfPositions) ||
                numberOfPositions < JOB_FORM_LIMITS.positionsMin ||
                numberOfPositions > JOB_FORM_LIMITS.positionsMax
            ) {
                setDetailError(
                    `Number of positions must be between ${JOB_FORM_LIMITS.positionsMin} and ${JOB_FORM_LIMITS.positionsMax}.`,
                );
                return;
            }
            updatedRequest = { ...request, numberOfPositions };
        }
        if (editingDetail === "applicationDeadline") {
            const rawDate = detailDraft.applicationDeadline ?? "";
            if (!rawDate) {
                setDetailError("Application deadline is required.");
                return;
            }
            const deadline = parseISO(rawDate);
            if (!isValid(deadline) || !isAfter(deadline, new Date())) {
                setDetailError("Application deadline must be in the future.");
                return;
            }

            updatedRequest = {
                ...request,
                applicationDeadline: deadline.toISOString(),
            };
        }

        if (!updatedRequest) {
            setDetailError("Could not update this field.");
            return;
        }

        setRequest(updatedRequest);
        saveJobGenerationRequest(updatedRequest);
        closeModal();
    };

    const detailRows = useMemo(() => {
        if (!request) return [];

        const location =
            request.workArrangement === "Remote"
                ? `Remote (${request.timezone ?? "Flexible timezone"})`
                : `${request.city ?? "N/A"}, ${request.countryCode ?? "N/A"}`;

        return [
            {
                label: "Role title",
                value: request.title,
                key: "title" as const,
            },
            {
                label: "Employment type",
                value: request.employmentType,
                key: "employmentType" as const,
            },
            {
                label: "Work arrangement",
                value: request.workArrangement,
                key: "workLocation" as const,
            },
            {
                label: "Experience level",
                value: request.experienceLevel,
                key: "experienceLevel" as const,
            },
            {
                label: "Experience (years)",
                value: `${request.experienceMinYears} - ${request.experienceMaxYears}`,
                key: "experienceRange" as const,
            },
            {
                label: "Salary range",
                value: `${request.salaryMin} - ${request.salaryMax} ${request.currencyCode}`,
                key: "salary" as const,
            },
            {
                label: "Open positions",
                value: String(request.numberOfPositions),
                key: "numberOfPositions" as const,
            },
            {
                label: "Application deadline",
                value: formatDeadline(request.applicationDeadline),
                key: "applicationDeadline" as const,
            },
            {
                label: "Location",
                value: location,
                key: "workLocation" as const,
            },
        ];
    }, [request]);

    if (!request) {
        return (
            <div className="min-h-screen bg-mesh-gradient text-foreground">
                <main className="mx-auto max-w-[900px] px-10 py-10">
                    {pageError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 animate-in shake-1">
                            {pageError}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/20 bg-white/40 backdrop-blur-md px-4 py-3 text-[14px] text-muted-foreground animate-pulse">
                            Loading job details...
                        </div>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="py-12">
                <div className="mx-auto max-w-[900px]">
                    <JobSummaryHeader
                        isEditMode={isEditMode}
                        onClose={() => {
                            if (isEditMode) {
                                router.push("/employer/dashboard");
                                return;
                            }
                            setModal("leave");
                        }}
                    />

                    <div className="mb-12">
                        <h2 className="text-3xl font-black tracking-tighter text-foreground text-center">
                            {isEditMode
                                ? "Refine Your Job Posting"
                                : "Review Your Job Description"}
                        </h2>
                        <p className="text-center text-muted-foreground mt-2 font-medium">
                            Take a moment to review the details and the AI-generated content before publishing.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {pageError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 animate-in shake-1">
                                {pageError}
                            </div>
                        )}

                        <JobSummaryDetailsSection
                            detailRows={detailRows}
                            onEdit={openDetailEditor}
                        />

                        <JobSummarySkillsSection
                            skills={skills}
                            skillsError={contentErrors.skills}
                            onAddSkill={addSkill}
                            onUpdateSkill={updateSkill}
                            onRemoveSkill={removeSkill}
                        />

                        <JobSummaryDescriptionSection
                            editableDescription={editableDescription}
                            isGeneratingDescription={isGeneratingDescription}
                            pageError={descriptionGenerationError}
                            descriptionError={contentErrors.description}
                            onDescriptionChange={handleDescriptionChange}
                        />

                        <JobSummaryFooter
                            isEditMode={isEditMode}
                            isSaving={isSaving}
                            isGeneratingDescription={isGeneratingDescription}
                            originalStatus={originalStatus}
                            onDiscard={() => router.push("/employer/dashboard")}
                            onDraft={() => setModal("draft")}
                            onPublish={handlePublishClick}
                            onSaveChanges={handleSaveChangesClick}
                        />
                    </div>
                </div>
            </Container>

            <JobSummaryModal
                modal={modal}
                loadingMessage={loadingMessage}
                editingDetail={editingDetail}
                editDetailTitleMap={editDetailTitleMap}
                detailError={detailError}
                detailDraft={detailDraft}
                isSaving={isSaving}
                isGeneratingDescription={isGeneratingDescription}
                onClose={closeModal}
                onConfirmLeave={() => setModal("draft")}
                onRequestDraftCancel={() => setModal("draftWarning")}
                onCancelDraft={() => {
                    closeModal();
                    router.push("/employer/dashboard");
                }}
                onSubmit={(mode) => void submitJob(mode)}
                onDetailDraftChange={onDetailDraftChange}
                onSaveSingleDetail={saveSingleDetail}
            />
        </div>
    );
};
