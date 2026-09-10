import { ImageResponse } from "next/og";

export const alt = "Otávio Milhas — viaje mais, gastando menos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF8F5",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#FF5A00">
            <path d="M21.6 3.2a1.6 1.6 0 0 0-2.05-.5l-4.4 2.36-6.6-2.2a.9.9 0 0 0-.86.16l-1.4 1.16a.7.7 0 0 0 .1 1.16l5 2.83-2.7 1.45-2.9-.62a.8.8 0 0 0-.68.16l-1.1.9a.6.6 0 0 0 .08 1l3.1 1.86 1.43 3.3a.6.6 0 0 0 1 .13l.94-1.06a.8.8 0 0 0 .18-.67l-.5-2.93 1.5-2.66 2.7 5.06a.7.7 0 0 0 1.16.13l1.2-1.36a.9.9 0 0 0 .2-.85l-2-6.68 2.4-4.35a1.6 1.6 0 0 0-.3-1.78Z" />
          </svg>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#C2410C",
            }}
          >
            Otávio Milhas
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 74,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            color: "#1C1B1A",
            maxWidth: 940,
          }}
        >
          Acumule milhas, viaje mais, gastando menos.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 24,
            color: "#5C5750",
          }}
        >
          <span style={{ color: "#C2410C", fontWeight: 700 }}>
            +5 milhões de milhas negociadas
          </span>
          <span style={{ color: "#E7E1D9" }}>·</span>
          <span>desde 2021</span>
          <span style={{ color: "#E7E1D9" }}>·</span>
          <span>otaviomilhas.com.br</span>
        </div>
      </div>
    ),
    size,
  );
}
