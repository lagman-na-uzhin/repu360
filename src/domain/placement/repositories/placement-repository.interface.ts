import {Placement, PlacementId} from "@domain/placement/placement";

export interface IPlacementRepository {
    getById(id: PlacementId): Promise<Placement | null>
    save(placement: Placement): Promise<void>
    batchSave(placements: Placement[]): Promise<void>
    getActiveTwogisPlacements(): Promise<Placement[]>
    getActiveTwogisListOfAutoReply(): Promise<Placement[]>
    getTwogisPlacementByExternalId(externalId: string): Promise<Placement | null>
    getYandexPlacementByExternalId(externalId: string): Promise<Placement | null>
}
