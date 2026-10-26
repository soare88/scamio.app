import type { Metadata } from "next";
import "./globals.css";
import VoiceAssistant from "./components/VoiceAssistant";

export const metadata: Metadata = {
  title: "Scamio OS",
  description: "Organizează activitatea firmei și folosește un asistent vocal în limba română."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ro"><body>{children}<VoiceAssistant /></body></html>;
}
