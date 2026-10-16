import { isAxiosError } from "axios";
import { UserRole } from "./Authentications.enum";

export function extractApiError(error: unknown, defaultMessage: string = "An unexpected error occurred."): string {
  if (isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "The request took too long to complete. Please wait a moment and check whether it already succeeded before retrying.";
    }

    const data = error.response?.data as {
      message?: string;
      detail?: string;
      title?: string;
      errors?: Record<string, string[]>;
    } | undefined;

    if (data?.errors) {
      const firstFieldErrors = Object.values(data.errors)[0];
      if (firstFieldErrors?.length) {
        return firstFieldErrors[0];
      }
    }

    return data?.message || data?.detail || data?.title || error.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

export function resolvePostAuthRoute(
  userRole: UserRole | null,
): string {
  if (userRole === UserRole.EMPLOYER) {
    return "/employer/dashboard";
  }

  if (userRole === UserRole.TALENT) {
    return "/talent-dashboard";
  }

  return "/";
}

export function getPasswordRuleFailures(value: string): string[] {
  const failures: string[] = [];

  if (value.length < 8) failures.push("at least 8 characters");
  if (!/[A-Z]/.test(value)) failures.push("an uppercase letter");
  if (!/[a-z]/.test(value)) failures.push("a lowercase letter");
  if (!/\d/.test(value)) failures.push("a number");
  if (!/[^A-Za-z0-9]/.test(value)) failures.push("a special character");

  return failures;
}
