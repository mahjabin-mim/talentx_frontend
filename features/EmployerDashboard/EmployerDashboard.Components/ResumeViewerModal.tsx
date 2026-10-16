import { X, Loader2 } from "lucide-react";

interface ResumeViewerModalProps {
    dataUrl: string | null;
    applicantName: string;
    isLoading: boolean;
    onClose: () => void;
    error: string | null;
}

export const ResumeViewerModal = ({
    dataUrl,
    applicantName,
    isLoading,
    onClose,
    error,
}: ResumeViewerModalProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity"
            onClick={onClose}
        >
            <div
                className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h3 className="text-lg font-bold">
                        Resume: {applicantName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="relative flex-grow">
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            <p className="mt-2 text-sm text-gray-500">
                                Loading Resume...
                            </p>
                        </div>
                    )}
                    {dataUrl && !isLoading ? (
                        <iframe
                            src={dataUrl}
                            className="h-full w-full"
                            title={`Resume of ${applicantName}`}
                        />
                    ) : null}
                    {!isLoading && (error || !dataUrl) ? (
                        <div className="flex h-full w-full items-center justify-center">
                            <p className="text-gray-500">
                                {error || "Could not load resume."}
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
