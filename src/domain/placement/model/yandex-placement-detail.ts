export class YandexPlacementDetail {
    private constructor() {}

    static create(): YandexPlacementDetail {
        return new YandexPlacementDetail()
    }

    static fromPersistence() {
        return new YandexPlacementDetail()
    }
}
