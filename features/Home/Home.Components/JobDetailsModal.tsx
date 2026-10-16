import { X } from "lucide-react";
import { JobDetailsView } from "./JobDetailsView";

export const JobDetailsModal = ({
    jobId,
    fallbackCompanyName,
    onClose,
}: {
    jobId: string;
    fallbackCompanyName?: string | null;
    onClose: () => void;
}) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[850px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 shrink-0 rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a6cb0] z-10"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <JobDetailsView
                    jobId={jobId}
                    fallbackCompanyName={fallbackCompanyName}
                />
            </div>
        </div>
    );
};
