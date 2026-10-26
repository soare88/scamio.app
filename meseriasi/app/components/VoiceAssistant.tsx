"use client";

import "./voice-assistant.css";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, X, LoaderCircle, MessageCircle } from "lucide-react";

type ChatLine = { role: "user" | "assistant"; text: string };

export default function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Apasă microfonul și vorbește.");
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [draftUser, setDraftUser] = useState("");
  const [draftAssistant, setDraftAssistant] = useState("");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines, draftUser, draftAssistant, open]);

  function finishUserLine(text: string) {
    const value = text.trim();
    if (value) setLines((prev) => [...prev, { role: "user", text: value }]);
    setDraftUser("");
  }

  function finishAssistantLine(text: string) {
    const value = text.trim();
    if (value) setLines((prev) => [...prev, { role: "assistant", text: value }]);
    setDraftAssistant("");
  }

  function stopSession() {
    try {
      if (dcRef.current?.readyState === "open") {
        dcRef.current.send(JSON.stringify({ type: "session.close" }));
      }
    } catch {}
    streamRef.current?.getTracks().forEach((track) => track.stop());
    dcRef.current?.close();
    pcRef.current?.close();
    if (audioRef.current) audioRef.current.srcObject = null;
    streamRef.current = null;
    dcRef.current = null;
    pcRef.current = null;
    setListening(false);
    setConnecting(false);
    setStatus("Microfonul este oprit.");
  }

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    dcRef.current?.close();
    pcRef.current?.close();
  }, []);

  async function startSession() {
    setOpen(true);
    if (listening || connecting) {
      stopSession();
      return;
    }
    setConnecting(true);
    setStatus("Solicit accesul la microfon…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const tokenResponse = await fetch("/api/voice/session", { method: "POST" });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(tokenData.error || "Nu am putut porni asistentul vocal.");
      const ephemeralKey = tokenData.client_secret?.value;
      if (!ephemeralKey) throw new Error("Serverul nu a returnat cheia temporară pentru sesiune.");

      const pc = new RTCPeerConnection();
      pcRef.current = pc;
      pc.ontrack = (event) => {
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
          void audioRef.current.play().catch(() => setStatus("Permite redarea audio în browser."));
        }
      };
      stream.getAudioTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.addEventListener("open", () => {
        setListening(true);
        setConnecting(false);
        setStatus("Te ascult. Vorbește în română.");
      });
      dc.addEventListener("message", (event) => {
        let data: Record<string, unknown>;
        try { data = JSON.parse(event.data); } catch { return; }
        const type = String(data.type || "");
        if (type === "input_audio_buffer.speech_started") setStatus("Te ascult…");
        if (type === "input_audio_buffer.speech_stopped") setStatus("Procesez ce ai spus…");
        if (type === "conversation.item.input_audio_transcription.completed") {
          const transcript = String(data.transcript || "");
          finishUserLine(transcript);
        }
        if (type === "response.output_audio_transcript.delta" || type === "response.output_text.delta") {
          const delta = String(data.delta || "");
          if (delta) setDraftAssistant((prev) => prev + delta);
          setStatus("Scamio îți răspunde…");
        }
        if (type === "response.output_audio_transcript.done" || type === "response.output_text.done") {
          const transcript = String(data.transcript || data.text || "");
          if (transcript) finishAssistantLine(transcript);
          setStatus("Te ascult. Poți continua.");
        }
        if (type === "response.done") setStatus("Te ascult. Poți continua.");
        if (type === "error") {
          const error = data.error as { message?: string } | undefined;
          setStatus(error?.message || "A apărut o eroare în sesiunea vocală.");
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const response = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: { Authorization: `Bearer ${ephemeralKey}`, "Content-Type": "application/sdp" },
      });
      if (!response.ok) throw new Error("Conexiunea vocală a fost refuzată. Verifică setările API.");
      await pc.setRemoteDescription({ type: "answer", sdp: await response.text() });
      setStatus("Se conectează microfonul…");
    } catch (error) {
      stopSession();
      setStatus(error instanceof Error ? error.message : "Nu am putut porni asistentul vocal.");
    }
  }

  return (
    <>
      <audio ref={audioRef} autoPlay />
      <div className="voice-assistant-root">
        {open && (
          <section className="voice-panel" aria-label="Asistent vocal Scamio">
            <header className="voice-panel-header">
              <div className="voice-brand-icon"><Volume2 size={18} /></div>
              <div className="voice-header-copy"><strong>Scamio Assistant</strong><span>Asistent vocal · Română</span></div>
              <button className="voice-close" onClick={() => { stopSession(); setOpen(false); }} aria-label="Închide asistentul"><X size={18} /></button>
            </header>
            <div className="voice-status"><span className={listening ? "voice-status-dot live" : "voice-status-dot"} />{status}</div>
            <div className="voice-transcript" aria-live="polite">
              {lines.length === 0 && !draftUser && !draftAssistant && (
                <div className="voice-empty"><MessageCircle size={24} /><strong>Cu ce te pot ajuta?</strong><p>De exemplu: „Arată-mi lucrările programate” sau „Ajută-mă să verific o încasare”.</p></div>
              )}
              {lines.map((line, index) => <div key={index} className={`voice-message ${line.role}`}><span>{line.role === "user" ? "Tu" : "Scamio"}</span><p>{line.text}</p></div>)}
              {draftUser && <div className="voice-message user"><span>Tu</span><p>{draftUser}</p></div>}
              {draftAssistant && <div className="voice-message assistant"><span>Scamio</span><p>{draftAssistant}</p></div>}
              <div ref={transcriptEndRef} />
            </div>
            <footer className="voice-controls">
              <button className={`voice-mic-button ${listening ? "is-listening" : ""}`} onClick={startSession} disabled={connecting} aria-label={listening ? "Oprește microfonul" : "Pornește microfonul"}>
                {connecting ? <LoaderCircle size={21} className="voice-spin" /> : listening ? <MicOff size={21} /> : <Mic size={21} />}
              </button>
              <div><strong>{listening ? "Microfon activ" : connecting ? "Se conectează…" : "Pornește conversația"}</strong><span>{listening ? "Apasă pentru a opri" : "Apasă microfonul pentru a vorbi"}</span></div>
            </footer>
            <p className="voice-privacy">Microfonul funcționează doar în timpul sesiunii pornite de tine. Oprește-l când ai terminat.</p>
          </section>
        )}
        <button className="voice-launcher" onClick={() => { if (open) { stopSession(); setOpen(false); } else { setOpen(true); void startSession(); } }} aria-label={open ? "Închide asistentul vocal" : "Deschide asistentul vocal"}>
          {open ? <X size={22} /> : <Mic size={22} />}<span>{open ? "Închide" : "Vorbește cu Scamio"}</span>
        </button>
      </div>
    </>
  );
}
