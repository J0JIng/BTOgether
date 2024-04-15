import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const GoogleGenerativeAIComponent = ({ prompt }) => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyCEc-24tGNPXI_i036RTDNOOGCGm-Hc4ug"
    );

    const run = async () => {
      try {
        setIsLoading(true);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const enhancedPrompt = `
        Tell me more about ${prompt}.
        Do not use Markdown. Limited to 700 characters.
        Note the context is about Singapore and I want you to advise (if possible) to young couples that are trying to buy a house near that location.
      `;
        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        const text = await response.text();
        setGeneratedContent(text);
      } catch (error) {
        console.error("Error generating content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [prompt]);

  // Format the generated content
  const formatContent = (content) => {
    // Bold words enclosed within ** **
    const boldContent = content.replace(/\*\*(.*?)\*\*/g, "$1");
    // Format sentences starting with *
    const formattedContent = boldContent.split("\n").map((paragraph, index) => {
      if (paragraph.trim().startsWith("*")) {
        return <li key={index}>{paragraph.trim().substring(1)}</li>;
      } else {
        return <p key={index}>{paragraph}</p>;
      }
    });
    return formattedContent;
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-black"
          />
          <p className="text-gray-600 mt-2">Loading</p>
        </div>
      ) : (
        <div>{formatContent(generatedContent)}</div>
      )}
    </div>
  );
};

export default GoogleGenerativeAIComponent;
