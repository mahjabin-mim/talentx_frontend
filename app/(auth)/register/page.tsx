// Notice: No "use client" here. This is a Server Component wrapper.
import { CredentialsStep } from "../../../features/Authentications/Authentications.Components/CredentialsStep";
export const metadata = {
    title: "Create Account | TalentX",
    description: "Register for a new TalentX account.",
};

export default function RegisterPage() {
    return <CredentialsStep />;
}
