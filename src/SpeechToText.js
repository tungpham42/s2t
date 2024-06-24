import React, { useState, useCallback } from "react";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faDownload,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import useSpeechRecognition from "./useSpeechRecognition";
import downloadFile from "./downloadFile";
import languages from "./languages";

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
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
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
          {isRecording ? (
            <>
              <FontAwesomeIcon icon={faMicrophoneSlash} /> Stop
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faMicrophone} /> Start
            </>
          )}
        </Button>
        <Button
          variant="success"
          onClick={downloadTxt}
          className="mt-3 me-3"
          disabled={!transcript}
        >
          <FontAwesomeIcon icon={faDownload} /> Download TXT
        </Button>
        <Button
          variant="secondary"
          onClick={reset}
          className="mt-3"
          disabled={!transcript}
        >
          <FontAwesomeIcon icon={faRedoAlt} /> Reset
        </Button>
      </Form>
    </Container>
  );
};

export default SpeechToText;
