import { JobStatus } from "./Jobs.type";

export const isJobStatus = (value: string): value is JobStatus => {
    return Object.values(JobStatus).includes(value as JobStatus);
};
