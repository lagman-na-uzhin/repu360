import {IGoogleRepository} from "@application/interfaces/integrations/google/google.repository.interface";

export class SearchGooglePlacesUseCase {
    constructor(
        private readonly googleRepo: IGoogleRepository,
    ) {}

    async execute(text: string): Promise<any> { //TODO
        console.log("execurte", text)
        const res = await this.googleRepo.searchPlaces(text);
        console.log(res, "res")
        return res

    }
}
