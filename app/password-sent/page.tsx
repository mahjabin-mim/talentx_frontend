import Link from "next/link";

export default function PasswordSentPage() {
    return (
        <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(45deg,#534593_0%,#4a6cb0_100%)]">
            <div className="scale-[0.8] rounded-[28px] border-[3px] border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.2)_100%)] p-3 backdrop-blur-[120px]">
                <div className="w-[520px] rounded-2xl bg-white px-9 py-[50px] text-center">
                    <div className="mb-7 text-[20px] font-extrabold text-[#111827]">
                        <span className="text-[#111827]">Talent</span>
                        <span className="text-[#5b86e5]">X</span>
                    </div>

                    <h1 className="mb-4 text-[22px] font-bold text-[#111827]">
                        Check Your Email
                    </h1>

                    <p className="mb-8 text-[14px] leading-7 text-[#6b7280]">
                        We have sent your temporary password to your email.
                        <br />
                        Your application is submitted successfully. To track
                        your progress please Sign In.
                    </p>

                    <Link
                        href="/signin"
                        className="block w-full rounded-[8px] bg-[#5571a9] px-3 py-3 text-[14px] font-semibold text-white transition hover:bg-[#465d91]"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </main>
    );
}
