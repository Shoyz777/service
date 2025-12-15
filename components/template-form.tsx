"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { NormalizedTemplate } from "@/lib/templates";
import { renderDocument } from "@/lib/render-document";
import { runLegalCheck, type LegalCheckResult } from "@/lib/legal-check";

const typeToPlaceholder: Record<string, string> = {
  text: "Текст",
  textarea: "Подробный текст",
  select: "Выберите значение",
  date: "Дата",
  number: "Число",
};

export function TemplateForm({ template }: { template: NormalizedTemplate }) {
  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    template.fields.forEach((field) => {
      let validator: z.ZodTypeAny = z.string({ required_error: "Обязательно" }).trim();
      if (field.type === "number") {
        validator = z
          .string({ required_error: "Укажите число" })
          .regex(/^[0-9]+([.,][0-9]+)?$/, "Допустимы только цифры")
          .transform((value) => value.replace(",", "."));
      }
      if (field.type === "select" && field.options.length) {
        validator = z
          .string({ required_error: "Выберите значение" })
          .refine((value) => field.options.includes(value), "Недопустимое значение");
      }
      shape[field.name] = field.required ? validator : validator.optional().or(z.literal(""));
    });
    return z.object(shape);
  }, [template.fields]);

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const [preview, setPreview] = useState<string>("");
  const [legalCheck, setLegalCheck] = useState<LegalCheckResult | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: Record<string, string>) => {
    setPreview(renderDocument(template, values));
    setLegalCheck(runLegalCheck(template, values));
    setAiSuggestion("");
  };

  const requestAssistance = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateTitle: template.title,
          values,
          lawReferences: template.lawReferences,
        }),
      });
      const payload = await response.json();
      setAiSuggestion(payload.suggestion || "Не удалось получить подсказку.");
    } catch (error) {
      console.error(error);
      setAiSuggestion("Ошибка при запросе к ассистенту.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs uppercase text-indigo-500 font-semibold">Мастер заполнения</p>
            <h1 className="text-xl font-semibold text-slate-900">{template.title}</h1>
            <p className="text-sm text-slate-600 mt-1">Работаем только по законодательству РФ.</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Юрисдикция: {template.jurisdiction}</p>
            <p>Ссылки на законы: {template.lawReferences.length || "нет"}</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {template.fields.map((field) => {
            const error = form.formState.errors[field.name]?.message;
            return (
              <div key={field.id} className="space-y-1">
                <label htmlFor={field.name}>
                  {field.label}
                  {field.required ? <span className="text-rose-600"> *</span> : null}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    rows={4}
                    placeholder={field.placeholder || typeToPlaceholder[field.type]}
                    {...form.register(field.name)}
                  />
                ) : field.type === "select" ? (
                  <select id={field.name} defaultValue="" {...form.register(field.name)}>
                    <option value="" disabled>
                      {field.placeholder || "Выберите"}
                    </option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    type={field.type === "number" ? "text" : field.type}
                    placeholder={field.placeholder || typeToPlaceholder[field.type]}
                    {...form.register(field.name)}
                  />
                )}
                {field.helperText ? <p className="text-xs text-slate-500">{field.helperText}</p> : null}
                {error ? <p className="text-xs text-rose-600">{String(error)}</p> : null}
              </div>
            );
          })}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-11 px-5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Сформировать
            </button>
            <button
              type="button"
              onClick={form.handleSubmit(requestAssistance)}
              className="h-11 px-4 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 text-sm font-medium hover:border-indigo-300"
              disabled={loading}
            >
              {loading ? "Запрашиваем..." : "Подсказка AI"}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Проверка по законам РФ</h3>
          {legalCheck ? (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-slate-600">{legalCheck.summary}</p>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {legalCheck.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              {legalCheck.references.length ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {legalCheck.references.map((ref) => (
                    <span
                      key={ref.code}
                      className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1"
                    >
                      {ref.code}: {ref.articles.join(", ")}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-slate-600 mt-1">
              После заполнения формы мы проверим обязательные поля и подскажем, на какие статьи РФ опираться.
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Черновик документа</h3>
          {preview ? (
            <pre className="mt-2 text-xs bg-slate-50 border border-slate-100 rounded-lg p-3 whitespace-pre-wrap">{preview}</pre>
          ) : (
            <p className="text-xs text-slate-600 mt-1">Заполните форму и нажмите «Сформировать», чтобы получить черновик.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">AI-помощник</h3>
          {aiSuggestion ? (
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">{aiSuggestion}</p>
          ) : (
            <p className="text-xs text-slate-600 mt-1">
              AI-подсказки формируются строго под законодательство РФ. Не используйте сервис для других стран.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
