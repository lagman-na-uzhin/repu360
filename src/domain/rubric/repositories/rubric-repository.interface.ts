import {Rubric, RubricId} from "@domain/rubric/rubric";

export interface IRubricRepository {
    getByIds(ids: RubricId[]): Promise<Rubric[]>;
    saveAll(rubrics: Rubric[]): Promise<void>;
}
