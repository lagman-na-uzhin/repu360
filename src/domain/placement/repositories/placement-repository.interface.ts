import {Placement, PlacementId} from "@domain/placement/placement";

export interface IPlacementRepository {
    getById(id: PlacementId): Promise<Placement | null>
    save(placement: Placement): Promise<Placement>
    getActiveTwogisPlacements(): Promise<Placement[]>
    getActiveTwogisListOfAutoReply(): Promise<Placement[]>
}
