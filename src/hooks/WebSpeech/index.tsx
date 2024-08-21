import { useEffect, useRef, useState } from "react";

const colors = ["red", "green", "blue", "yellow"];

interface SpeechToTextOptions {
  interimResults?: boolean;
  lang?: string;
  continuous?: boolean;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
}

const useSpeechToText = (
  options: SpeechToTextOptions
): UseSpeechToTextReturn => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const recognitionRef = useRef<null | any>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech Recognition not supported");
      return;
    }
    recognitionRef.current = new (window as any).webkitSpeechRecognition();
    const recognition = recognitionRef.current;
    recognition.interimResults = options.interimResults || true;
    recognition.lang = options.lang || "en-US";
    recognition.continuous = options.continuous || false;

    if ("webkitSpeechGrammarList" in window) {
      const grammar =
        "#JSGF V1.0; grammar colors; public <color> = " +
        colors.join(" | ") +
        " ;";
      const speechRecognitionList = new (
        window as any
      ).webkitSpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecognitionList;
    }

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
    };
    recognition.onend = () => {
      setIsListening(false);
      setTranscript("");
    };

    return () => {
      recognition.stop();
    };
  }, [options]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening };
};

export default useSpeechToText;
