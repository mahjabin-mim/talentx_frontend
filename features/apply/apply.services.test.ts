import { beforeEach, describe, expect, it, vi } from "vitest";

const postMock = vi.fn();
const getMock = vi.fn();

vi.mock("@/lib/axios", () => ({
    default: {
        post: postMock,
        get: getMock,
    },
}));

describe("apply.services", () => {
    beforeEach(() => {
        postMock.mockReset();
        getMock.mockReset();
    });

    it("fetches the current talent profile basics", async () => {
        getMock.mockResolvedValueOnce({
            data: {
                name: "Mahjabin Mim",
                email: "mahjabin@example.com",
                phoneNumber: "+8801234567890",
                resumeUrl: "",
                resumeFileName: "",
            },
        });

        const { getTalentProfileMe } = await import("./apply.services");

        const result = await getTalentProfileMe();

        expect(getMock).toHaveBeenCalledWith("/talent-profile/me");
        expect(result).toEqual({
            name: "Mahjabin Mim",
            email: "mahjabin@example.com",
            phoneNumber: "+8801234567890",
            resumeUrl: "",
            resumeFileName: "",
        });
    });

    it("uploads a resume and returns extracted fields", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                education: "BSc in Computer Science",
                department: "Computer Science and Engineering",
                cgpa: "3.85/4.00",
                linkedInUrl: "https://linkedin.com/in/mahjabin",
                additionalUrl: "https://example.com/additional-info",
                location: "Dhaka, Bangladesh",
                expectedSalary: "1000",
                experience: "3",
            },
        });

        const { extractResumeData } = await import("./apply.services");
        const resumeFile = new File(["resume"], "resume.pdf", {
            type: "application/pdf",
        });

        const result = await extractResumeData(resumeFile);

        const [route, payload, config] = postMock.mock.calls[0] as [
            string,
            FormData,
            { timeout: number },
        ];

        expect(route).toBe("/applications/extract");
        expect(payload).toBeInstanceOf(FormData);
        expect(payload.get("Resume")).toBe(resumeFile);
        expect(config.timeout).toBe(120000);

        expect(result).toEqual({
            education: "BSc in Computer Science",
            department: "Computer Science and Engineering",
            cgpa: "3.85/4.00",
            linkedInUrl: "https://linkedin.com/in/mahjabin",
            additionalUrl: "https://example.com/additional-info",
            location: "Dhaka, Bangladesh",
            expectedSalary: "1000",
            experience: "3",
        });
    });

    it("submits a multipart application payload", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                ExistingUserFound: false,
                Name: "Mahjabin Mim",
                Email: "mahjabin@example.com",
                ContactNumber: "01700000000",
                Education: "BSc in Computer Science",
                Department: "Computer Science and Engineering",
                CGPA: "3.85/4.00",
                LinkedInUrl: "https://linkedin.com/in/mahjabin",
                AdditionalUrl: "https://portfolio.example.com",
                Location: "Dhaka",
                CoverLetter: "Cover letter",
                ExpectedSalary: 1000,
                Experience: 3,
            },
        });

        const { submitApplication } = await import("./apply.services");
        const resumeFile = new File(["resume"], "resume.pdf", {
            type: "application/pdf",
        });

        const result = await submitApplication(
            {
                Name: "  Mahjabin Mim  ",
                Email: " mahjabin@example.com ",
                ContactNumber: " 01700000000 ",
                Education: " BSc in Computer Science ",
                Department: " Computer Science and Engineering ",
                CGPA: " 3.85/4.00 ",
                LinkedInUrl: " https://linkedin.com/in/mahjabin ",
                AdditionalUrl: " https://portfolio.example.com ",
                Location: " Dhaka ",
                CoverLetter: " Cover letter ",
                ExpectedSalary: "1000",
                Experience: "3",
            },
            resumeFile,
            "job-123",
        );

        const [route, payload, config] = postMock.mock.calls[0] as [
            string,
            FormData,
            { timeout: number; headers?: Record<string, string> },
        ];

        expect(route).toBe("/applications");
        expect(payload).toBeInstanceOf(FormData);
        expect(payload.get("JobId")).toBe("job-123");
        expect(payload.get("Name")).toBe("Mahjabin Mim");
        expect(payload.get("Email")).toBe("mahjabin@example.com");
        expect(payload.get("ContactNumber")).toBe("01700000000");
        expect(payload.get("Education")).toBe("BSc in Computer Science");
        expect(payload.get("Department")).toBe(
            "Computer Science and Engineering",
        );
        expect(payload.get("CGPA")).toBe("3.85/4.00");
        expect(payload.get("LinkedInUrl")).toBe(
            "https://linkedin.com/in/mahjabin",
        );
        expect(payload.get("AdditionalUrl")).toBe(
            "https://portfolio.example.com",
        );
        expect(payload.get("Location")).toBe("Dhaka");
        expect(payload.get("CoverLetter")).toBe("Cover letter");
        expect(payload.get("ExpectedSalary")).toBe("1000");
        expect(payload.get("Experience")).toBe("3");
        expect(payload.get("Resume")).toBe(resumeFile);
        expect(config.timeout).toBe(120000);

        expect(result.Email).toBe("mahjabin@example.com");
    });

    it("throws when salary or experience is invalid", async () => {
        const { submitApplication } = await import("./apply.services");
        const resumeFile = new File(["resume"], "resume.pdf", {
            type: "application/pdf",
        });

        await expect(
            submitApplication(
                {
                    Name: "Mahjabin Mim",
                    Email: "mahjabin@example.com",
                    ContactNumber: "01700000000",
                    Education: "BSc in Computer Science",
                    Department: "Computer Science and Engineering",
                    CGPA: "3.85/4.00",
                    LinkedInUrl: "https://linkedin.com/in/mahjabin",
                    AdditionalUrl: "https://portfolio.example.com",
                    Location: "Dhaka",
                    CoverLetter: "Cover letter",
                    ExpectedSalary: "not-a-number",
                    Experience: "3",
                },
                resumeFile,
                "job-123",
            ),
        ).rejects.toThrow(
            "Expected salary and experience must be valid numbers.",
        );

        expect(postMock).not.toHaveBeenCalled();
    });
});
