import { describe, expect, it } from "vitest";
import { AxiosError } from "axios";
import {
    extractApiError,
    resolvePostAuthRoute,
} from "./Authentications.helper";
import { UserRole } from "./Authentications.enum";

describe("extractApiError", () => {
    it("returns validation field error from backend problem payload", () => {
        const error = new AxiosError(
            "Request failed",
            "400",
            undefined,
            undefined,
            {
                status: 400,
                statusText: "Bad Request",
                headers: {},
                config: {} as never,
                data: {
                    errors: {
                        Password: ["Password must contain uppercase."],
                    },
                },
            },
        );

        const message = extractApiError(error, "fallback");
        expect(message).toBe("Password must contain uppercase.");
    });

    it("returns ProblemDetails detail when present", () => {
        const error = new AxiosError("Conflict", "409", undefined, undefined, {
            status: 409,
            statusText: "Conflict",
            headers: {},
            config: {} as never,
            data: {
                title: "Conflict",
                detail: "Email is already registered.",
            },
        });

        const message = extractApiError(error, "fallback");
        expect(message).toBe("Email is already registered.");
    });

    it("returns a clearer timeout message for aborted requests", () => {
        const error = new AxiosError(
            "timeout of 15000ms exceeded",
            "ECONNABORTED",
        );

        const message = extractApiError(error, "fallback");
        expect(message).toBe(
            "The request took too long to complete. Please wait a moment and check whether it already succeeded before retrying.",
        );
    });

    it("returns talent dashboard for talent accounts", () => {
        expect(resolvePostAuthRoute(UserRole.TALENT)).toBe("/talent-dashboard");
    });

    it("returns employer dashboard for employer accounts", () => {
        expect(resolvePostAuthRoute(UserRole.EMPLOYER)).toBe(
            "/employer/dashboard",
        );
    });
});
