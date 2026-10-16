import { Suspense } from "react";
import { JobSummaryView } from "@/features/Jobs/Jobs.Components/JobSummaryView";

export const metadata = {
    title: "Job Description | TalentX",
    description: "Review job details and write the job description manually.",
};

export default function JobSummaryPage() {
    return (
        <Suspense fallback={null}>
            <JobSummaryView />
        </Suspense>
    );
}
