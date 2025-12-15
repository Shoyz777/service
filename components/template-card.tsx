import Link from "next/link";
import type { NormalizedTemplate } from "@/lib/templates";

export function TemplateCard({ template }: { template: NormalizedTemplate }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-500 font-semibold">Только РФ</p>
          <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{template.description}</p>
        </div>
        <Link
          href={`/templates/${template.slug}`}
          className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          Открыть
        </Link>
      </div>
      {template.lawReferences.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {template.lawReferences.map((law) => (
            <span
              key={law}
              className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-3 py-1"
            >
              {law}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
