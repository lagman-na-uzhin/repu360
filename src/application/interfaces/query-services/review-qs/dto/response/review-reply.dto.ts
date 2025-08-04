export interface QSReviewReplyDto {
    id: string;
    externalId: string;
    text: string;
    isOfficial: boolean;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}
