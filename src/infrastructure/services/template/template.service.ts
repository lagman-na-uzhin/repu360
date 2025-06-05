import { Injectable } from '@nestjs/common';
import * as nunjucks from "nunjucks";
import {ITemplateService} from "@application/interfaces/services/template/template-service.interface";

@Injectable()
export class TemplateService implements ITemplateService{
  renderTemplate(template: string, replacements: Record<string, string>) {
    return nunjucks.renderString(template, replacements);
  }

  // template placeholders should be in ORDER_PLACEHOLDERS
  validateOrderTemplate(templateText: string, placeHolders: string[]) {
    const placeholders = this.extractVariableNames(templateText);
    return placeholders.every((placeholder) =>
      placeHolders.includes(placeholder),
    );
  }

  // find all {{ placeholder }} and return list of values ['placeholder']
  private extractVariableNames(template: string) {
    const regex = /\{\{\s*([^\s}]+)\s*\}\}/g;
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(template)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  }
}
