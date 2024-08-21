"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MyComponent from "./_components/greeting";
import { Message, useChat } from "ai/react";
import { SendHorizontal } from "lucide-react";
import useSpeechSynthesis from "@/components/speechSynthesis";

export default function Chat() {
  const { speak } = useSpeechSynthesis();
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      maxToolRoundtrips: 5,
    });

  const [mic, setMic] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    speak("Ok Sir, I will look into it");
    handleSubmit();
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      setIsSpeaking(true);
      setTimeout(() => {
        if (!isLoading) {
          const content = lastMessage.content;
          const words = content.split(" "); // Split the content into words
          const chunkSize = 30;
          for (let i = 0; i < words.length; i += chunkSize) {
            const chunk = words.slice(i, i + chunkSize).join(" ");
            speak(chunk); // Call the speak function for each chunk of 30 words or less
          }
        }
      }, 3000);
    }
  }, [messages]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="flex flex-col justify-between items-center h-[55rem] pt-4">
      <div className="min-w-[60rem] flex justify-center flex-col items-center">
        <MyComponent />

        <Image
          src="/bot.jpeg"
          width={300}
          height={300}
          className="rounded-full p-4 m-4 shadow-xl shadow-white animate-flicker"
          alt="Picture of the author"
        />
      </div>
      <div className="flex flex-col max-w-[50rem] overflow-y-auto hide-scrollbar h-96 px-2 scroll-m-0 m-2">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div key={message.id} className=" flex justify-start w-full">
              {/* <div className="font-semibold p-4 mb-2 rounded-md">
                {message.role === "user" ? "User: " : "AI: "}
              </div> */}
              <div
                className={`${
                  message.role === "user"
                    ? "bg-slate-700 text-white text-left w-full p-4 rounded-xl"
                    : "bg-gray-100 text-gray-900 text-right w-full p-4 rounded-xl"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {isLoading && (
          <div className="text-center">
            <p className="font-bold">Processing your request...</p>
            <button
              type="button"
              className="bg-white text-black rounded-sm px-4 py-2 mt-2"
              onClick={() => stop()}
            >
              Stop
            </button>
          </div>
        )}
      </div>

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
            disabled={isLoading}
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
