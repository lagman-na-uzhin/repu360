import { Injectable } from '@nestjs/common';
import * as cld from 'cld';
import {
  ILanguageDetectorService
} from "@application/interfaces/services/language-detector/language-detector-service.interface";
import {LANGUAGE} from "@domain/common/language.enum";
const LanguageDetect = require('languagedetect');

@Injectable()
export class LanguageDetectorService implements ILanguageDetectorService {
  private lngDetector;
  private languagesMap: Record<string, LANGUAGE> = {
    [cld.LANGUAGES.KAZAKH]: LANGUAGE.KZ,
    // [cld.LANGUAGES.UZBEK]: LANGUAGE.KZ,
    // [cld.LANGUAGES.KYRGYZ]: LANGUAGE.KZ,
    [cld.LANGUAGES.RUSSIAN]: LANGUAGE.RU,
    [cld.LANGUAGES.ENGLISH]: LANGUAGE.EN,

    kazakh: LANGUAGE.KZ,
    // kyrgyz: LANGUAGE.KZ,
    // uzbek: LANGUAGE.KZ,
    russian: LANGUAGE.RU,
    english: LANGUAGE.EN,
  };

  constructor() {
    this.lngDetector = new LanguageDetect();
  }

  async detect(
    text: string,
    defaultLanguage: LANGUAGE = LANGUAGE.RU,
  ): Promise<LANGUAGE> {
    let res = await this.detectWithCld(text);
    if (res) return res;

    res = this.detectWithLanguageDetector(text);
    if (res) return res;

    return defaultLanguage;
  }

  private async detectWithCld(text: string): Promise<LANGUAGE | null> {
    try {
      const res = await cld.detect(text);

      if (res.languages.length) {
        const firstAvailableLanguage = res.languages.find(
          (data) => !!this.languagesMap[data.code],
        );

        if (firstAvailableLanguage) {
          return this.languagesMap[firstAvailableLanguage.code];
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  private detectWithLanguageDetector(text: string): LANGUAGE | null {
    try {
      const res = this.lngDetector.detect(text);

      if (res.length) {
        const firstAvailableLanguage = res.find(
          ([language, score]) => !!this.languagesMap[language],
        );

        if (firstAvailableLanguage) {
          return this.languagesMap[firstAvailableLanguage[0]];
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
}
