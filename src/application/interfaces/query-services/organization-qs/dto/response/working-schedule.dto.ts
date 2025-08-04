import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";

export interface QSWorkingScheduleEntryDto {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    breakStartTime: string | null;
    breakEndTime: string | null;
}
