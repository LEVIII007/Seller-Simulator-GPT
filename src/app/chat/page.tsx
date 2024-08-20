"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";
import MyComponent from "./_components/greeting";
import { ToolInvocation } from "ai";
import { Message, useChat } from "ai/react";
import { SendHorizontal } from "lucide-react";
import useSpeechSynthesis from "@/components/speechSynthesis";

export default function Chat() {
  const { speak } = useSpeechSynthesis();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 5,

    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "getLocation") {
        const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
        return cities[Math.floor(Math.random() * cities.length)];
      }
    },
  });

  const [mic, setMic] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      setIsSpeaking(true);
      speak(lastMessage.content);
    }
  }, [messages]);

  return (
    <div className="flex flex-col justify-between items-center h-[55rem] pt-4">
      <MyComponent />

      <Image
        src="/bot.jpeg"
        width={500}
        height={500}
        className="rounded-full p-4 m-4 shadow-xl shadow-white animate-flicker"
        alt="Picture of the author"
      />

      <form onSubmit={handleFormSubmit} className="p-5 m-5 w-full px-[28rem]">
        <div className="flex justify-between items-center gap-4 border border-white rounded-md px-3 py-1">
          {mic ? (
            <Mic
              size={24}
              className="text-white rounded-full"
              onClick={() => setMic(false)}
            />
          ) : (
            <MicOff
              size={32}
              className="text-white rounded-full"
              onClick={() => setMic(true)}
            />
          )}
          <Input
            value={input}
            onChange={handleInputChange}
            className="w-full border-none focus:outline-none focus:ring-0 text-xl"
          />
          <SendHorizontal
            size={32}
            className="text-white rounded-full"
            onClick={handleFormSubmit}
          />
        </div>
      </form>
    </div>
  );
}
