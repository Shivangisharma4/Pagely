"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ReadingTimer({ bookTitle }: { bookTitle?: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStop = () => {
    setIsRunning(false);
    // TODO: Save reading session
    console.log("Reading session:", { duration: seconds, book: bookTitle });
    setSeconds(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Reading Timer
        </CardTitle>
        <CardDescription>
          {bookTitle || "Track your reading time"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold tabular-nums">{formatTime(seconds)}</div>
          <p className="text-sm text-muted-foreground mt-2">
            {isRunning ? "Reading in progress..." : "Ready to start"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1"
            variant={isRunning ? "secondary" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          {seconds > 0 && (
            <Button onClick={handleStop} variant="outline">
              <Square className="h-4 w-4 mr-2" />
              Stop & Save
            </Button>
          )}
        </div>

        {seconds > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {Math.floor(seconds / 60)} minutes of focused reading
          </div>
        )}
      </CardContent>
    </Card>
  );
}
