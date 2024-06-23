import { useState, useEffect } from "react";

const useSpeechRecognition = (setError, setTranscript) => {
  const [recognition, setRecognition] = useState(null);
  const [language, setLanguage] = useState("vi"); // Default language

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech recognition not supported by this browser.");
      return; // Early return
    }

    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    recognitionInstance.onresult = (event) => {
      const finalResults = Array.from(event.results)
        .slice(event.resultIndex)
        .filter((result) => result.isFinal)
        .map((result) => result[0].transcript.replace(/period/gi, "."))
        .join("");
      setTranscript((prev) => prev + finalResults);
    };

    recognitionInstance.onerror = (event) => {
      setError(`Error occurred in recognition: ${event.error}`);
    };

    // Set language based on the state
    recognitionInstance.lang = language;

    setRecognition(recognitionInstance);
  }, [setError, setTranscript, language]);

  // Function to change recognition language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return { recognition, changeLanguage };
};

export default useSpeechRecognition;
