import { describe, expect, it } from "vitest";
import { createEmptyTalentProfileForm } from "./talent-profile.types";

describe("talent-profile.types", () => {
    it("creates an empty talent profile form shape", () => {
        expect(createEmptyTalentProfileForm()).toEqual({
            name: "",
            email: "",
            phoneNumber: "",
            resumeUrl: "",
            resumeFileName: "",
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
        });
    });
});
