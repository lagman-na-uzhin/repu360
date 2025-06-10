import { Injectable } from '@nestjs/common';
import {InjectEntityManager} from '@nestjs/typeorm';
import {EntityManager, Equal} from 'typeorm';
import {IReplyTemplateRepository} from "@domain/review/repositories/reply-template-repository.interface";
import {ReplyTemplate, ReplyTemplateId} from "@domain/review/model/review/reply/reply-template";
import {AutoReplyTemplateEntity} from "@infrastructure/entities/autoreply/reply-template.entity";
import {LANGUAGE} from "@domain/common/language.enum";
import {PlacementId} from "@domain/placement/placement";

@Injectable()
export class ReplyTemplateOrmRepository implements IReplyTemplateRepository {
    constructor(
        @InjectEntityManager() private readonly manager: EntityManager,
    ) {}

    async getById(id: ReplyTemplateId): Promise<ReplyTemplate | null> {
        const entity = await this.manager.getRepository(AutoReplyTemplateEntity).findOneBy({ id: Equal(id.toString()) });
        return entity ? this.toDomain(entity) : null;
    }

    private toDomain(entity: AutoReplyTemplateEntity): ReplyTemplate {
        return ReplyTemplate.fromPersistence(entity.id, entity.placementId, entity.text, entity.language);
    }

    async getCustomTemplate(placementId: PlacementId, language: LANGUAGE): Promise<ReplyTemplate | null> {
        const qb = this.manager.getRepository(AutoReplyTemplateEntity).createQueryBuilder('template');

        qb.where('template.placementId = :placementId', { placementId: placementId.toString() });

        if (language) {
            qb.andWhere('template.language = :language', { language });
        }

        qb.orderBy('RANDOM()');

        const entity = await qb.getOne();

        return entity && this.toDomain(entity);
    }

}
