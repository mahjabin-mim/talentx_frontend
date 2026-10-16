import { Suspense } from "react";
import { JobSummaryView } from "@/features/Jobs/Jobs.Components/JobSummaryView";

export const metadata = {
    title: "Edit Job | TalentX",
    description: "Edit an existing job post and update the job description.",
};

export default function EditJobPage() {
    return (
        <Suspense fallback={null}>
            <JobSummaryView mode="edit" />
        </Suspense>
    );
}
