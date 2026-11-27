import { ImageResponse } from "next/og";

export const alt = "PSI Kendari — Partai Super TBK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Gambar Open Graph tipografis (tanpa logo tiruan). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 28, height: 28, background: "#d7141a", borderRadius: 6 }} />
          <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "#d4d4d8" }}>Partai Super TBK</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 800, lineHeight: 1 }}>
            PSI&nbsp;<span style={{ color: "#ff4d57" }}>Kendari</span>
          </div>
          <div style={{ fontSize: 34, marginTop: 24, color: "#e4e4e7" }}>
            Berita PSI · Kendari &amp; Sultra · Politik Terbaru · Data Pemilu
          </div>
        </div>
        <div style={{ display: "flex", height: 18, background: "#d7141a", borderRadius: 9 }} />
      </div>
    ),
    size,
  );
}
