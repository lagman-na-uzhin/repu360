import {Profile, ProfileId} from '@domain/review/profile';


export interface IProfileRepository {
  getById(id: ProfileId): Promise<Profile | null>
  saveAll(profiles: Profile[]): Promise<void>;
  getByExternalId(externalId: string): Promise<Profile | null>;
  getByExternalIds(externalIds: string[]): Promise<Profile[]>;
}
