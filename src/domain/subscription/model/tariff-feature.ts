export enum OrganizationCountRange {
    RANGE_1_5 = '1-5',
    RANGE_5_10 = '5-10',
    RANGE_10_50 = '10-50',
    RANGE_50_PLUS = '50+',
}

export class TariffFeatures {
    private constructor(
        private readonly _companyDataSync: boolean,
        private readonly _multiAccess: boolean,
        private readonly _registerPlacement: boolean,
        private readonly _reviewReply: boolean,
        private readonly _reviewAutoReply: boolean,
        private readonly _reviewComplaint: boolean,
        private readonly _reviewAutoComplaint: boolean,
        private readonly _analysisReview: boolean,
        private readonly _analysisByRadius: boolean,
        private readonly _analysisCompetitor: boolean
    ) {}

    static create(
        companyDataSync: boolean,
        multiAccess: boolean,
        registerPlacement: boolean,
        reviewReply: boolean,
        reviewAutoReply: boolean,
        reviewComplaint: boolean,
        reviewAutoComplaint: boolean,
        analysisReview: boolean,
        analysisByRadius: boolean,
        analysisCompetitor: boolean
    ): TariffFeatures {
        return new TariffFeatures(
            companyDataSync,
            multiAccess,
            registerPlacement,
            reviewReply,
            reviewAutoReply,
            reviewComplaint,
            reviewAutoComplaint,
            analysisReview,
            analysisByRadius,
            analysisCompetitor
        );
    }

    static fromPersistence(
        companyDataSync: boolean,
        multiAccess: boolean,
        registerPlacement: boolean,
        reviewReply: boolean,
        reviewAutoReply: boolean,
        reviewComplaint: boolean,
        reviewAutoComplaint: boolean,
        analysisReview: boolean,
        analysisByRadius: boolean,
        analysisCompetitor: boolean
    ): TariffFeatures {
        return new TariffFeatures(
            companyDataSync,
            multiAccess,
            registerPlacement,
            reviewReply,
            reviewAutoReply,
            reviewComplaint,
            reviewAutoComplaint,
            analysisReview,
            analysisByRadius,
            analysisCompetitor
        );
    }

    get companyDataSync(): boolean { return this._companyDataSync; }
    get multiAccess(): boolean { return this._multiAccess; }
    get registerPlacement(): boolean { return this._registerPlacement; }
    get reviewReply(): boolean { return this._reviewReply; }
    get reviewAutoReply(): boolean { return this._reviewAutoReply; }
    get reviewComplaint(): boolean { return this._reviewComplaint; }
    get reviewAutoComplaint(): boolean { return this._reviewAutoComplaint; }
    get analysisReview(): boolean { return this._analysisReview; }
    get analysisByRadius(): boolean { return this._analysisByRadius; }
    get analysisCompetitor(): boolean { return this._analysisCompetitor; }

    public equals(other: TariffFeatures): boolean {
        if (!(other instanceof TariffFeatures)) {
            return false;
        }
        return (
            this._companyDataSync === other._companyDataSync &&
            this._multiAccess === other._multiAccess &&
            this._registerPlacement === other._registerPlacement &&
            this._reviewReply === other._reviewReply &&
            this._reviewAutoReply === other._reviewAutoReply &&
            this._reviewComplaint === other._reviewComplaint &&
            this._reviewAutoComplaint === other._reviewAutoComplaint &&
            this._analysisReview === other._analysisReview &&
            this._analysisByRadius === other._analysisByRadius &&
            this._analysisCompetitor === other._analysisCompetitor
        );
    }
}
