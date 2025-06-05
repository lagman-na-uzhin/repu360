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

}
