import type { DeleteJobModalProps } from "../EmployerDashboard.interface";

export const DeleteJobModal = ({
    deleteTarget,
    setDeleteTarget,
    deleteJob,
    isMutatingJob,
}: DeleteJobModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="mb-2 text-[18px] font-bold">Delete job?</h3>
                <p className="mb-6 text-[14px] text-[#4b5563]">
                    Are you sure you want to delete &quot;{deleteTarget.title}
                    &quot;?
                </p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="flex-1 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[13px] font-semibold"
                        onClick={() => setDeleteTarget(null)}
                        disabled={isMutatingJob === deleteTarget.jobId}
                    >
                        No
                    </button>
                    <button
                        type="button"
                        className="flex-1 rounded-md border border-[#fed7aa] bg-[#ffedd5] px-3 py-2 text-[13px] font-semibold"
                        onClick={() => void deleteJob(deleteTarget)}
                        disabled={isMutatingJob === deleteTarget.jobId}
                    >
                        {isMutatingJob === deleteTarget.jobId
                            ? "Deleting..."
                            : "Yes"}
                    </button>
                </div>
            </div>
        </div>
    );
};
