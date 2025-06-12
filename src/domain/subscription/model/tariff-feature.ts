export class TariffFeatures {
    private constructor(
      private _companyDataSync: boolean,

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
        reviewReply: boolean,
        reviewAutoReply: boolean,
        reviewComplaint: boolean,
        reviewAutoComplaint: boolean,
        analysisReview: boolean,
        analysisByRadius: boolean,
        analysisCompetitor: boolean
    ) {
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
        )
    }
}
