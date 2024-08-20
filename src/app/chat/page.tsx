"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mic, MicOff } from "lucide-react";
import { useState } from "react";
import MyComponent from "./_components/greeting";


import { ToolInvocation } from "ai";
import { Message, useChat } from "ai/react";


import { SendHorizontal } from "lucide-react";


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxToolRoundtrips: 10,
    });
  const [mic, setMic] = useState(false);
  return (
    <div className="flex flex-col justify-between items-center  h-[55rem] pt-4">
      <MyComponent></MyComponent>
      {mic ? (
        <Image
          src="/bot.jpeg"
          width={500}
          height={500}
          className="rounded-full p-4 m-4 shadow-xl shadow-white animate-flicker"
          alt="Picture of the author"
        />
      ) : (
        <Image
          src="/bot.jpeg"
          width={500}
          height={500}
          className="rounded-full p-4 m-4 shadow-xl"
          alt="Picture of the author"
        />
      )}

    {messages?.map((m: Message) => (
            <div key={m.id}>
              <strong>{m.role}:</strong>
              {m.content}
              {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                const toolCallId = toolInvocation.toolCallId;
                const addResult = (result: string) =>
                  addToolResult({ toolCallId, result });

                // render confirmation tool (client-side tool with user interaction)
                if (toolInvocation.toolName === 'askForConfirmation') {
                  return (
                    <div key={toolCallId}>
                      {toolInvocation.args.message}
                      <div>
                        {'result' in toolInvocation ? (
                          <b>{toolInvocation.result}</b>
                        ) : (
                          <>
                            <button onClick={() => addResult('Yes')}>Yes</button>
                            <button onClick={() => addResult('No')}>No</button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }

                // other tools:
                return 'result' in toolInvocation ? (
                  <div key={toolCallId}>
                    Tool call {`${toolInvocation.toolName}: `}
                    {toolInvocation.result}
                  </div>
                ) : (
                  <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
                );
              })}
              <br />
            </div>
          ))}




      <form onSubmit={handleSubmit} className="p-5 m-5 w-full px-[28rem]">
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
            onClick={handleSubmit}
          ></SendHorizontal>
        </div>
      </form>
    </div>
  );
}