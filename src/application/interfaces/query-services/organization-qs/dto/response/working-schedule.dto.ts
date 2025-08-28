import {DayOfWeek} from "@domain/common/consts/day-of-week.enums";


export interface QSWorkingScheduleDto {
    isTemporaryClosed: boolean;
    entries: QSWorkingScheduleEntryDto[]
}
export interface QSWorkingScheduleEntryDto {
    dayOfWeek: DayOfWeek;
    startTime: string | null;
    endTime: string | null;
    breakStartTime: string | null;
    breakEndTime: string | null;
}
