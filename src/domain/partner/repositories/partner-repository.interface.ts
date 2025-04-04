import {Partner} from "@domain/partner/partner";

export interface IPartnerRepository {
    getById(id: string): Promise<Partner | null>
    save(partner: Partner): Promise<void>
}
