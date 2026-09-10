import { marca, whatsapp } from "@/content/site";
import { isPendente } from "@/content/types";

/**
 * Person + Service. **Não** `Course`: não existe curso.
 *
 * Campo pendente não entra no JSON-LD — dado estruturado inventado é pior que
 * dado estruturado ausente.
 */
export function JsonLd() {
  const nome = isPendente(marca.nomeCompleto) ? marca.nome : marca.nomeCompleto;

  const dados = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://otaviomilhas.com.br/#otavio",
        name: nome,
        alternateName: marca.nome,
        jobTitle: "Especialista em milhas aéreas e cartões",
        description:
          "Desde 2021 no universo das milhas aéreas, com mais de 5 milhões de milhas negociadas de forma estratégica.",
        url: "https://otaviomilhas.com.br",
        sameAs: [marca.instagram],
      },
      {
        "@type": "Service",
        "@id": "https://otaviomilhas.com.br/#acompanhamento",
        name: "Acompanhamento em milhas aéreas",
        serviceType: "Orientação em acúmulo e uso de milhas aéreas",
        description:
          "Orientação individual para acumular milhas com os gastos do dia a dia e usá-las para viajar pelo Brasil e pelo mundo gastando menos.",
        provider: { "@id": "https://otaviomilhas.com.br/#otavio" },
        areaServed: { "@type": "Country", name: "Brasil" },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: whatsapp.base,
          availableLanguage: { "@type": "Language", name: "Português" },
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(dados).replace(/</g, "\\u003c"),
      }}
    />
  );
}
