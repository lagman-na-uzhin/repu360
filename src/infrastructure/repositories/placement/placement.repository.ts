import {IPlacementRepository} from "@domain/placement/repositories/placement-repository.interface";
import {Placement, PlacementId} from "@domain/placement/placement";
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";

export class PlacementOrmRepository implements IPlacementRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}
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
