"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import Link from "next/link";
import { motion } from "motion/react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden pt-32 pb-20"
    >
      <div className="absolute" />
      <BackgroundRippleEffect />
      <div className="container relative mx-auto px-4 z-10">
        <div className="flex flex-col justify-center  text-center gap-y-12">
          <div className="space-y-8">
            <h1 className="text-balance font-bold text-5xl leading-tight tracking-tight text-foreground lg:text-6xl">
              Perfect prompts and engineers for your products
            </h1>

            <div className="flex flex-col gap-4 items-center justify-center sm:flex-row">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
              >
                <Link href="/battles">Post a Challenge</Link>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                <Link href="/battles">Browse Challenges</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto">
            <PixelatedCanvas
              src="./keyboard.jpeg"
              cellSize={3}
              dotScale={0.9}
              width={1000}
              height={300}
              shape="square"
              backgroundColor="#000000"
              dropoutStrength={0.4}
              interactive
              distortionStrength={1}
              distortionRadius={80}
              distortionMode="swirl"
              followSpeed={0.2}
              jitterStrength={4}
              jitterSpeed={4}
              sampleAverage
              tintColor="#FFFFFF"
              tintStrength={0.2}
              className="rounded-xl border border-neutral-800 shadow-lg"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
