import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Unique} from 'typeorm';
import {TariffEntity} from "src/infrastructure/entities/tariff/tariff.entity";

@Entity('tariff_features')
@Unique(['tariffId'])
export class TariffFeaturesEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tariffId: string;

    @OneToOne(() => TariffEntity, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'tariff_id'})
    tariff: TariffEntity;

    @Column({ default: false }) companyDataSync: boolean;
    @Column({ default: false }) cardOptimization: boolean;
    @Column({ default: false }) dataProtection: boolean;
    @Column({ default: false }) reviewCollection: boolean;
    @Column({ default: false }) reviewResponses: boolean;
    @Column({ default: false }) geoServicePosts: boolean;
    @Column({ default: false }) photoManager: boolean;
    @Column({ default: false }) reviewNotifications: boolean;
    @Column({ default: false }) basicReviewAnalytics: boolean;
    @Column({ default: false }) rocketLiteFeatures: boolean;
    @Column({ default: false }) reviewGenerator: boolean;
    @Column({ default: false }) autoResponses: boolean;
    @Column({ default: false }) onlineReputationAnalytics: boolean;
    @Column({ default: false }) advancedPresenceAnalytics: boolean;
    @Column({ default: false }) duplicateAndFakeRemoval: boolean;
    @Column({ default: false }) competitorAnalytics: boolean;
}
