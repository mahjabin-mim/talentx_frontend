"use client";

import { useParams } from "next/navigation";
import TalentDiscoveryView from "@/features/TalentDiscovery/TalentDiscovery.Components/TalentDiscoveryView";

export default function JobTalentsPage() {
    const params = useParams();
    const jobId = params.jobId as string;

    return <TalentDiscoveryView jobId={jobId} />;
}
