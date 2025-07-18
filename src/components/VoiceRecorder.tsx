import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onTranscript?: (text: string) => void;
  className?: string;
}

const VoiceRecorder = ({ onTranscript, className }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        if (onTranscript) {
          onTranscript(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isSupported) {
    return (
      <Button 
        variant="outline" 
        size="icon"
        disabled
        className={cn("border-border bg-muted", className)}
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="w-4 h-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      size="icon"
      onClick={toggleRecording}
      className={cn(
        "border-border transition-all duration-200",
        isRecording && "bg-destructive hover:bg-destructive/80 animate-pulse",
        !isRecording && "hover:bg-accent/10",
        className
      )}
      title={isRecording ? "Stop recording" : "Start voice recording"}
    >
      {isRecording ? (
        <Square className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
};

export default VoiceRecorder;