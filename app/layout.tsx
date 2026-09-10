import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--fonte-display",
  display: "swap",
});

const corpo = Instrument_Sans({
  subsets: ["latin"],
  variable: "--fonte-corpo",
  display: "swap",
});

const url = "https://otaviomilhas.com.br";
const descricao =
  "Aprenda as melhores estratégias para acumular milhas aéreas e viajar pelo Brasil e pelo mundo com mais economia. Com quem já negociou mais de 5 milhões de milhas desde 2021.";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: "Otávio Milhas — viaje mais, gastando menos",
    template: "%s · Otávio Milhas",
  },
  description: descricao,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url,
    siteName: "Otávio Milhas",
    title: "Otávio Milhas — viaje mais, gastando menos",
    description: descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: "Otávio Milhas — viaje mais, gastando menos",
    description: descricao,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
