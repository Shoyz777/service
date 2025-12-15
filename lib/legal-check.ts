import { russianLawIndex } from "@/data/russian-laws";
import type { NormalizedTemplate } from "./templates";

export type LegalCheckResult = {
  status: "ok" | "warning";
  summary: string;
  details: string[];
  references: { code: string; articles: string[] }[];
};

export function runLegalCheck(
  template: NormalizedTemplate,
  values: Record<string, string>
): LegalCheckResult {
  const missingFields = template.fields
    .filter((field) => field.required && !values[field.name]?.toString().trim())
    .map((field) => field.label);

  const referenced = template.lawReferences
    .map((law) => {
      const base = russianLawIndex.find((item) => law.startsWith(item.code));
      if (base) {
        return { code: base.code, articles: base.articles };
      }
      return { code: law, articles: [] };
    })
    .filter(Boolean);

  const summaryParts = [
    "Проверено по нормативной базе РФ",
    referenced.length
      ? `подтянуто ссылок: ${referenced.map((r) => r.code).join(", ")}`
      : "для шаблона добавьте ссылки на конкретные статьи",
  ];

  if (missingFields.length) {
    summaryParts.push(`требует заполнить: ${missingFields.join(", ")}`);
  }

  return {
    status: missingFields.length ? "warning" : "ok",
    summary: summaryParts.join(" · "),
    details: missingFields.length
      ? missingFields.map((field) => `Заполните обязательное поле «${field}».`)
      : [
          "Обязательные поля заполнены — документ можно сформировать.",
          "Проверьте корректность данных и соответствие указанным статьям РФ.",
        ],
    references: referenced,
  };
}
