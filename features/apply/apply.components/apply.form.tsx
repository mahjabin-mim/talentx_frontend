"use client";

import { useApply } from "@/features/apply/apply.hooks";
import {
    Loader2,
    Send,
    ArrowLeft,
    Sparkles,
    UserRound,
    GraduationCap,
    Briefcase,
    FileText,
    Globe,
    ShieldCheck,
    Wallet,
    Link as LinkIcon,
    AlertCircle,
    Plus,
} from "lucide-react";
import { Container } from "@/components/ui/container";

export default function ApplyForm() {
    const {
        register,
        resumeFile,
        savedResumeName,
        fieldErrors,
        resumeError,
        isExtracting,
        isExtracted,
        isSubmitting,
        submissionError,
        extractionError,
        jobTitle,
        isLoadingJob,
        showDuplicateWarning,
        handleResumeChange,
        handleSubmit,
        handleBack,
        confirmDuplicateAndSubmit,
        cancelDuplicateSubmission,
    } = useApply();

    const fieldLabelClass =
        "mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-foreground/90";
    const fieldInputClass =
        "h-12 w-full rounded-xl border border-border bg-white px-4 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:bg-muted/30 disabled:text-muted-foreground";

    const getFieldInputClass = (hasError: boolean) =>
        `${fieldInputClass} ${hasError ? "border-destructive focus:border-destructive focus:ring-destructive/20" : ""}`;

    const getFieldError = (message?: string) =>
        message ? (
            <p className="mt-2 text-[10px] font-bold text-destructive uppercase tracking-tight">
                {message}
            </p>
        ) : null;

    const Section = ({
        title,
        icon,
        children,
    }: {
        title: string;
        icon: React.ReactNode;
        children: React.ReactNode;
    }) => (
        <section className="space-y-6 rounded-3xl border border-border bg-white/50 p-6 shadow-sm backdrop-blur-sm md:p-8">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <div className="text-brand-primary">{icon}</div>
                <h2 className="text-lg font-black tracking-tight text-foreground uppercase">
                    {title}
                </h2>
            </div>
            <div className="space-y-5">{children}</div>
        </section>
    );

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="pb-32 pt-16">
                {/* HEADER */}
                <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="animate-in slide-in-from-left duration-700">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 border border-brand-primary/10">
                            <Sparkles
                                size={14}
                                className="text-brand-primary"
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                                Secure Application Pipeline
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                            {isLoadingJob ? (
                                <>
                                    Position{" "}
                                    <span className="text-gradient">
                                        Application
                                    </span>
                                </>
                            ) : (
                                <>
                                    Application for{" "}
                                    <span className="text-gradient">
                                        {jobTitle || "Position"}
                                    </span>
                                </>
                            )}
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Showcase your expertise and take the next step in
                            your career.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="group inline-flex h-12 items-center gap-3 rounded-full border border-border bg-white/50 py-2 pl-4 pr-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-lg backdrop-blur-sm cursor-pointer"
                    >
                        <ArrowLeft
                            size={14}
                            className="transition-transform group-hover:-translate-x-1"
                        />
                        Cancel & Return
                    </button>
                </header>

                <form
                    id="apply-form"
                    className="mx-auto max-w-5xl space-y-10"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {submissionError && (
                        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800 animate-in shake-1">
                            {submissionError}
                        </div>
                    )}

                    {/* SECTION 1: PERSONAL INFO */}
                    <Section
                        title="Personal Information"
                        icon={<UserRound size={22} />}
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="Name"
                                    className={fieldLabelClass}
                                >
                                    Full Name{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="Name"
                                    placeholder="Enter your full name"
                                    required
                                    {...register.Name}
                                    className={getFieldInputClass(
                                        Boolean(fieldErrors.Name),
                                    )}
                                />
                                {getFieldError(fieldErrors.Name?.message)}
                            </div>
                            <div>
                                <label
                                    htmlFor="Email"
                                    className={fieldLabelClass}
                                >
                                    Email Address{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="Email"
                                    placeholder="Enter your email address"
                                    required
                                    {...register.Email}
                                    className={getFieldInputClass(
                                        Boolean(fieldErrors.Email),
                                    )}
                                />
                                <p className="mt-1 text-[11px] font-normal normal-case tracking-normal text-muted-foreground/75">
                                    Enter a valid email address, e.g.
                                    yourname@gmail.com
                                </p>
                                {getFieldError(fieldErrors.Email?.message)}
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="ContactNumber"
                                    className={fieldLabelClass}
                                >
                                    Contact Number{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="ContactNumber"
                                    placeholder="Enter your phone number"
                                    required
                                    {...register.ContactNumber}
                                    className={getFieldInputClass(
                                        Boolean(fieldErrors.ContactNumber),
                                    )}
                                />
                                <p className="mt-1 text-[11px] font-normal normal-case tracking-normal text-muted-foreground/75">
                                    Enter a valid phone number with country
                                    code, e.g. +8801234567890
                                </p>
                                {getFieldError(
                                    fieldErrors.ContactNumber?.message,
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="Location"
                                    className={fieldLabelClass}
                                >
                                    Current Location{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="Location"
                                    placeholder="City, Country"
                                    required
                                    {...register.Location}
                                    className={getFieldInputClass(
                                        Boolean(fieldErrors.Location),
                                    )}
                                />
                                {getFieldError(fieldErrors.Location?.message)}
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 2: CAREER ASSET (RESUME) */}
                    <Section
                        title="Career Document"
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
                                        htmlFor="resume"
                                        className="cursor-pointer inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-brand-hover shadow-lg"
                                    >
                                        <Plus size={16} />{" "}
                                        {resumeFile || savedResumeName
                                            ? "Change Resume"
                                            : "Upload Resume"}
                                    </label>
                                    <input
                                        type="file"
                                        id="resume"
                                        accept=".pdf"
                                        required={!savedResumeName}
                                        onChange={handleResumeChange}
                                        className="sr-only"
                                    />
                                    <span className="text-[10px] font-black text-brand-primary uppercase underline underline-offset-4 decoration-2">
                                        {resumeFile
                                            ? resumeFile.name
                                            : savedResumeName
                                              ? `Using saved: ${savedResumeName}`
                                              : "No File Selected"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {getFieldError(resumeError ?? undefined)}

                        {isExtracting && (
                            <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 p-4">
                                <Loader2
                                    size={18}
                                    className="animate-spin text-brand-primary"
                                />
                                <span className="text-xs font-black text-brand-primary uppercase tracking-widest">
                                    Extracting intelligence from resume...
                                </span>
                            </div>
                        )}

                        {isExtracted && !isExtracting && (
                            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                                <ShieldCheck
                                    size={18}
                                    className="text-emerald-600"
                                />
                                <span className="text-xs font-bold text-emerald-700">
                                    AI has extracted key details. Please verify
                                    the information below.
                                </span>
                            </div>
                        )}
                    </Section>

                    {/* EXTRACTION ERROR DISPLAY - Target placement for AI populated fields */}
                    {extractionError && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-4 animate-in slide-in-from-top-2">
                            <AlertCircle
                                className="text-amber-600 shrink-0 mt-0.5"
                                size={20}
                            />
                            <div className="space-y-1">
                                <p className="text-sm font-black text-amber-900 uppercase tracking-tight">
                                    AI Rate limit Hit
                                </p>
                                <p className="text-sm font-medium text-amber-800 leading-relaxed">
                                    {extractionError}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SECTION 3: ACADEMIC CREDENTIALS */}
                    <Section
                        title="Academic History"
                        icon={<GraduationCap size={22} />}
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="md:col-span-1">
                                <label
                                    htmlFor="Education"
                                    className={fieldLabelClass}
                                >
                                    Educational Institute{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="Education"
                                    placeholder="Enter your university name"
                                    required
                                    {...register.Education}
                                    className={getFieldInputClass(
                                        Boolean(fieldErrors.Education),
                                    )}
                                />
                                {getFieldError(fieldErrors.Education?.message)}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="Department"
                                        className={fieldLabelClass}
                                    >
                                        Department{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="Department"
                                        placeholder="e.g. CSE"
                                        required
                                        {...register.Department}
                                        className={getFieldInputClass(
                                            Boolean(fieldErrors.Department),
                                        )}
                                    />
                                    {getFieldError(
                                        fieldErrors.Department?.message,
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="CGPA"
                                        className={fieldLabelClass}
                                    >
                                        Final CGPA{" "}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        id="CGPA"
                                        placeholder="e.g. 3.80"
                                        required
                                        {...register.CGPA}
                                        className={getFieldInputClass(
                                            Boolean(fieldErrors.CGPA),
                                        )}
                                    />
                                    {getFieldError(fieldErrors.CGPA?.message)}
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* SECTION 4: PROFESSIONAL NARRATIVE */}
                    <Section
                        title="Professional Information"
                        icon={<Briefcase size={22} />}
                    >
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="LinkedInUrl"
                                    className={fieldLabelClass}
                                >
                                    LinkedIn Profile{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <div className="relative">
                                    <Globe
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        size={16}
                                    />
                                    <input
                                        type="url"
                                        id="LinkedInUrl"
                                        placeholder="paste your LinkedIn profile URL"
                                        required
                                        {...register.LinkedInUrl}
                                        className={`${getFieldInputClass(Boolean(fieldErrors.LinkedInUrl))} pl-10`}
                                    />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground mt-1">
                                    Enter a valid LinkedIn URL, e.g.
                                    https://www.linkedin.com/in/your-profile
                                </p>
                                {getFieldError(
                                    fieldErrors.LinkedInUrl?.message,
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="AdditionalUrl"
                                    className={fieldLabelClass}
                                >
                                    Portfolio / Extra Link{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <div className="relative">
                                    <LinkIcon
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        size={16}
                                    />
                                    <input
                                        type="url"
                                        id="AdditionalUrl"
                                        placeholder="GitHub / Portfolio Website"
                                        required
                                        {...register.AdditionalUrl}
                                        className={`${getFieldInputClass(Boolean(fieldErrors.AdditionalUrl))} pl-10`}
                                    />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground mt-1">
                                    Enter a valid link, e.g.
                                    https://github.com/your-username
                                </p>
                                {getFieldError(
                                    fieldErrors.AdditionalUrl?.message,
                                )}
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="Experience"
                                    className={fieldLabelClass}
                                >
                                    Total Experience (Years){" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="Experience"
                                    placeholder="Enter total years of experience"
                                    required
                                    min="0"
                                    {...register.Experience}
                                    className={getFieldInputClass(
                                        Boolean(fieldErrors.Experience),
                                    )}
                                />
                                <p className="text-xs font-medium text-muted-foreground mt-1">
                                    If fresher, enter 0
                                </p>
                                {getFieldError(fieldErrors.Experience?.message)}
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="ExpectedSalary"
                                    className={fieldLabelClass}
                                >
                                    Expected Salary{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <div className="relative">
                                    <Wallet
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        size={16}
                                    />
                                    <input
                                        type="number"
                                        id="ExpectedSalary"
                                        placeholder="Enter amount"
                                        required
                                        min="0"
                                        {...register.ExpectedSalary}
                                        className={`${getFieldInputClass(Boolean(fieldErrors.ExpectedSalary))} pl-10`}
                                    />
                                </div>
                                {getFieldError(
                                    fieldErrors.ExpectedSalary?.message,
                                )}
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="CoverLetter"
                                className={fieldLabelClass}
                            >
                                Cover Letter{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <textarea
                                id="CoverLetter"
                                placeholder="Why are you the perfect match for this role?"
                                required
                                {...register.CoverLetter}
                                className={`min-h-[160px] w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 ${
                                    fieldErrors.CoverLetter
                                        ? "border-destructive focus:border-destructive"
                                        : ""
                                }`}
                            />
                            {getFieldError(fieldErrors.CoverLetter?.message)}
                        </div>
                    </Section>

                    {/* SUBMIT BUTTON - Aligned to the right, integrated into flow */}
                    <div className="flex justify-end pt-8 pb-20">
                        <button
                            type="submit"
                            form="apply-form"
                            disabled={isSubmitting}
                            className="group h-14 px-10 rounded-2xl bg-brand-primary text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.03] hover:bg-brand-hover active:scale-[0.97] disabled:opacity-60 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Transmitting...
                                </span>
                            ) : (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <Send
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                    />
                                    Submit Application
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </Container>

            {/* DUPLICATE WARNING MODAL */}
            {showDuplicateWarning ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
                    <div className="w-full max-w-md rounded-[3rem] border border-white/20 bg-white/90 p-10 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 ring-1 ring-black/5">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-500/10 text-amber-600">
                            <Sparkles size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">
                            Redundant Application
                        </h2>
                        <p className="mt-4 text-muted-foreground font-medium leading-relaxed italic opacity-80">
                            "You have already initiated an application for this
                            position. Do you wish to override the existing entry
                            or dispatch a duplicate?"
                        </p>
                        <div className="mt-10 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={cancelDuplicateSubmission}
                                className="h-12 px-6 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                            >
                                Revert
                            </button>
                            <button
                                type="button"
                                onClick={() => void confirmDuplicateAndSubmit()}
                                disabled={isSubmitting}
                                className="h-12 rounded-xl bg-brand-primary px-8 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-hover active:scale-95 transition-all"
                            >
                                Dispatch Anyway
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
