import {IBaseTwogisResponse} from "@application/interfaces/integrations/twogis/client/dto/out/base.out.dto";

export interface OrgGeometryHoverOutDto extends IBaseTwogisResponse {
    result: OrgGeometryHoverResult
}
export interface OrgGeometryHoverResult {
    total: number;
    items:OrgGeometryHoverItem[]
}
export interface OrgGeometryHoverItem {
    address_name: string
    id: string
    links:	{database_entrances:
            [{
                geometry: {
                    nermals: string[],
                    points: string[],
                    vectors: string[]
                }
            }]
    }
    type: string
    name: string
}
