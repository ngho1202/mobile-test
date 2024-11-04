import React, { useState } from 'react';

const VoiceRecognition = () => {
  const [transcript, setTranscript] = useState('');

  const startRecognition = () => {
    const recognition = new window.webkitSpeechRecognition(); // Chrome 전용
    recognition.lang = 'ko-KR'; // 한국어 설정
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };

    recognition.start();
  };

  return (
    <div>
      <button onClick={startRecognition}>음성 인식 시작</button>
      <p>인식 결과: {transcript}</p>
    </div>
  );
};

export default VoiceRecognition;
