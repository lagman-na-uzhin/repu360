export interface ITemplateService {
    renderTemplate(template: string, replacements: Record<string, string>): string
}
