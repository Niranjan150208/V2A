import React, { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  ArrowRight,
  CornerDownRight,
} from "lucide-react";
import { useNavigation, AppRoute } from "../../context/NavigationContext";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

export const VoiceAssistantModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen, language, navigate } =
    useNavigation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [suggestedRoute, setSuggestedRoute] = useState<AppRoute | null>(null);
  const [micError, setMicError] = useState("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  if (!isVoiceModalOpen) return null;

  const samplePromptsEn = [
    {
      text: "Check Seed Passport for batch TN-TSSCA-2025",
      target: "/seed-passport" as AppRoute,
    },
    {
      text: "What is today’s paddy price in Thanjavur Mandi?",
      target: "/market-prices" as AppRoute,
    },
    {
      text: "Diagnose leaf spots on Samba paddy",
      target: "/crop-doctor" as AppRoute,
    },
    {
      text: "Show total net proceeds and pending payments",
      target: "/crop-journey" as AppRoute,
    },
  ];

  const samplePromptsTa = [
    {
      text: "விதை பாஸ்போர்ட் QR சரிபார்க்கவும்",
      target: "/seed-passport" as AppRoute,
    },
    {
      text: "தஞ்சாவூர் நேரடி நெல் கொள்முதல் நிலைய விலை என்ன?",
      target: "/market-prices" as AppRoute,
    },
    {
      text: "நெல் இலைச்சுருட்டுப் புழுவுக்கு என்ன மருந்து?",
      target: "/crop-doctor" as AppRoute,
    },
    {
      text: "பயிர் பயண பாஸ்போர்ட் மற்றும் லாப விபரம் காட்டு",
      target: "/crop-journey" as AppRoute,
    },
  ];

  const currentPrompts = language === "ta" ? samplePromptsTa : samplePromptsEn;

  const suggestDestination = (promptText: string): AppRoute => {
    const text = promptText.toLowerCase();
    if (/seed|விதை|qr/.test(text)) return "/seed-passport";
    if (/price|market|விலை|சந்தை/.test(text)) return "/market-prices";
    if (/disease|leaf|crop|நோய்|இலை|பயிர்/.test(text)) return "/crop-doctor";
    if (/finance|profit|payment|லாப|பணம்|வரவு/.test(text))
      return "/crop-journey";
    return "/dashboard";
  };

  const setQuery = (promptText: string, wasSpoken = false) => {
    setIsListening(false);
    setTranscript(promptText);
    const route = suggestDestination(promptText);
    setSuggestedRoute(route);
    setAssistantReply(
      language === "ta"
        ? wasSpoken
          ? "உங்கள் குரல் உரையாக மாற்றப்பட்டது. பரிந்துரைக்கப்பட்ட பகுதியைத் திறக்கலாம்."
          : "மாதிரி உரை தேர்ந்தெடுக்கப்பட்டது. பரிந்துரைக்கப்பட்ட பகுதியைத் திறக்கலாம்."
        : wasSpoken
          ? "Speech converted to text. Review it, then open the suggested section."
          : "Suggested text selected. Review it, then open the suggested section.",
    );
    setMicError("");
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition =
      browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setMicError(
        "Speech recognition is not supported in this browser. Try Chrome or Edge, or type/use a suggested query.",
      );
      return;
    }

    setTranscript("");
    setAssistantReply("");
    setSuggestedRoute(null);
    setMicError("");
    const recognition = new Recognition();
    recognition.lang = language === "ta" ? "ta-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let text = "";
      let finalResult = false;
      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        text += event.results[index][0].transcript;
        finalResult ||= event.results[index].isFinal;
      }
      setTranscript(text.trim());
      if (finalResult && text.trim()) setQuery(text.trim(), true);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      setMicError(
        event.error === "not-allowed"
          ? "Microphone permission was denied. Allow it in browser site settings and try again."
          : `Speech recognition stopped (${event.error}). Try again or use a suggested query.`,
      );
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setMicError(
        "Could not start microphone recognition. Check site permission and try again.",
      );
    }
  };

  const openSuggestedRoute = () => {
    if (!suggestedRoute) return;
    recognitionRef.current?.abort();
    setIsVoiceModalOpen(false);
    navigate(suggestedRoute);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4 bg-ink-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative my-auto w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto bg-cream-100 rounded-3xl shadow-2xl border-2 border-forest-600/30">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-gradient-to-r from-forest-900 via-forest-800 to-paddy-700 text-cream-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-harvest-500/20 text-harvest-300 rounded-xl border border-harvest-400/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">
                {language === "ta"
                  ? "V2A உழவர் குரல் உதவியாளர்"
                  : "V2A Farmer Voice Assistant"}
              </h3>
              <p className="text-xs text-sage-200">
                {language === "ta"
                  ? "தமிழ் & ஆங்கிலத்தில் பேசலாம் (Voice AI)"
                  : "Bilingual Agro Voice Engine"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              recognitionRef.current?.abort();
              setIsListening(false);
              setIsVoiceModalOpen(false);
            }}
            aria-label="Close voice assistant"
            className="p-1.5 text-sage-300 hover:text-white hover:bg-forest-700/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Animation Area */}
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-harvest-400/30 animate-ping" />
                <div className="absolute -inset-4 rounded-full bg-paddy-500/20 animate-pulse" />
              </>
            )}
            <button
              onClick={toggleMic}
              aria-label={
                isListening
                  ? "Stop microphone listening"
                  : "Start microphone listening"
              }
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                isListening
                  ? "bg-terracotta-500 text-white scale-110 shadow-terracotta-500/40"
                  : "bg-forest-800 text-harvest-400 hover:bg-forest-700 hover:scale-105"
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <p className="font-semibold text-forest-900 mb-1">
            {isListening
              ? language === "ta"
                ? "உங்கள் குரலை கவனிக்கிறது..."
                : "Listening to your speech..."
              : language === "ta"
                ? "பேச மைக்கை அழுத்தவும்"
                : "Tap microphone to speak"}
          </p>
          <p className="text-xs text-ink-500 mb-6">
            {language === "ta"
              ? "விதை, நோய், உரம், விலை அல்லது சாகுபடி விவரங்களை கேட்கலாம்"
              : "Ask about seeds, crop disease, fertilizers, market prices, or finances"}
          </p>
          {micError && (
            <p
              role="alert"
              className="mb-4 w-full rounded-xl border border-terracotta-300 bg-terracotta-50 p-3 text-left text-xs font-semibold text-terracotta-800"
            >
              {micError}
            </p>
          )}

          {/* Transcript / Reply Display */}
          {(transcript || assistantReply) && (
            <div className="w-full p-4 mb-6 bg-white rounded-2xl border border-sage-300 text-left shadow-sm">
              {transcript && (
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs font-bold text-ink-400 uppercase tracking-wider shrink-0 mt-0.5">
                    {language === "ta" ? "நீங்கள்:" : "You:"}
                  </span>
                  <p className="text-sm font-medium text-ink-900">
                    {transcript}
                  </p>
                </div>
              )}
              {assistantReply && (
                <div className="flex items-start gap-2 pt-2 border-t border-sage-200">
                  <Volume2 className="w-4 h-4 text-paddy-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-forest-800">
                    {assistantReply}
                  </p>
                </div>
              )}
              {suggestedRoute && (
                <button
                  onClick={openSuggestedRoute}
                  className="mt-3 rounded-xl bg-forest-800 px-4 py-2 text-xs font-bold text-harvest-300"
                >
                  {language === "ta"
                    ? "பரிந்துரைத்த பகுதியைத் திற"
                    : `Open suggested section: ${suggestedRoute}`}
                </button>
              )}
            </div>
          )}

          {/* Quick Clickable Farmer Queries */}
          <div className="w-full text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
              {language === "ta"
                ? "மாதிரி கேள்விகள் (தட்டவும்):"
                : "Suggested farmer queries (Tap to test):"}
            </p>
            <div className="space-y-2">
              {currentPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(p.text)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-forest-50 border border-sage-300 hover:border-paddy-500 text-left text-sm text-forest-900 font-medium transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <CornerDownRight className="w-4 h-4 text-paddy-600 group-hover:translate-x-0.5 transition-transform" />
                    {p.text}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-forest-800 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-sage-100/60 border-t border-sage-200 text-center text-xs text-ink-600">
          {language === "ta"
            ? "உலாவி பேச்சு-உரை சேவை தேவை. மொழி ஆதரவு உலாவி மற்றும் இணைய இணைப்பைப் பொறுத்தது."
            : "Uses browser speech recognition. Support and network requirements vary by browser; audio is not sent to this app backend."}
        </div>
      </div>
    </div>
  );
};
