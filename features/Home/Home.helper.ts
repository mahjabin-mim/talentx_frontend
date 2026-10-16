import { format, isValid, parseISO } from "date-fns";
import { HomeDateFormat } from "./Home.enum";

export const formatJobDate = (value: string): string => {
    const date = parseISO(value);
    if (!isValid(date)) return "N/A";
    return format(date, HomeDateFormat.JOB_CARD_DEADLINE);
};

export const formatMoney = (value: number): string => {
    return Number(value).toLocaleString(undefined, {
        maximumFractionDigits: 0,
    });
};
