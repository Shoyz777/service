import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.documentDraft.deleteMany();
  await prisma.templateField.deleteMany();
  await prisma.template.deleteMany();

  const templates = [
    {
      slug: "dogovor-arendy-nezhilogo",
      title: "Договор аренды нежилого помещения",
      description: "Аренда помещения с привязкой к ГК РФ и требованиям к регистрации.",
      bodyPattern:
        "Договор аренды между {{landlord}} (арендодатель) и {{tenant}} (арендатор}). Адрес: {{address}}. Срок: {{term}}. Арендная плата: {{price}} руб. Права и обязанности сторон определяются ГК РФ ст. 606-625 и договором.",
      lawReferences: ["ГК РФ ст. 606-625", "ФЗ-218 о госрегистрации недвижимости"],
      fields: [
        {
          name: "landlord",
          label: "Арендодатель (ФИО/организация)",
          type: "text",
          required: true,
          placeholder: "ООО «Ромашка»",
          helperText: "Проверьте полномочия подписанта (ст. 53 ГК РФ).",
          order: 1,
        },
        {
          name: "tenant",
          label: "Арендатор (ФИО/организация)",
          type: "text",
          required: true,
          placeholder: "ИП Иванов И.И.",
          order: 2,
        },
        {
          name: "address",
          label: "Адрес помещения",
          type: "textarea",
          required: true,
          placeholder: "г. Москва, ул. Пример, д. 1",
          order: 3,
        },
        {
          name: "term",
          label: "Срок аренды",
          type: "text",
          required: true,
          placeholder: "11 месяцев",
          helperText: "Длительный срок может потребовать регистрации (ст. 651 ГК РФ).",
          order: 4,
        },
        {
          name: "price",
          label: "Арендная плата (руб.)",
          type: "number",
          required: true,
          placeholder: "50000",
          order: 5,
        },
        {
          name: "purpose",
          label: "Назначение помещения",
          type: "select",
          required: true,
          options: ["Офис", "Склад", "Торговля", "Производство"],
          placeholder: "Выберите назначение",
          order: 6,
        },
      ],
    },
    {
      slug: "politika-personalnyh-dannyh",
      title: "Политика обработки персональных данных",
      description: "Политика в соответствии с ФЗ-152 и КоАП РФ.",
      bodyPattern:
        "Политика обработки персональных данных {{operatorName}} (оператор) для сайта/сервиса {{serviceName}}. Цели обработки: {{purposes}}. Согласие: {{consentMechanism}}. Меры защиты: {{security}}.",
      lawReferences: ["ФЗ-152 ст. 1-6", "КоАП РФ ст. 13.11", "ФЗ-402 ст. 9"],
      fields: [
        {
          name: "operatorName",
          label: "Оператор (организация)",
          type: "text",
          required: true,
          placeholder: "ООО «Ромашка»",
          order: 1,
        },
        {
          name: "serviceName",
          label: "Сайт/сервис",
          type: "text",
          required: true,
          placeholder: "example.ru",
          order: 2,
        },
        {
          name: "purposes",
          label: "Цели обработки",
          type: "textarea",
          required: true,
          placeholder: "Регистрация пользователей, аналитика, коммуникации",
          helperText: "Укажите конкретные цели из ст. 5 ФЗ-152.",
          order: 3,
        },
        {
          name: "consentMechanism",
          label: "Как получаете согласие",
          type: "select",
          required: true,
          options: ["Публичная оферта", "Чекбокс при регистрации", "Отдельная форма согласия"],
          order: 4,
        },
        {
          name: "security",
          label: "Меры защиты",
          type: "textarea",
          required: true,
          placeholder: "TLS, разграничение прав, шифрование резервных копий",
          order: 5,
        },
      ],
    },
    {
      slug: "dogovor-podryada",
      title: "Договор подряда (услуги/работы)",
      description: "ГПД с учетом статуса исполнителя и налоговых требований.",
      bodyPattern:
        "Договор подряда между {{customer}} (заказчик) и {{contractor}} (подрядчик). Предмет: {{subject}}. Сроки: {{timeline}}. Вознаграждение: {{fee}} руб. Налогообложение: {{taxRegime}}. Основание — ГК РФ ст. 702-729, НК РФ (при уплате налогов).",
      lawReferences: ["ГК РФ ст. 702-729", "НК РФ ст. 346.43-346.47"],
      fields: [
        {
          name: "customer",
          label: "Заказчик",
          type: "text",
          required: true,
          placeholder: "ООО «Ромашка»",
          order: 1,
        },
        {
          name: "contractor",
          label: "Подрядчик",
          type: "text",
          required: true,
          placeholder: "ИП Иванов И.И. или самозанятый",
          helperText: "Проверьте статус исполнителя (самозанятый/ИП).",
          order: 2,
        },
        {
          name: "subject",
          label: "Предмет работ",
          type: "textarea",
          required: true,
          placeholder: "Разработка сайта, маркетинговые услуги и т.п.",
          order: 3,
        },
        {
          name: "timeline",
          label: "Сроки",
          type: "text",
          required: true,
          placeholder: "с 01.03.2025 по 31.03.2025",
          order: 4,
        },
        {
          name: "fee",
          label: "Вознаграждение (руб.)",
          type: "number",
          required: true,
          placeholder: "100000",
          order: 5,
        },
        {
          name: "taxRegime",
          label: "Налоговый режим исполнителя",
          type: "select",
          required: true,
          options: ["УСН", "ПСН", "НПД (самозанятый)", "ОСН"],
          order: 6,
        },
      ],
    },
  ];

  for (const tpl of templates) {
    await prisma.template.create({
      data: {
        slug: tpl.slug,
        title: tpl.title,
        description: tpl.description,
        bodyPattern: tpl.bodyPattern,
        lawReferences: JSON.stringify(tpl.lawReferences),
        fields: {
          create: tpl.fields.map((field) => ({
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            placeholder: field.placeholder,
            helperText: field.helperText,
            options: JSON.stringify(field.options),
            order: field.order,
          })),
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
