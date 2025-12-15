import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Link from "next/link";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Документы без юриста — на основе законов РФ",
  description:
    "Шаблоны и мастер заполнения под законодательство РФ. AI-подсказки, валидация полей и привязка к статьям законов.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}> 
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-sm flex items-center gap-2">
          <span className="font-semibold">Важно:</span>
          <span>
            Сервис работает только в правовом поле Российской Федерации. Поддержка других стран появится позже.
          </span>
          <Link href="/" className="ml-auto underline font-medium">Вернуться на главную</Link>
        </div>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </body>
    </html>
  );
}
