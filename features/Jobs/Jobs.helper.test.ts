import { describe, expect, it } from "vitest";
import { toDigitsOnly, JobStatus } from "./Jobs.type";
import { isJobStatus } from "./Jobs.helper";

describe("Jobs Utilities", () => {
    describe("toDigitsOnly", () => {
        it("should strip non-numeric characters", () => {
            expect(toDigitsOnly("100,000$")).toBe("100000");
            expect(toDigitsOnly("salary: 5000")).toBe("5000");
            expect(toDigitsOnly("abc")).toBe("");
        });

        it("should return empty string for empty input", () => {
            expect(toDigitsOnly("")).toBe("");
        });
    });

    describe("isJobStatus Validation", () => {
        it("should return true for valid status strings", () => {
            expect(isJobStatus("Active")).toBe(true);
            expect(isJobStatus("Draft")).toBe(true);
            expect(isJobStatus(JobStatus.DEACTIVATED)).toBe(true);
        });

        it("should return false for invalid or typo-ridden statuses", () => {
            expect(isJobStatus("active")).toBe(false);
            expect(isJobStatus("Pending")).toBe(false);
            expect(isJobStatus("")).toBe(false);
        });
    });
});
