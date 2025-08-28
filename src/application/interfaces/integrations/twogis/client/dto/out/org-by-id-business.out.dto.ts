import {IBaseTwogisResponse} from "@application/interfaces/integrations/twogis/client/dto/out/base.out.dto";

export interface OrgByIdBusinessOutDto extends IBaseTwogisResponse {
    result: OrgByIdBusinessResult
}
export interface OrgByIdBusinessResult {
    total: number;
    items: OrgByIdBusinessItem[];
}

export interface OrgByIdBusinessItem {
    id: string;
    name: string;
    address: string;
    city: OrgByIdBusinessCity;
    buildingId: string;
    checkedAt: number;
    entrance: OrgByIdBusinessEntrance;
    referencePoint: string;
    isNew: boolean;
    isCityInFirmProject: boolean;
    country: OrgByIdBusinessCountry;
    isActive: boolean;
    rubrics: OrgByIdBusinessRubric[];
    schedule: OrgByIdBusinessSchedule;
    contactGroups: OrgByIdBusinessContactGroup[];
    inn: string;
    confirmed: OrgByIdBusinessConfirmed;
}

export interface OrgByIdBusinessCity {
    id: string;
    name: string;
    type: string;
    originalName: string;
}

export interface OrgByIdBusinessEntrance {
    id: string;
}

export interface OrgByIdBusinessCountry {
    id: string;
    phoneCode: string;
    phoneNumberAvailableLengths: number[];
    availableSocialNetworks: string[];
    availableMessengers: string[];
}

export interface OrgByIdBusinessRubric {
    id: string;
    name: string;
    hasAds: boolean;
}

export interface OrgByIdBusinessSchedule {
    days: OrgByIdBusinessDays;
    comment: null | string;
    isTemporarilyClosed: boolean;
}

export interface OrgByIdBusinessDays {
    Mon: OrgByIdBusinessDayStatus;
    Tue: OrgByIdBusinessDayStatus;
    Wed: OrgByIdBusinessDayStatus;
    Thu: OrgByIdBusinessDayStatus;
    Fri: OrgByIdBusinessDayStatus;
    Sat: OrgByIdBusinessDayStatus;
    Sun: OrgByIdBusinessDayStatus;
}

export interface OrgByIdBusinessDayStatus {
    from?: string;
    to?: string;
    breaks?: {from: string; to: string}[]
}

export interface OrgByIdBusinessContactGroup {
    id: string;
    name: string;
    contacts: OrgByIdBusinessContact[];
}

export interface OrgByIdBusinessContact {
    id: string;
    type: string;
    value: string;
    phoneCode: null | string;
    additionalValue: string;
    description: null | string;
}

export interface OrgByIdBusinessConfirmed {
    name: boolean;
    address: boolean;
    referencePoint: boolean;
    city: boolean;
    entrance: boolean;
    rubrics: boolean;
    schedule: boolean;
    contacts: OrgByIdBusinessConfirmedContact[];
}

export interface OrgByIdBusinessConfirmedContact {
    id: string;
    confirmed: boolean;
}
