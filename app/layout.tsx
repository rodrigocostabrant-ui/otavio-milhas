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
    /* `suppressHydrationWarning` porque a hero escreve `data-hero-modo` e
       `data-hero-fase` aqui num script inline, antes da hidratação — é o mesmo
       padrão de um seletor de tema. O aviso é sobre exatamente esses atributos,
       e a supressão é rasa: vale para o <html> e não para a árvore abaixo. */
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${display.variable} ${corpo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
