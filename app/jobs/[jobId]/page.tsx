"use client";

import { useParams } from "next/navigation";
import { JobDetailsView } from "@/features/Home/Home.Components/JobDetailsView";
import { Container } from "@/components/ui/container";

export default function JobPage() {
    const params = useParams();
    const jobId = params.jobId as string;

    return (
        <div className="min-h-screen bg-mesh-gradient text-foreground">
            <Container className="pb-32 pt-16 max-w-[1100px]">
                <JobDetailsView jobId={jobId} showBackButton={true} />
            </Container>
        </div>
    );
}
