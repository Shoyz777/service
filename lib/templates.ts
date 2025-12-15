import { Prisma } from "@prisma/client";
import prisma from "./prisma";

export type NormalizedTemplateField = {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "number";
  required: boolean;
  placeholder?: string | null;
  helperText?: string | null;
  options: string[];
  order: number;
};

export type NormalizedTemplate = {
  id: string;
  slug: string;
  title: string;
  description: string;
  jurisdiction: string;
  bodyPattern: string;
  lawReferences: string[];
  createdAt: Date;
  updatedAt: Date;
  fields: NormalizedTemplateField[];
};

function parseStringArray(value: Prisma.JsonValue | string | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === "string" ? item : "")).filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => (typeof item === "string" ? item : "")).filter(Boolean);
      }
    } catch (error) {
      // Fallback: treat as comma separated string
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
  }
  return [];
}

export async function getTemplates(): Promise<NormalizedTemplate[]> {
  const templates = await prisma.template.findMany({
    orderBy: { title: "asc" },
    include: { fields: { orderBy: { order: "asc" } } },
  });

  return templates.map((template) => ({
    ...template,
    lawReferences: parseStringArray(template.lawReferences),
    fields: template.fields.map((field) => ({
      ...field,
      options: parseStringArray(field.options),
      type: field.type as NormalizedTemplateField["type"],
    })),
  }));
}

export async function getTemplateBySlug(slug: string): Promise<NormalizedTemplate | null> {
  const template = await prisma.template.findUnique({
    where: { slug },
    include: { fields: { orderBy: { order: "asc" } } },
  });

  if (!template) return null;

  return {
    ...template,
    lawReferences: parseStringArray(template.lawReferences),
    fields: template.fields.map((field) => ({
      ...field,
      options: parseStringArray(field.options),
      type: field.type as NormalizedTemplateField["type"],
    })),
  };
}
