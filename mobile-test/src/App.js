import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [finalText, setFinalText] = useState(''); // 최종 텍스트를 저장할 상태 추가

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setResult(interimTranscript); // 임시 결과 표시
        if (finalTranscript !== '') {
          setFinalText(prev => prev + ' ' + finalTranscript); // 최종 결과 누적
        }
      };

      recognition.onend = () => {
        // 음성 인식이 종료되면 자동으로 상태 업데이트
        setIsRecording(false);
        setResult('');
      };

      recognition.onerror = (event) => {
        console.error('음성 인식 에러:', event.error);
        setIsRecording(false);
      };

      recognition.start();
      setRecognition(recognition);
    } else {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
  };

  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    setIsRecording(!isRecording);
  };

  const handleReset = () => {
    setFinalText(''); // 최종 텍스트 초기화
    setResult(''); // 현재 인식 중인 텍스트 초기화
  };

  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  return (
    <div className="App">
      <button 
        className={`record-btn ${isRecording ? 'recording' : ''}`}
        onClick={handleRecordClick}
      >
        {isRecording ? '음성 인식 중지' : '음성 인식 시작'}
      </button>
      
      {/* 현재 인식 중인 텍스트 표시 */}
      {isRecording && result && (
        <div className="interim-result">
          인식 중: {result}
        </div>
      )}
      
      {/* 최종 변환된 텍스트 표시 */}
      <div className="final-result">
        <h3>변환된 텍스트:</h3>
        <div className="result-box">
          {finalText}
        </div>
      </div>

      {/* 초기화 버튼 */}
      {finalText && (
        <button className="reset-btn" onClick={handleReset}>
          텍스트 초기화
        </button>
      )}
    </div>
  );
}

export default App;