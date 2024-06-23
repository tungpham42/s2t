import React, { useState, useEffect, useCallback } from "react";
import { Container, Button, Form, Alert } from "react-bootstrap";

const useSpeechRecognition = (setError, setTranscript) => {
  const [recognition, setRecognition] = useState(null);
  const [language, setLanguage] = useState("en-US"); // Default language

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

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const SpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

  const { recognition, changeLanguage, language } = useSpeechRecognition(
    setError,
    setTranscript
  );

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
    reset();
  };

  const startRecording = useCallback(() => {
    if (recognition) {
      setIsRecording(true);
      setTranscript("");
      recognition.start();
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      setIsRecording(false);
      recognition.stop();
    }
  }, [recognition]);

  const downloadTxt = useCallback(() => {
    downloadFile(transcript, "transcript.txt", "text/txt");
  }, [transcript]);

  const reset = () => {
    setIsRecording(false);
    recognition.stop();
    setTranscript(""); // Clear transcript on reset button click
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Speech to Text Converter</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group controlId="languageSelection">
          <Form.Label>Choose language</Form.Label>
          <Form.Select
            value={language}
            onChange={handleLanguageChange}
            className="mb-3"
          >
            <option value="en-US">English (US)</option>
            <option value="vi">Vietnamese</option>
            <option value="zh-CN">Chinese (Simplified)</option>
            <option value="zh-TW">Chinese (Traditional)</option>
            <option value="ko">Korean</option>
            <option value="ja">Japanese</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="es">Spanish</option>
            <option value="pt">Portuguese</option>
            <option value="ar">Arabic</option>
            <option value="ru">Russian</option>
            {/* Add more languages as needed */}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="transcriptTextarea">
          <Form.Label>Transcript</Form.Label>
          <Form.Control as="textarea" rows={10} value={transcript} readOnly />
        </Form.Group>
        <Button
          variant={!isRecording ? "primary" : "danger"}
          className="mt-3 me-3"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
        <Button
          variant="success"
          onClick={downloadTxt}
          className="mt-3 me-3"
          disabled={!transcript}
        >
          Download TXT
        </Button>
        <Button
          variant="secondary"
          onClick={reset}
          className="mt-3"
          disabled={!transcript}
        >
          Reset
        </Button>
      </Form>
    </Container>
  );
};

export default SpeechToText;
