import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scamio pentru meseriași",
  description: "Organizează clienții, lucrările și devizele într-un singur loc."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ro"><body>{children}</body></html>;
}
