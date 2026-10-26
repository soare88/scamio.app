import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Asistentul vocal nu este configurat încă. Adaugă OPENAI_API_KEY în variabilele de mediu Vercel." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: "gpt-realtime-2.1",
          instructions: [
            "Ești Scamio, asistentul vocal al aplicației Scamio OS.",
            "Vorbește în limba română, clar, natural și concis. Afișează răspunsuri ușor de urmărit și în text.",
            "Ajută utilizatorul să navigheze aplicația și să înțeleagă clienții, lucrările, facturile și încasările.",
            "Nu pretinde că ai accesat date, ai creat documente, ai verificat conturi bancare sau ai executat acțiuni dacă nu ai primit rezultatul real de la un instrument al aplicației.",
            "Nu iniția plăți și nu marca facturi ca plătite doar pe baza unei comenzi vocale. Pentru operațiuni financiare sau modificări ireversibile, cere confirmare explicită.",
            "În această etapă, poți conversa și explica, dar nu ai încă instrumente conectate pentru modificarea datelor aplicației."
          ].join("\n"),
          audio: {
            input: {
              transcription: { model: "gpt-4o-mini-transcribe", language: "ro" },
              turn_detection: { type: "server_vad", create_response: true, interrupt_response: true }
            },
            output: { voice: "marin" }
          }
        }
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI nu a putut crea sesiunea vocală." },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Nu am putut contacta serviciul vocal. Încearcă din nou." },
      { status: 502 }
    );
  }
}
