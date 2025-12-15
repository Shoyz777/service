import type { NormalizedTemplate } from "./templates";

export function renderDocument(
  template: NormalizedTemplate,
  values: Record<string, string>
): string {
  let rendered = template.bodyPattern;
  template.fields.forEach((field) => {
    const placeholder = `{{${field.name}}}`;
    const value = values[field.name];
    rendered = rendered.replaceAll(placeholder, value || `[${field.label}]`);
  });
  return rendered;
}
