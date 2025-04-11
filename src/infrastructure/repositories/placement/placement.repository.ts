import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Placement, PlacementId} from "@domain/placement/placement";

export class PlacementOrmRepository implements IPlacementRepository {
    async getById(id: PlacementId): Promise<Placement | null> {
        return {} as Placement | null;
    }

    async getActiveTwogisPlacements(): Promise<Placement[]> {
        return [] as Placement[]
    }

    async save(placement: Placement): Promise<Placement> {
        return {} as Placement
    }
}
