import { TextEffect } from "@/components/textEffect";
import React, { useState, useEffect } from "react";

const MyComponent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const messages = [
    "Welcome to BabyGear & Beyond!",
    "Your one-stop shop for all things baby, kids, and active families.",
    "We offer a wide range of products including:",
    "• Baby essentials and gear",
    "• Children's clothing and shoes",
    "• Sports equipment for the whole family",
    "How can I help you find the perfect items for your growing family today?",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3500); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div>
      {isMounted && (
        <TextEffect
          key={currentMessageIndex} // Add key to force re-render
          per="char"
          preset="fade"
          className="text-2xl font-bold text-red-50"
        >
          {messages[currentMessageIndex]}
        </TextEffect>
      )}
    </div>
  );
};

export default MyComponent;