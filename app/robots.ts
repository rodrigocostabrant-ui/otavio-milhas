import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Rota temporária de calibragem da hero 3D. Sai daqui quando a hero for
      // promovida para a página principal.
      disallow: ["/prototipo-hero"],
    },
    sitemap: "https://otaviomilhas.com.br/sitemap.xml",
  };
}
