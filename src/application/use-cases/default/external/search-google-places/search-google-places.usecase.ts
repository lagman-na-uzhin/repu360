import {IGoogleRepository} from "@application/interfaces/integrations/google/google.repository.interface";

export class SearchGooglePlacesUseCase {
    constructor(
        private readonly googleRepo: IGoogleRepository,
    ) {}

    async execute(text: string): Promise<void> {
        console.log("execurte", text)
        return this.googleRepo.searchPlaces(text);

    }
}
