import { NextResponse } from "next/server";
import OpenAI from "openai";

const offlineFallback = ({
  templateTitle,
  values,
  lawReferences,
}: {
  templateTitle: string;
  values: Record<string, string>;
  lawReferences: string[];
}) => {
  const filled = Object.entries(values)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");

  return [
    `Шаблон: ${templateTitle}.`,
    filled ? `Указанные данные: ${filled}.` : "Заполните больше полей, чтобы получить точные рекомендации.",
    lawReferences.length
      ? `Проверьте соответствие статьям: ${lawReferences.join(", ")}.`
      : "Добавьте ссылки на законы РФ, чтобы усилить юридическую силу документа.",
    "Подсказка сгенерирована офлайн-режимом — добавьте OPENAI_API_KEY для полноценного ИИ.",
  ].join(" ");
};

export async function POST(request: Request) {
  const body = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  const templateTitle: string = body.templateTitle;
  const values: Record<string, string> = body.values ?? {};
  const lawReferences: string[] = body.lawReferences ?? [];

  if (!apiKey) {
    return NextResponse.json({
      source: "offline-stub",
      suggestion: offlineFallback({ templateTitle, values, lawReferences }),
    });
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.AI_MODEL || "gpt-5-nano",
      temperature: 0.2,
      max_output_tokens: 250,
      input: [
        {
          role: "system",
          content:
            "Ты помогаешь заполнять документы только под законодательство РФ. Давай краткие подсказки, опираясь на статьи законов и обязательные реквизиты. Не давай советы для других стран.",
        },
        {
          role: "user",
          content: `Шаблон: ${templateTitle}. Входные данные: ${JSON.stringify(values)}. Законы: ${lawReferences.join(", ")}`,
        },
      ],
    });

    const suggestion = response.output_text;
    return NextResponse.json({ source: "openai", suggestion });
  } catch (error) {
    console.error("AI assistant error", error);
    return NextResponse.json({
      source: "error",
      suggestion: offlineFallback({ templateTitle, values, lawReferences }),
    });
  }
}
