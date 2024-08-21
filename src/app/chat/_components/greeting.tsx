import { TextEffect } from "@/components/textEffect";
import React, { useState, useEffect } from "react";

const MyComponent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const messages = [
    "Welcome to TechGear & Beyond!",
    "Your one-stop shop for all things electronics.",
    "We offer a wide range of products including:",
    "• TVs, laptops, and PCs",
    "• Other electronic gadgets and accessories",
    "How can I help you find the perfect electronics for your needs today?",
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