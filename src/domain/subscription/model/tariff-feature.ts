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

    // --- Getters ---
    get companyDataSync(): boolean {
        return this._companyDataSync;
    }

    get multiAccess(): boolean {
        return this._multiAccess;
    }

    get registerPlacement(): boolean {
        return this._registerPlacement;
    }

    get reviewReply(): boolean {
        return this._reviewReply;
    }

    get reviewAutoReply(): boolean {
        return this._reviewAutoReply;
    }

    get reviewComplaint(): boolean {
        return this._reviewComplaint;
    }

    get reviewAutoComplaint(): boolean {
        return this._reviewAutoComplaint;
    }

    get analysisReview(): boolean {
        return this._analysisReview;
    }

    get analysisByRadius(): boolean {
        return this._analysisByRadius;
    }

    get analysisCompetitor(): boolean {
        return this._analysisCompetitor;
    }

    // --- Setters ---
    set companyDataSync(value: boolean) {
        this._companyDataSync = value;
    }

    set multiAccess(value: boolean) {
        this._multiAccess = value;
    }

    set registerPlacement(value: boolean) {
        this._registerPlacement = value;
    }

    set reviewReply(value: boolean) {
        this._reviewReply = value;
    }

    set reviewAutoReply(value: boolean) {
        this._reviewAutoReply = value;
    }

    set reviewComplaint(value: boolean) {
        this._reviewComplaint = value;
    }

    set reviewAutoComplaint(value: boolean) {
        this._reviewAutoComplaint = value;
    }

    set analysisReview(value: boolean) {
        this._analysisReview = value;
    }

    set analysisByRadius(value: boolean) {
        this._analysisByRadius = value;
    }

    set analysisCompetitor(value: boolean) {
        this._analysisCompetitor = value;
    }
}
