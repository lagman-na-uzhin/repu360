import { Profile } from '@domain/review/profile';


export interface IProfileRepository {
  saveAll(profiles: Profile[]): Promise<void>
  getByExternalId(externalId: string): Promise<Profile | null>
}
