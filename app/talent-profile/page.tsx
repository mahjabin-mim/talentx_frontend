"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import PageLoader from "@/components/PageLoader/PageLoader";
import Input from "@/features/talent-profile/talent-profile.components/talent-profile.input";
import Section from "@/features/talent-profile/talent-profile.components/talent-profile.Section";
import Textarea from "@/features/talent-profile/talent-profile.components/talent-profile.textarea";
import { useTalentProfile } from "@/features/talent-profile/talent-profile.hooks";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
    Briefcase,
    Code2,
    DollarSign,
    FileText,
    Globe,
    Image as ImageIcon,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Save,
    ShieldCheck,
    Sparkles,
    Trash2,
    User,
    UserRound,
    Video,
    Wallet,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TalentProfilePage() {
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [hasPictureLoadError, setHasPictureLoadError] = useState(false);
    const [localPictureFallbackUrl, setLocalPictureFallbackUrl] = useState<
        string | null
    >(null);
    const {
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
        canAddSkill,
        maxSkillCount,
        skillLanguageOptions,
        loading,
        isProfileLoading,
        isEditing,
        profileError,
        saveMessage,
        startEditing,
        cancelEditing,
        selectedResumeFile,
        selectedPictureFile,
        resumeDisplayName,
        pictureDisplayName,
    } = useTalentProfile();
    const profileName = watch("name");
    const profilePictureUrl = watch("pictureUrl");
    const profileResumeUrl = watch("resumeUrl");
    const previewPictureUrl = useMemo(() => {
        if (!selectedPictureFile) {
            return null;
        }

        return URL.createObjectURL(selectedPictureFile);
    }, [selectedPictureFile]);
    const activePictureSrc = previewPictureUrl
        ? previewPictureUrl
        : profilePictureUrl && !hasPictureLoadError
          ? profilePictureUrl
          : localPictureFallbackUrl;

    const toNumberValue = (value: string) => (value === "" ? 0 : Number(value));
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
            const isHttp =
                url.protocol === "http:" || url.protocol === "https:";
            const host = url.hostname.toLowerCase();
            const isLinkedInHost =
                host === "linkedin.com" || host.endsWith(".linkedin.com");
            return isHttp && isLinkedInHost;
        } catch {
            return false;
        }
    };
    const fieldLabelClass =
        "block text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 mb-2";
    const fieldInputClass =
        "h-12 w-full rounded-xl border border-border bg-white px-4 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:bg-muted/30 disabled:text-muted-foreground";
    const panelClass =
        "rounded-2xl border border-border bg-white/40 p-6 shadow-sm backdrop-blur-sm";

    useEffect(() => {
        if (!saveMessage) {
            return;
        }

        setShowSavePopup(true);
        window.scrollTo({ top: 0, behavior: "smooth" });

        const timer = window.setTimeout(() => {
            setShowSavePopup(false);
        }, 2200);

        return () => window.clearTimeout(timer);
    }, [saveMessage]);

    useEffect(() => {
        setHasPictureLoadError(false);
    }, [profilePictureUrl, previewPictureUrl]);

    useEffect(() => {
        if (!previewPictureUrl) {
            return;
        }

        setLocalPictureFallbackUrl((previousUrl) => {
            if (previousUrl && previousUrl !== previewPictureUrl) {
                URL.revokeObjectURL(previousUrl);
            }
            return previewPictureUrl;
        });
    }, [previewPictureUrl]);

    useEffect(() => {
        return () => {
            if (previewPictureUrl) {
                URL.revokeObjectURL(previewPictureUrl);
            }
            if (localPictureFallbackUrl) {
                URL.revokeObjectURL(localPictureFallbackUrl);
            }
        };
    }, [previewPictureUrl, localPictureFallbackUrl]);

    useEffect(() => {
        const getFirstErrorPath = (
            errorNode: unknown,
            parentPath = "",
        ): string | null => {
            if (!errorNode || typeof errorNode !== "object") {
                return null;
            }

            const entries = Object.entries(
                errorNode as Record<string, unknown>,
            );

            for (const [key, value] of entries) {
                const path = parentPath ? `${parentPath}.${key}` : key;

                if (
                    value &&
                    typeof value === "object" &&
                    "message" in (value as Record<string, unknown>)
                ) {
                    return path;
                }

                const nestedPath = getFirstErrorPath(value, path);
                if (nestedPath) {
                    return nestedPath;
                }
            }

            return null;
        };

        const firstErrorPath = getFirstErrorPath(errors);
        if (!firstErrorPath) {
            return;
        }

        const selector = `[name="${firstErrorPath}"]`;
        const target = document.querySelector(selector) as HTMLElement | null;

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.focus({ preventScroll: true });
        }
    }, [errors]);

    if (isProfileLoading) {
        return <PageLoader message="Loading your profile..." />;
    }

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="pb-20 pt-16">
                {showSavePopup && saveMessage ? (
                    <div className="fixed bottom-6 right-4 z-50 max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-bold text-emerald-700 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={18} />
                            {saveMessage}
                        </div>
                    </div>
                ) : null}

                {/* HEADER */}
                <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="animate-in slide-in-from-left duration-700">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1">
                            <Sparkles
                                size={14}
                                className="text-brand-primary"
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                Talent Profile Management
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                            Refine Your{" "}
                            <span className="text-gradient">Identity</span>
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Update your professional presence and stand out to
                            potential employers.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 animate-in fade-in zoom-in duration-500">
                        <span
                            className={`hidden md:inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                                isEditing
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                    : "border-slate-200 bg-white text-slate-500 shadow-sm"
                            }`}
                        >
                            {isEditing ? (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Editing Enabled
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={14} />
                                    Read-only Mode
                                </>
                            )}
                        </span>

                        {isEditing ? (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="h-12 rounded-xl border-2 border-slate-200 bg-white px-6 text-xs font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-50 active:scale-95 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="talent-profile-form"
                                    disabled={loading}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-hover hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <Save size={18} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                    startEditing();
                                }}
                                className="inline-flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl bg-brand-primary px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/25 transition-all hover:bg-brand-hover hover:scale-[1.05] active:scale-[0.95]"
                            >
                                <Pencil size={20} /> Edit Profile
                            </button>
                        )}
                    </div>
                </header>

                <form
                    id="talent-profile-form"
                    className="mx-auto max-w-5xl space-y-10"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {profileError ? (
                        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800 animate-in shake-1">
                            {profileError}
                        </div>
                    ) : null}

                    {/* SECTION 1: CORE IDENTITY */}
                    <Section
                        title="Profile Identity"
                        icon={<UserRound size={22} />}
                    >
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-8 space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Input
                                        label="Full Name"
                                        placeholder="Enter your full name"
                                        errorText={errors.name?.message}
                                        invalid={Boolean(errors.name)}
                                        required
                                        disabled={!isEditing}
                                        {...register("name", {
                                            required: "Name is required.",
                                        })}
                                    />
                                    <Input
                                        label="Email Address"
                                        placeholder="Enter your email address"
                                        type="email"
                                        errorText={errors.email?.message}
                                        invalid={Boolean(errors.email)}
                                        required
                                        disabled
                                        {...register("email", {
                                            required: "Email is required.",
                                            validate: (value) =>
                                                isValidEmail(value) ||
                                                "Please enter a valid email address.",
                                        })}
                                    />
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Input
                                        label="Phone Number"
                                        placeholder="Enter phone number with country code"
                                        type="tel"
                                        //helperText="Enter valid phone number with country code"
                                        errorText={errors.phoneNumber?.message}
                                        invalid={Boolean(errors.phoneNumber)}
                                        required
                                        disabled={!isEditing}
                                        {...register("phoneNumber", {
                                            required:
                                                "Phone number is required.",
                                            validate: (value) => {
                                                return (
                                                    isValidPhoneNumber(value) ||
                                                    "Please enter a valid phone number."
                                                );
                                            },
                                        })}
                                    />
                                    <Input
                                        label="Location"
                                        placeholder="City, Country"
                                        errorText={errors.location?.message}
                                        invalid={Boolean(errors.location)}
                                        required
                                        disabled={!isEditing}
                                        {...register("location", {
                                            required: "Location is required.",
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-4 border-l border-border/50 pl-0 lg:pl-10">
                                <div className="flex flex-col items-center gap-4">
                                    <label className={fieldLabelClass}>
                                        Profile Picture
                                    </label>
                                    <div className="group relative">
                                        <div className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-brand-primary text-4xl font-black text-white shadow-2xl overflow-hidden">
                                            {activePictureSrc &&
                                            !hasPictureLoadError ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={activePictureSrc}
                                                    alt="Profile"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={() =>
                                                        setHasPictureLoadError(
                                                            true,
                                                        )
                                                    }
                                                />
                                            ) : (
                                                (profileName || "T")
                                                    .slice(0, 1)
                                                    .toUpperCase()
                                            )}
                                        </div>
                                        {isEditing && (
                                            <label
                                                htmlFor="profile-picture-upload"
                                                className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-white border-2 border-brand-primary/10 text-brand-primary shadow-lg transition-all hover:scale-110 active:scale-95"
                                            >
                                                <Plus size={20} />
                                            </label>
                                        )}
                                    </div>
                                    <input
                                        id="profile-picture-upload"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        disabled={!isEditing}
                                        onChange={(e) =>
                                            handlePictureFileChange(
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                        className="sr-only"
                                    />
                                    <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">
                                        {pictureDisplayName ||
                                            (profilePictureUrl
                                                ? "Active Image"
                                                : "None")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 2: CAREER DOCUMENTS (MOVED UP) */}
                    <Section
                        title="Career Documents"
                        icon={<FileText size={22} />}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8 p-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                                <FileText size={40} />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-sm font-black uppercase tracking-widest text-foreground">
                                    Professional Resume{" "}
                                    <span className="text-destructive">*</span>
                                </p>
                                <p className="text-xs font-medium text-muted-foreground mt-1">
                                    Supported formats: PDF only, File size
                                    limit: 2MB
                                </p>
                                <div className="mt-4 flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                    <label
                                        htmlFor="resume-upload"
                                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 text-[10px] font-black uppercase tracking-widest text-white transition-all ${
                                            isEditing
                                                ? "cursor-pointer hover:bg-brand-hover shadow-lg"
                                                : "opacity-50 cursor-not-allowed"
                                        } ${
                                            errors.resumeUrl
                                                ? "ring-4 ring-destructive/20"
                                                : ""
                                        }`}
                                    >
                                        <Plus size={16} />{" "}
                                        {resumeDisplayName
                                            ? "Replace PDF"
                                            : "Upload Resume"}
                                    </label>
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf"
                                        disabled={!isEditing}
                                        onChange={(e) =>
                                            handleResumeFileChange(
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                        className="sr-only"
                                    />
                                    <span className="text-[10px] font-black text-brand-primary uppercase underline underline-offset-4 decoration-2">
                                        {resumeDisplayName ||
                                            (profileResumeUrl
                                                ? "Resume Active"
                                                : "No File Selected")}
                                    </span>
                                </div>
                                {errors.resumeUrl?.message ? (
                                    <p className="mt-2 text-[10px] font-bold text-destructive uppercase tracking-tight">
                                        {errors.resumeUrl.message}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 3: PROFESSIONAL PRESENCE */}
                    <Section
                        title="Professional Identity"
                        icon={<Briefcase size={22} />}
                    >
                        <div className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Input
                                    label="Tagline"
                                    placeholder="e.g. Principal DevOps Engineer"
                                    errorText={errors.tagline?.message}
                                    invalid={Boolean(errors.tagline)}
                                    required
                                    disabled={!isEditing}
                                    {...register("tagline", {
                                        required: "Tagline is required.",
                                    })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className={fieldLabelClass}>
                                            Exp. (Years){" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            disabled={!isEditing}
                                            {...register("experience", {
                                                setValueAs: toNumberValue,
                                                validate: (v) =>
                                                    v > 0 || "Required",
                                            })}
                                            className={`${fieldInputClass} ${
                                                errors.experience
                                                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                    : ""
                                            }`}
                                        />
                                        {errors.experience?.message ? (
                                            <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                                                {errors.experience.message}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="space-y-2">
                                        <label className={fieldLabelClass}>
                                            Expected Salary{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <Wallet
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                size={14}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                disabled={!isEditing}
                                                {...register("expectedSalary", {
                                                    setValueAs: toNumberValue,
                                                    validate: (v) =>
                                                        v > 0 || "Required",
                                                })}
                                                className={`${fieldInputClass} pl-8 ${
                                                    errors.expectedSalary
                                                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                        {errors.expectedSalary?.message ? (
                                            <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                                                {errors.expectedSalary.message}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <Input
                                    label={
                                        <>
                                            LinkedIn URL{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </>
                                    }
                                    placeholder="https://linkedin.com/..."
                                    type="url"
                                    errorText={errors.linkedin?.message}
                                    invalid={Boolean(errors.linkedin)}
                                    disabled={!isEditing}
                                    {...register("linkedin", {
                                        required: "LinkedIn required.",
                                        validate: (v) =>
                                            isValidLinkedInUrl(v) ||
                                            "Invalid URL",
                                    })}
                                />
                                <Input
                                    label={
                                        <>
                                            Portfolio / Additional Link{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </>
                                    }
                                    placeholder="https://..."
                                    type="url"
                                    errorText={errors.additionalUrl?.message}
                                    invalid={Boolean(errors.additionalUrl)}
                                    required
                                    disabled={!isEditing}
                                    {...register("additionalUrl", {
                                        required:
                                            "Portfolio / additional link is required.",
                                        validate: (v) =>
                                            isValidHttpUrl(v) ||
                                            "Invalid URL",
                                    })}
                                />
                                <Input
                                    label="Video Introduction URL"
                                    placeholder="YouTube / Loom / Drive"
                                    type="url"
                                    errorText={errors.videoIntro?.message}
                                    invalid={Boolean(errors.videoIntro)}
                                    disabled={!isEditing}
                                    {...register("videoIntro", {
                                        validate: (v) =>
                                            !v ||
                                            isValidHttpUrl(v) ||
                                            "Invalid URL",
                                    })}
                                />
                            </div>

                            <Textarea
                                label="Professional Biography"
                                placeholder="Tell your professional story..."
                                rows={5}
                                errorText={errors.bio?.message}
                                invalid={Boolean(errors.bio)}
                                disabled={!isEditing}
                                {...register("bio")}
                            />
                        </div>
                    </Section>

                    {/* SECTION 4: WORK & SKILLS */}
                    <div className="space-y-10">
                        <Section
                            title="Workplaces & History"
                            icon={<FileText size={22} />}
                        >
                            <Textarea
                                label="Previous & Current Roles"
                                placeholder="List your key professional experiences..."
                                rows={6}
                                errorText={errors.workplaces?.message}
                                invalid={Boolean(errors.workplaces)}
                                disabled={!isEditing}
                                {...register("workplaces")}
                            />
                        </Section>

                        <Section
                            title="Skill Expertise"
                            icon={<Code2 size={22} />}
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-foreground">
                                            Linguistic & Technical Skills
                                        </p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                                            {skillFields.length} of{" "}
                                            {maxSkillCount} Added
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        disabled={!canAddSkill}
                                        className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-primary/10 px-4 text-[10px] font-black uppercase tracking-widest text-brand-primary transition-all hover:bg-brand-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Plus size={14} /> Add Skill
                                    </button>
                                </div>

                                {skillFields.length === 0 ? (
                                    <div className="py-10 text-center rounded-2xl border-2 border-dashed border-border/50 bg-white/30">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            No skills defined.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {skillFields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="flex flex-col gap-4 p-2 transition-all md:flex-row md:items-end"
                                            >
                                                <div className="w-full md:flex-1">
                                                    <label
                                                        className={
                                                            fieldLabelClass
                                                        }
                                                    >
                                                        Language / Skill{" "}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Controller
                                                        control={control}
                                                        name={`skills.${index}.language`}
                                                        rules={{
                                                            required:
                                                                "Language / skill is required.",
                                                        }}
                                                        render={({
                                                            field: {
                                                                value,
                                                                onChange,
                                                            },
                                                        }) => (
                                                            <Select
                                                                disabled={
                                                                    !isEditing
                                                                }
                                                                value={value}
                                                                onValueChange={
                                                                    onChange
                                                                }
                                                            >
                                                                <SelectTrigger
                                                                    name={`skills.${index}.language`}
                                                                    className={`!h-12 w-full rounded-xl bg-white text-sm font-bold ${
                                                                        errors
                                                                            .skills?.[
                                                                            index
                                                                        ]
                                                                            ?.language
                                                                            ? "border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/20"
                                                                            : "border-border"
                                                                    }`}
                                                                >
                                                                    <SelectValue placeholder="Select Option" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {skillLanguageOptions.map(
                                                                        (
                                                                            lang,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    lang
                                                                                }
                                                                                value={
                                                                                    lang
                                                                                }
                                                                            >
                                                                                {
                                                                                    lang
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                    <div className="mt-2 min-h-[14px]">
                                                        {errors.skills?.[index]
                                                            ?.language
                                                            ?.message ? (
                                                            <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                                                                {
                                                                    errors
                                                                        .skills[
                                                                        index
                                                                    ]?.language
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="w-full md:w-56">
                                                    <label
                                                        className={
                                                            fieldLabelClass
                                                        }
                                                    >
                                                        Years{" "}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0.5"
                                                        step="0.5"
                                                        disabled={!isEditing}
                                                        {...register(
                                                            `skills.${index}.experience`,
                                                            {
                                                                required:
                                                                    "Years are required.",
                                                                validate: (
                                                                    value,
                                                                ) =>
                                                                    Number(
                                                                        value,
                                                                    ) > 0 ||
                                                                    "Years must be greater than zero.",
                                                            },
                                                        )}
                                                        className={`${fieldInputClass} h-12 ${
                                                            errors.skills?.[
                                                                index
                                                            ]?.experience
                                                                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                                                : ""
                                                        }`}
                                                    />
                                                    <div className="mt-2 min-h-[14px]">
                                                        {errors.skills?.[index]
                                                            ?.experience
                                                            ?.message ? (
                                                            <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                                                                {
                                                                    errors
                                                                        .skills[
                                                                        index
                                                                    ]
                                                                        ?.experience
                                                                        ?.message
                                                                }
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="w-12">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeSkill(index)
                                                        }
                                                        disabled={!isEditing}
                                                        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 transition-all hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <div className="mt-2 min-h-[14px]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Section>
                    </div>
                </form>
            </Container>
        </div>
    );
}
