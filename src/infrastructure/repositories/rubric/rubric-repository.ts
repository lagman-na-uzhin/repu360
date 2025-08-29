import {Injectable} from "@nestjs/common";
import {InjectEntityManager} from "@nestjs/typeorm";
import {Any, EntityManager} from "typeorm";
import {IRubricRepository} from "@domain/rubric/repositories/rubric-repository.interface";
import {Rubric, RubricId} from "@domain/rubric/rubric";
import {ExternalRubric} from "@domain/rubric/value-object/external-rubric.vo";
import {RubricEntity} from "@infrastructure/entities/rubric/rubric.entity";
import {ids} from "googleapis/build/src/apis/ids";
import {ExternalRubricEntity} from "@infrastructure/entities/rubric/external-rubric.entity";

@Injectable()
export class RubricOrmRepository implements IRubricRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async getByIds(rubricIds: RubricId[]): Promise<Rubric[]> {
        const ids = rubricIds.map(r => r.toString())
        const entities = await this.manager
            .getRepository(RubricEntity)
            .find({where: {id: Any(ids)}})

        return entities.map(this.toDomain);
    }

    async saveAll(rubrics: Rubric[]): Promise<void> {
        return Promise.resolve(undefined);
    }

    private toDomain(entity: RubricEntity): Rubric {
        return Rubric.fromPersistence(
            entity.id,
            entity.name,
            entity.external.map(external => ExternalRubric.fromPersistence(external.id, external.platform, external.name, external.externalId))
            )
    }

    private toEntity(domain: Rubric): RubricEntity {
        const entity = new RubricEntity();

        entity.id = domain.id.toString();
        entity.name = domain.name;
        entity.external = domain.external.map(e => {
            return {
                externalId: e.externalId,
                rubricId: domain.id.toString(),
                name: e.name,
                platform: e.platform
            } as ExternalRubricEntity;
        })
        return entity;
    }
}
