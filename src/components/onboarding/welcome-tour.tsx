"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, TrendingUp, Target } from "lucide-react";

const steps = [
  {
    title: "Welcome to Pagely!",
    description: "Track your reading journey, discover new books, and connect with fellow readers.",
    icon: BookOpen,
  },
  {
    title: "Build Your Library",
    description: "Add books to your library and organize them by reading status.",
    icon: BookOpen,
  },
  {
    title: "Discover Books",
    description: "Search millions of books and get personalized recommendations.",
    icon: Search,
  },
  {
    title: "Track Progress",
    description: "Log reading sessions and view detailed statistics about your reading habits.",
    icon: TrendingUp,
  },
  {
    title: "Set Goals",
    description: "Create reading goals and track your progress throughout the year.",
    icon: Target,
  },
];

interface WelcomeTourProps {
  open: boolean;
  onComplete: () => void;
}

export function WelcomeTour({ open, onComplete }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onComplete}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">{step.title}</DialogTitle>
          <DialogDescription className="text-center">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 py-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
