import { beforeEach, describe, expect, it, vi } from "vitest";

const getMock = vi.fn();
const putMock = vi.fn();
const postMock = vi.fn();

vi.mock("@/lib/axios", () => ({
    default: {
        get: getMock,
        put: putMock,
        post: postMock,
    },
}));

describe("talent-profile.service", () => {
    beforeEach(() => {
        getMock.mockReset();
        putMock.mockReset();
        postMock.mockReset();
    });

    it("fetches the current talent profile", async () => {
        const profile = {
            name: "Mahjabin Mim",
            email: "mahjabin@example.com",
            phoneNumber: "+8801234567890",
            resumeUrl: "",
            resumeFileName: "",
            pictureUrl: "",
            pictureFileName: "",
            location: "Dhaka",
            tagline: "Frontend Developer",
            bio: "Bio",
            linkedin: "https://linkedin.com/in/mahjabin",
            additionalUrl: "https://portfolio.example.com",
            videoIntro: "",
            experience: 3,
            workplaces: "TalentX",
            expectedSalary: 1000,
            skills: [
                {
                    language: "TypeScript",
                    experience: 2.5,
                },
            ],
        };

        getMock.mockResolvedValueOnce({ data: profile });

        const { fetchTalentProfile } = await import("./talent-profile.service");

        const result = await fetchTalentProfile();

        expect(getMock).toHaveBeenCalledWith("/talent-profile/me");
        expect(result).toEqual({
            name: "Mahjabin Mim",
            email: "mahjabin@example.com",
            phoneNumber: "+8801234567890",
            resumeUrl: "",
            resumeFileName: "",
            pictureUrl: "",
            pictureFileName: "",
            location: "Dhaka",
            tagline: "Frontend Developer",
            bio: "Bio",
            linkedin: "https://linkedin.com/in/mahjabin",
            additionalUrl: "https://portfolio.example.com",
            videoIntro: "",
            experience: 3,
            workplaces: "TalentX",
            expectedSalary: 1000,
            skills: [
                {
                    language: "TypeScript",
                    experience: 2.5,
                },
            ],
        });
    });

    it("submits a trimmed talent profile payload", async () => {
        const apiResponse = {
            name: "Mahjabin Mim",
            email: "mahjabin@example.com",
            phoneNumber: "+8801234567890",
            resumeUrl: "",
            resumeFileName: "",
            pictureUrl: "",
            pictureFileName: "",
            location: "Dhaka",
            tagline: "Frontend Developer",
            bio: "Bio",
            linkedin: "https://linkedin.com/in/mahjabin",
            additionalUrl: "",
            videoIntro: "",
            experience: 3,
            workplaces: "TalentX",
            expectedSalary: 1000,
            skills: [
                {
                    language: "TypeScript",
                    experience: 2.5,
                },
            ],
        };

        putMock.mockResolvedValueOnce({ data: apiResponse });

        const { submitProfile } = await import("./talent-profile.service");

        const result = await submitProfile({
            name: "  Mahjabin Mim  ",
            email: " mahjabin@example.com ",
            phoneNumber: " +8801234567890 ",
            resumeUrl: "",
            resumeFileName: "",
            pictureUrl: "",
            pictureFileName: "",
            location: " Dhaka ",
            tagline: " Frontend Developer ",
            bio: " Bio ",
            linkedin: " https://linkedin.com/in/mahjabin ",
            additionalUrl: " ",
            videoIntro: " ",
            experience: 3,
            workplaces: " TalentX ",
            expectedSalary: 1000,
            skills: [
                {
                    language: " TypeScript ",
                    experience: " 2.5 ",
                },
                {
                    language: "",
                    experience: "",
                },
            ],
        });

        expect(putMock).toHaveBeenCalledWith("/talent-profile/me", {
            name: "Mahjabin Mim",
            email: "mahjabin@example.com",
            phoneNumber: "+8801234567890",
            location: "Dhaka",
            tagline: "Frontend Developer",
            bio: "Bio",
            linkedin: "https://linkedin.com/in/mahjabin",
            additionalUrl: undefined,
            videoIntro: undefined,
            experience: 3,
            workplaces: "TalentX",
            expectedSalary: 1000,
            skills: [
                {
                    language: "TypeScript",
                    experience: 2.5,
                },
            ],
        });
        expect(result).toEqual({
            name: "Mahjabin Mim",
            email: "mahjabin@example.com",
            phoneNumber: "+8801234567890",
            resumeUrl: "",
            resumeFileName: "",
            pictureUrl: "",
            pictureFileName: "",
            location: "Dhaka",
            tagline: "Frontend Developer",
            bio: "Bio",
            linkedin: "https://linkedin.com/in/mahjabin",
            additionalUrl: "",
            videoIntro: "",
            experience: 3,
            workplaces: "TalentX",
            expectedSalary: 1000,
            skills: [
                {
                    language: "TypeScript",
                    experience: 2.5,
                },
            ],
        });
    });

    it("throws when experience or expected salary is invalid", async () => {
        const { submitProfile } = await import("./talent-profile.service");

        await expect(
            submitProfile({
                name: "Mahjabin Mim",
                email: "mahjabin@example.com",
                phoneNumber: "+8801234567890",
                resumeUrl: "",
                resumeFileName: "",
                pictureUrl: "",
                pictureFileName: "",
                location: "Dhaka",
                tagline: "Frontend Developer",
                bio: "Bio",
                linkedin: "https://linkedin.com/in/mahjabin",
                additionalUrl: "",
                videoIntro: "",
                experience: Number.NaN,
                workplaces: "TalentX",
                expectedSalary: 1000,
                skills: [],
            }),
        ).rejects.toThrow(
            "Experience and expected salary must be valid numbers.",
        );

        expect(putMock).not.toHaveBeenCalled();
    });

    it("throws when a skill row is incomplete", async () => {
        const { submitProfile } = await import("./talent-profile.service");

        await expect(
            submitProfile({
                name: "Mahjabin Mim",
                email: "mahjabin@example.com",
                phoneNumber: "+8801234567890",
                resumeUrl: "",
                resumeFileName: "",
                pictureUrl: "",
                pictureFileName: "",
                location: "Dhaka",
                tagline: "Frontend Developer",
                bio: "Bio",
                linkedin: "https://linkedin.com/in/mahjabin",
                additionalUrl: "",
                videoIntro: "",
                experience: 3,
                workplaces: "TalentX",
                expectedSalary: 1000,
                skills: [
                    {
                        language: "TypeScript",
                        experience: "",
                    },
                ],
            }),
        ).rejects.toThrow("Each skill must include a language and experience.");

        expect(putMock).not.toHaveBeenCalled();
    });

    it("throws when a skill experience is zero", async () => {
        const { submitProfile } = await import("./talent-profile.service");

        await expect(
            submitProfile({
                name: "Mahjabin Mim",
                email: "mahjabin@example.com",
                phoneNumber: "+8801234567890",
                resumeUrl: "",
                resumeFileName: "",
                pictureUrl: "",
                pictureFileName: "",
                location: "Dhaka",
                tagline: "Frontend Developer",
                bio: "Bio",
                linkedin: "https://linkedin.com/in/mahjabin",
                additionalUrl: "",
                videoIntro: "",
                experience: 3,
                workplaces: "TalentX",
                expectedSalary: 1000,
                skills: [
                    {
                        language: "TypeScript",
                        experience: "0",
                    },
                ],
            }),
        ).rejects.toThrow(
            "Each skill experience must be a valid number greater than zero.",
        );

        expect(putMock).not.toHaveBeenCalled();
    });

    it("uploads a resume as multipart form data", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                name: "Mahjabin Mim",
                email: "mahjabin@example.com",
                resumeUrl: "resume-url",
                resumeFileName: "resume.pdf",
                pictureUrl: "",
                pictureFileName: "",
                location: "",
                tagline: "",
                bio: "",
                linkedin: "",
                additionalUrl: "",
                videoIntro: "",
                experience: 0,
                workplaces: "",
                expectedSalary: 0,
                skills: [],
            },
        });

        const { uploadTalentProfileResume } =
            await import("./talent-profile.service");
        const resumeFile = new File(["resume"], "resume.pdf", {
            type: "application/pdf",
        });

        await uploadTalentProfileResume(resumeFile);

        const [route, payload, config] = postMock.mock.calls[0] as [
            string,
            FormData,
            { headers: Record<string, string> },
        ];

        expect(route).toBe("/talent-profile/me/resume");
        expect(payload.get("Resume")).toBe(resumeFile);
        expect(config).toEqual({
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    });

    it("uploads a picture as multipart form data", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                name: "Mahjabin Mim",
                email: "mahjabin@example.com",
                resumeUrl: "",
                resumeFileName: "",
                pictureUrl: "pic-url",
                pictureFileName: "profile.png",
                location: "",
                tagline: "",
                bio: "",
                linkedin: "",
                additionalUrl: "",
                videoIntro: "",
                experience: 0,
                workplaces: "",
                expectedSalary: 0,
                skills: [],
            },
        });

        const { uploadTalentProfilePicture } =
            await import("./talent-profile.service");
        const pictureFile = new File(["picture"], "profile.png", {
            type: "image/png",
        });

        await uploadTalentProfilePicture(pictureFile);

        const [route, payload, config] = postMock.mock.calls[0] as [
            string,
            FormData,
            { headers: Record<string, string> },
        ];

        expect(route).toBe("/talent-profile/me/picture");
        expect(payload.get("Picture")).toBe(pictureFile);
        expect(config).toEqual({
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    });
});
