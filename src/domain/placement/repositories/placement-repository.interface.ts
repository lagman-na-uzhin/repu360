import {Placement} from "@domain/placement/placement";

export interface IPlacementRepository {
    save(placement: Placement): Promise<Placement>
    getACtiveTwogisPlacements(): Promise<Placement[]>
}
