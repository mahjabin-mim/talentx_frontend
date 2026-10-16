import { Suspense } from "react";
import ApplyForm from "@/features/apply/apply.components/apply.form";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ApplyForm />
        </Suspense>
    );
}
