import { isValid, parseISO } from "date-fns";
import { isJobStatus } from "../Jobs/Jobs.helper";
import type { IEmployerDashboardJob } from "../Jobs/Jobs.type";
import type { JobRow } from "./EmployerDashboard.type";

export { isJobStatus };

export const toJobRow = (job: IEmployerDashboardJob): JobRow => ({
    jobId: job.jobId,
    title: job.title,
    location: job.location,
    status: isJobStatus(job.status) ? job.status : "Draft",
    createdOn: job.createdOn,
    applicants: Number(job.applicants ?? 0),
});

export const toUnixTime = (value: string): number => {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed.getTime() : 0;
};
