import { Suspense } from "react";
import { VerifyEmailStep } from "@/features/Authentications/Authentications.Components/VerifyEmailStep";

export const metadata = {
    title: "Verify Email | TalentX",
    description: "Verify your TalentX account email.",
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={null}>
            <VerifyEmailStep />
        </Suspense>
    );
}
