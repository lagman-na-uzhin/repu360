export class PartnerTariffFeatures {
    private constructor(
      private _companyDataSync: boolean,

      private _reviewSync: boolean,

      private _multiAccess: boolean,

      private _registerPlacement: boolean,

      private _reviewReply: boolean,
      private _reviewAutoReply: boolean,

      private _reviewComplaint: boolean,
      private _reviewAutoComplaint: boolean,

      private _analysisReview: boolean,
      private _analysisByRadius: boolean,
      private _analysisCompetitor: boolean

    ) {}

    static create(
        companyDataSync: boolean,
        multiAccess: boolean,
        registerPlacement: boolean,
        analysisByRadius: boolean,
        reviewAutoReply: boolean,
        analysisReview: boolean,
        reviewComplaint: boolean,
        analysisCompetitor: boolean
    ): PartnerTariffFeatures {
        return new PartnerTariffFeatures(
            companyDataSync,
            multiAccess,
            registerPlacement,
            analysisByRadius,
            reviewAutoReply,
            analysisReview,
            reviewComplaint,
            analysisCompetitor
        );
    }

    static fromPersistence(
        companyDataSync: boolean,
        multiAccess: boolean,
        registerPlacement: boolean,
        analysisByRadius: boolean,
        reviewAutoReply: boolean,
        analysisReview: boolean,
        reviewComplaint: boolean,
        analysisCompetitor: boolean
    ): PartnerTariffFeatures {
        return new PartnerTariffFeatures(
            companyDataSync,
            multiAccess,
            registerPlacement,
            analysisByRadius,
            reviewAutoReply,
            analysisReview,
            reviewComplaint,
            analysisCompetitor
        );
    }
}
