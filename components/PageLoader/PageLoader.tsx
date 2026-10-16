type PageLoaderProps = {
    message?: string;
};

export default function PageLoader({
    message = "Loading your dashboard...",
}: PageLoaderProps) {
    return (
        <main className="min-h-[calc(100vh-72px)] bg-muted/20 px-4 py-6 md:px-6">
            <section className="mx-auto max-w-6xl rounded-[24px] border border-border bg-background px-5 py-6 text-sm text-muted-foreground shadow-sm md:px-8">
                {message}
            </section>
        </main>
    );
}
