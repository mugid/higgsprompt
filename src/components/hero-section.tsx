"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AsciiAnimation } from "@/components/ascii-animation";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden pt-32 pb-20"
    >
      <div className="absolute" />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col justify-center  text-center gap-y-12">
          <div className="space-y-8">
            <h1 className="text-balance font-bold text-5xl leading-tight tracking-tight text-foreground lg:text-6xl">
              Perfect prompts and engineers for Your Products
            </h1>

            <div className="flex flex-col gap-4 items-center justify-center sm:flex-row">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
              >
                Post a Challenge
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Browse Challenges
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-border/50 bg-card p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                <div className="h-3 w-3 rounded-full bg-[#10b981]" />
                <span className="ml-auto font-mono text-xs text-muted-foreground">
                  prompt-generator.ai
                </span>
              </div>
              <AsciiAnimation />
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
