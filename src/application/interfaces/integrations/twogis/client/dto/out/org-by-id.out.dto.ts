import {IBaseTwogisResponse} from "@application/interfaces/integrations/twogis/client/dto/out/base.out.dto";

export interface OrgByIdOutDto extends IBaseTwogisResponse {
    context_rubrics: OrgContextRubric[];
    total: number;
    search_attributes: OrgSearchAttributes;
    items: OrgItem[];
}

export interface OrgContextRubric {
    id: string;
    name: string;
    group: number;
    caption: string;
}
export interface OrgSearchAttributes {
    out_viewport: OrgCoordinate[];
    drag_bound: OrgCoordinate[];
    is_partial: boolean;
    is_nearby_requested: boolean;
    is_remote_requested: boolean;
}

export interface OrgCoordinate {
    latitude: number;
    longitude: number;
}
export interface OrgItem {
    id: string;
    type: string;
    region_id: string;
    segment_id: string;
    ski_lift?: {
        type: number;
        status: number;
    };
    employees_org_count?: string;
    address_name?: string;
    full_name?: string;
    full_address_name?: string;
    address?: OrgAddress;
    contact_groups?: OrgContactGroup[];
    schedule?: OrgSchedule;
    flags: Record<string | "temporary_closed", string | boolean>;
    rubrics: {
        alias: string,
        "id": string,
        "kind": "primary" | "additional",
        "name": string,
        "parent_id": string,
        "short_id": number
    }[]
}
export interface OrgAddress {
    components: OrgAddressComponent[];
    building_id: string;
    postcode: string;
    building_code: string;
    building_name: string;
    landmark_name: string;
    makani: string;
}

export interface OrgAddressComponent {
    type: string;
    number: string;
    fias_code: string;
    okato: string;
    oktmo: string;
    street_id: string;
    street: string;
}
export type OrgWeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface OrgTimeInterval {
    from: string | null;
    to: string | null;
}
export interface OrgDaySchedule {
    working_hours: OrgTimeInterval[];
}
export interface OrgSchedule {
    days: Partial<Record<OrgWeekDay, OrgDaySchedule>>;
    is_24x7?: boolean;
    date_from?: string;
    date_to?: string;
    comment?: string;
    description?: string;
}

export interface OrgTimeInterval {
    from: string | null;
    to: string | null;
}

export interface OrgContactGroup {
    name: string;
    comment: string;
    schedule?: OrgSchedule;
    schedule_special?: OrgScheduleSpecial[];
    contacts: OrgContact[];
}

export interface OrgContact {
    type: string | null;
    value: string | null;
    text: string | null;
    print_text: string | null;
    comment: string | null;
    url: string | null;
}

export interface OrgScheduleSpecial {
    data: string;
    working_hours: OrgTimeInterval[];
}
