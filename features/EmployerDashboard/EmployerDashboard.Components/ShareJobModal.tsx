"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Share2, X } from "lucide-react";
import type { ShareJobModalProps } from "../EmployerDashboard.interface";
import { sharePlatforms } from "../EmployerDashboard.type";

export const ShareJobModal = ({
    shareTarget,
    setShareTarget,
}: ShareJobModalProps) => {
    const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
        "idle",
    );

    const { url: shareUrl, error: urlError } = (() => {
        const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "";

        if (!shareTarget?.jobId) {
            return { url: "", error: "Job ID is missing." };
        }

        try {
            const url = new URL(`/jobs/${shareTarget.jobId}`, baseUrl);
            return { url: url.toString(), error: null };
        } catch {
            return { url: "", error: "Could not generate share link." };
        }
    })();

    const openShareWindow = (createShareUrl: (encodedUrl: string) => string) => {
        if (!shareUrl) return;
        const encodedUrl = encodeURIComponent(shareUrl);
        const platformUrl = createShareUrl(encodedUrl);
        window.open(platformUrl, "_blank", "noopener,noreferrer");
    };

    const handleCopy = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopyStatus("success");
        } catch {
            setCopyStatus("error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                className="share-modal-panel"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold">Quick Share Job</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {shareTarget?.title || "Unknown Job"}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="share-modal-close-btn"
                        onClick={() => setShareTarget(null)}
                        aria-label="Close share modal"
                    >
                        <X size={18} />
                    </button>
                </div>
                {urlError && (
                    <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                        {urlError}
                    </div>
                )}

                <div className="space-y-2">
                    {sharePlatforms.map((platform) => (
                        <button
                            key={platform.id}
                            type="button"
                            className={`share-option-btn ${platform.buttonVariantClassName}`}
                            onClick={() =>
                                openShareWindow(platform.createShareUrl)
                            }
                            disabled={!shareUrl}
                        >
                            <span className="share-option-content">
                                <Image
                                    src={platform.iconSrc}
                                    alt={platform.iconAlt}
                                    width={16}
                                    height={16}
                                    className="share-option-icon"
                                />
                                {platform.label}
                            </span>
                            <Share2 size={15} className="share-option-trailing" />
                        </button>
                    ))}

                    <button
                        type="button"
                        className="share-option-btn share-option-btn--default"
                        onClick={() => void handleCopy()}
                        disabled={!shareUrl}
                    >
                        <span className="share-option-content">
                            <Copy size={16} /> Copy URL
                        </span>
                        <Share2 size={15} className="share-option-trailing" />
                    </button>
                </div>

                {copyStatus === "success" ? (
                    <p className="share-copy-feedback share-copy-feedback--success">
                        URL copied to clipboard.
                    </p>
                ) : null}

                {copyStatus === "error" ? (
                    <p className="share-copy-feedback share-copy-feedback--error">
                        Copy failed. Please copy manually:
                    </p>
                ) : null}

                {copyStatus === "error" ? (
                    <p className="share-copy-fallback-url">
                        {shareUrl}
                    </p>
                ) : null}
            </div>
        </div>
    );
};
