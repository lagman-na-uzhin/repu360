export interface ITwogisReviewsMeta {
    code: number;
    next_link: string;
    branch_rating: number;
    branch_reviews_count?: number;
    geo_reviews_count?: number;
    total_count: number
}
export interface ITwogisPreviewUrls {
    "1290x": string;
    "320x": string;
    "640x": string;
    "64x64": string;
    url: string;
}
export interface ITwogisReviewPhoto {
    id: string;
    date_created: string;
    preview_urls: ITwogisPreviewUrls[];
}

export interface ITwogisReviewOfficialAnswer {
    id: string;
    text: string;
    org_name: string;
    date_created: string;
    logo_preview_urls: Object;
}
interface ITwogisReviewUser {
    id: string;
    name: string;
    photo_preview_urls: ITwogisPreviewUrls
}
export interface ITwogisReview {
    id: string;
    photos: ITwogisReviewPhoto[]
    region_id: number
    text: string;
    rating: number;
    comments_count: number
    is_hidden: boolean;
    hiding_type: string;
    likes_count: number | null;
    date_created: string | null;
    date_edited: string | null;
    user: ITwogisReviewUser;
    // official_answer: any;
    is_rated: boolean;
    is_verified: boolean;
    official_answer: ITwogisReviewOfficialAnswer;

}
export interface IOrganizationReviewsOutDto {
    meta: ITwogisReviewsMeta
    reviews: ITwogisReview[]
}
