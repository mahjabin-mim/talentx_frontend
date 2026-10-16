import { PostJobWizard } from "@/features/Jobs/Jobs.Components/PostJobWizard";

export const metadata = {
    title: "Post a Job | TalentX",
    description: "Create a new job post.",
};

export default function NewJobPage() {
    return <PostJobWizard />;
}
