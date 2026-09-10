import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** O avião do logo, em laranja da marca. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F5",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF5A00">
          <path d="M21.6 3.2a1.6 1.6 0 0 0-2.05-.5l-4.4 2.36-6.6-2.2a.9.9 0 0 0-.86.16l-1.4 1.16a.7.7 0 0 0 .1 1.16l5 2.83-2.7 1.45-2.9-.62a.8.8 0 0 0-.68.16l-1.1.9a.6.6 0 0 0 .08 1l3.1 1.86 1.43 3.3a.6.6 0 0 0 1 .13l.94-1.06a.8.8 0 0 0 .18-.67l-.5-2.93 1.5-2.66 2.7 5.06a.7.7 0 0 0 1.16.13l1.2-1.36a.9.9 0 0 0 .2-.85l-2-6.68 2.4-4.35a1.6 1.6 0 0 0-.3-1.78Z" />
        </svg>
      </div>
    ),
    size,
  );
}
