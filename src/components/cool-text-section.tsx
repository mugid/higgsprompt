"use client";
import { MaskContainer } from "@/components/ui/svg-mask-effect";

export function CoolTextSection() {
  return (
    <div className="flex h-[40rem] w-full items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <p className="mx-auto max-w-4xl text-center text-4xl font-bold dark:text-white">
            Yo, that's a cool text to make you feel like website is cool,
            place , because it indeed is. Make sure to contact us and share cool
            news.
          </p>
        }
        className="h-[40rem] rounded-md text-white dark:text-black"
      >
       MAAAAN THATS DOPE!!!{" "}
        <span className="text-primary">AI is SO FANTASTIC</span> I did this in
        one night
        <span className="text-primary"> can you believe it?</span>.
      </MaskContainer>
    </div>
  );
}
