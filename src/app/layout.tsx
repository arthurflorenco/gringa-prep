import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif-display", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Gringa Prep — prática diária para entrevistas tech lá fora",
  description: "Exercícios diários, revisão espaçada e inglês técnico para conseguir uma vaga de dev no exterior.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable} ${serif.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-8 sm:pt-12">{children}</main>
        <footer className="mx-auto w-full max-w-3xl px-5 pb-8 font-mono text-xs text-faint">
          gringa-prep · open source · os teus dados ficam só neste navegador
        </footer>
      </body>
    </html>
  );
}
