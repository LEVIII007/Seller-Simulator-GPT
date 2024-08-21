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
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop} = useChat({
    maxToolRoundtrips: 5,

    // run client-side tools that are automatically executed:
  });

  const [mic, setMic] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // const options = [
  //   "Yes sir, let me check my store for you.",
  //   "Wait a moment sir,"

  // ]

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const randomOption = options[Math.floor(Math.random() * options.length)];
    // speak(randomOption);
    handleSubmit();
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      setIsSpeaking(true);
      // console.log(lastMessage)
      speak(lastMessage.content);
    }
  }, [messages]);
  console.log(messages[messages.length - 1]);

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

    {messages.map(message => (
      <div 
        key={message.id} 
        className={`p-4 mb-2 rounded-md ${message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}
      >
        <span className="font-semibold">
          {message.role === 'user' ? 'User: ' : 'AI: '}
        </span>
        {message.content}
      </div>
    ))}


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