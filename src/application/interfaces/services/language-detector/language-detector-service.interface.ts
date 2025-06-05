import {LANGUAGE} from "@domain/common/language.enum";

export interface ILanguageDetectorService {
    detect(text: string, defaultLanguage?: LANGUAGE): Promise<LANGUAGE>;
}
