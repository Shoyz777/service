import { notFound } from "next/navigation";
import { TemplateForm } from "@/components/template-form";
import { getTemplateBySlug } from "@/lib/templates";
import Link from "next/link";

export default async function TemplatePage({ params }: { params: { slug: string } }) {
  const template = await getTemplateBySlug(params.slug);
  if (!template) return notFound();

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-indigo-700 underline font-medium">
        ← Все шаблоны
      </Link>
      <TemplateForm template={template} />
    </div>
  );
}
