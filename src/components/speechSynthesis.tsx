import { useEffect, useState } from "react";

const useSpeechSynthesis = () => {
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const synthInstance = window.speechSynthesis;
      setSynth(synthInstance);

      const populateVoiceList = () => {
        synthInstance.getVoices();
      };

      populateVoiceList();
      synthInstance.onvoiceschanged = populateVoiceList;
    }
  }, []);
  let speechQueue: Array<any> = [];

  const speak = (text: string) => {
    if (!synth) {
      console.error("SpeechSynthesis is not available");
      return;
    }

    if (synth.speaking) {
      console.warn(
        "SpeechSynthesis is already speaking. Queuing the new speech."
      );
      speechQueue.push(text); // Queue the new speech
    }
    //  else {
    //   const utterance = new SpeechSynthesisUtterance(text);
    //   utterance.onend = () => {
    //     if (speechQueue.length > 0) {
    //       const nextText = speechQueue.shift(); // Dequeue the next speech
    //       speak(nextText); // Speak the next speech
    //     }
    //   };
    //   synth.speak(utterance); // Speak the current speech
    // }
    if (text !== "") {
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.rate = 1.2;
      utterThis.pitch = 1;

      // Set the voice to "Google UK English Male (en-GB)"
      const selectedVoice = synth
        .getVoices()
        .find(
          (voice) =>
            voice.name === "Google UK English Male" && voice.lang === "en-GB"
        );
      if (selectedVoice) {
        utterThis.voice = selectedVoice;
      } else {
        console.error("Google UK English Male (en-GB) voice not found");
      }
      // Add event listeners for debugging
      utterThis.onstart = () => {
        console.log("Speech started");
      };
      utterThis.onend = () => {
        console.log("Speech ended");
      };
      utterThis.onerror = (event) => {
        console.error("Speech error", event.error);
      };
      synth.speak(utterThis);

      utterThis.onpause = (event) => {
        const char = event.utterance.text.charAt(event.charIndex);
        console.log(
          `Speech paused at character ${event.charIndex} of "${event.utterance.text}", which is "${char}".`
        );
      };
    }
  };

  return { speak };
};

export default useSpeechSynthesis;
