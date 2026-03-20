import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Web Speech API types
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface VoiceCommandButtonProps {
  onGoalParsed: (goal: {
    title: string;
    description: string;
    deadline: string | null;
    category: string;
    priority: "high" | "medium" | "low";
  }) => void;
}

type VoiceState = "idle" | "listening" | "processing";

const VoiceCommandButton = ({ onGoalParsed }: VoiceCommandButtonProps) => {
  const [state, setState] = useState<VoiceState>("idle");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast({
        title: "Not supported",
        description: "Voice commands aren't supported in this browser. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setState("listening");

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setState("processing");

      try {
        const { data, error } = await supabase.functions.invoke(
          "parse-voice-command",
          { body: { transcript } }
        );

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        onGoalParsed(data);
        toast({
          title: "Goal created from voice",
          description: `"${data.title}" has been added.`,
        });
      } catch (err: any) {
        console.error("Voice parse error:", err);
        toast({
          title: "Couldn't parse command",
          description: err?.message || "Please try again with a clearer command.",
          variant: "destructive",
        });
      } finally {
        setState("idle");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech error:", event.error);
      if (event.error !== "aborted") {
        toast({
          title: "Voice error",
          description: event.error === "not-allowed"
            ? "Microphone access denied. Please allow microphone access."
            : "Couldn't capture audio. Please try again.",
          variant: "destructive",
        });
      }
      setState("idle");
    };

    recognition.onend = () => {
      if (state === "listening") {
        // No result received, ended naturally
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onGoalParsed, state]);

  const handleClick = () => {
    if (state === "listening") {
      stopListening();
      setState("idle");
    } else if (state === "idle") {
      startListening();
    }
  };

  return (
    <Button
      variant={state === "listening" ? "destructive" : "outline"}
      className={cn(
        "h-auto py-4 flex-col gap-2 relative",
        state === "listening" && "animate-pulse"
      )}
      onClick={handleClick}
      disabled={state === "processing"}
    >
      {state === "processing" ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : state === "listening" ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
      <span className="text-xs">
        {state === "processing"
          ? "Processing..."
          : state === "listening"
          ? "Listening..."
          : "Voice Goal"}
      </span>
    </Button>
  );
};

export default VoiceCommandButton;
