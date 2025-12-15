import { TemplateCard } from "@/components/template-card";
import { getTemplates } from "@/lib/templates";
import { russianLawIndex } from "@/data/russian-laws";
import Link from "next/link";

export default async function Home() {
  const templates = await getTemplates();

  return (
    <div className="space-y-8">
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <p className="text-xs uppercase text-indigo-500 font-semibold">Документы без юриста</p>
        <h1 className="text-2xl font-semibold text-slate-900 mt-2">
          Шаблоны + мастер заполнения с проверкой на законы РФ
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">
          Сервис работает только в правовом поле Российской Федерации. Шаблоны, юридические реквизиты и проверки заточены под
          актуальные кодексы и федеральные законы. Скоро добавим поддержку других стран.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full">AI-подсказки</span>
          <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            Проверка обязательных реквизитов
          </span>
          <span className="bg-amber-50 border border-amber-100 text-amber-800 px-3 py-1 rounded-full">
            Только РФ (зарубежные шаблоны в разработке)
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Готовые шаблоны</h2>
            <p className="text-sm text-slate-600">Выберите шаблон и заполните мастер; черновик появится сразу.</p>
          </div>
          <Link
            href="https://t.me"
            className="text-sm text-indigo-700 underline font-medium"
            target="_blank"
            rel="noreferrer"
          >
            Сообщить о новом шаблоне
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <div className="space-y-2">
            <p className="text-xs uppercase text-indigo-500 font-semibold">Юридическая база РФ</p>
            <h3 className="text-lg font-semibold text-slate-900">Подключены ключевые нормативные акты</h3>
            <p className="text-sm text-slate-600 max-w-2xl">
              Мастер подсказывает, на какие статьи ссылаться, и напоминает об обязательных реквизитах. База расширяемая —
              подготовлена под подключение полного перечня федеральных законов и кодексов РФ.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full md:w-96">
            <p className="text-xs uppercase text-slate-500 font-semibold mb-2">Покрытие</p>
            <div className="grid grid-cols-2 gap-2">
              {russianLawIndex.map((law) => (
                <div key={law.code} className="text-xs bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-slate-900">{law.code}</p>
                  <p className="text-slate-600 mt-1">{law.scope}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{law.articles.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
