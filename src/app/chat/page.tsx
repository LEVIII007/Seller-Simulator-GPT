"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolInvocation } from "ai";
import { Message, useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxToolRoundtrips: 5,

      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === "getLocation") {
          const cities = [
            "New York",
            "Los Angeles",
            "Chicago",
            "San Francisco",
          ];
          return cities[Math.floor(Math.random() * cities.length)];
        }
      },
    });

  return (
    <div className="flex flex-col justify-between items-center bg-gray-200 h-[50rem]">
      <div className="flex flex-col justify-between items-center w-full">
        {messages?.map((m: Message) => (
          <div key={m.id} className="flex justify-start gap-8 w-1/2">
            <strong className="min-w-20">{m.role}:</strong>
            {m.content}
            {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
              const toolCallId = toolInvocation.toolCallId;
              const addResult = (result: string) =>
                addToolResult({ toolCallId, result });

              // render confirmation tool (client-side tool with user interaction)
              if (toolInvocation.toolName === "askForConfirmation") {
                return (
                  <div key={toolCallId}>
                    {toolInvocation.args.message}
                    <div>
                      {"result" in toolInvocation ? (
                        <b>{toolInvocation.result}</b>
                      ) : (
                        <>
                          <Button onClick={() => addResult("Yes")}>Yes</Button>
                          <Button onClick={() => addResult("No")}>No</Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              }

              // other tools:
              return "result" in toolInvocation ? (
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
      </div>

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
