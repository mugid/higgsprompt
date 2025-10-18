"use client"

import { useEffect, useState } from "react"

const pikachuFrames = [
  ``,
  `>`,
  `> (`,
  `> (\\`,
  `> (\\_`,
  `> (\\_/)`,
  `> (\\_/)\n(`,
  `> (\\_/)\n(='`,
  `> (\\_/)\n(='.`,
  `> (\\_/)\n(='.'`,
  `> (\\_/)\n(='.')`,
  `> (\\_/)\n(='.')\n(`,
  `> (\\_/)\n(='.')\n(")`,
  `> (\\_/)\n(='.')\n(")_(`,
  `> (\\_/)\n(='.')\n(")_(")`,
  `  (\\_/)\n (='.')\n (")_(")`,
  `  (\\_/)\n (='.')\n (")_(")
  
G`,
  `  (\\_/)\n (='.')\n (")_(")
  
Ge`,
  `  (\\_/)\n (='.')\n (")_(")
  
Gen`,
  `  (\\_/)\n (='.')\n (")_(")
  
Gene`,
  `  (\\_/)\n (='.')\n (")_(")
  
Gener`,
  `  (\\_/)\n (='.')\n (")_(")
  
Genera`,
  `  (\\_/)\n (='.')\n (")_(")
  
Generat`,
  `  (\\_/)\n (='.')\n (")_(")
  
Generati`,
  `  (\\_/)\n (='.')\n (")_(")
  
Generatin`,
  `  (\\_/)\n (='.')\n (")_(")
  
Generating`,
  `  (\\_/)\n (='.')\n (")_(")
  
Generating.`,
  `  (\\_/)\n (='.')\n (")_(")
  
Generating..`,
  `  (\\_/)\n (='.')\n (")_(")
  
Generating...`,
  `  (\\_/)\n (='.')\n (")_(")
  
Generating... ✓`,
]

export function AsciiAnimation() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (frame < pikachuFrames.length - 1) {
      const timer = setTimeout(() => {
        setFrame(frame + 1)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [frame])

  return (
    <div className="relative min-h-[200px] rounded-md bg-secondary/50 p-6 font-mono text-sm">
      <pre className="text-primary whitespace-pre leading-relaxed">{pikachuFrames[frame]}</pre>
      {frame === pikachuFrames.length - 1 && (
        <div className="mt-4 text-xs text-muted-foreground">→ Perfect prompt generated in 2.8s</div>
      )}
    </div>
  )
}
