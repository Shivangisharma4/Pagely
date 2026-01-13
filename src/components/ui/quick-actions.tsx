"use client";

import { useState } from "react";
import { Plus, BookPlus, Timer, Target, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: BookPlus, label: "Add Book", href: "/discover", color: "bg-blue-500" },
    { icon: Timer, label: "Start Reading", href: "/reading-sessions", color: "bg-green-500" },
    { icon: Target, label: "Set Goal", href: "/reading-goals", color: "bg-purple-500" },
    { icon: TrendingUp, label: "View Stats", href: "/stats", color: "bg-orange-500" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={action.href}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-shadow gap-2"
                  >
                    <action.icon className="h-5 w-5" />
                    {action.label}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
