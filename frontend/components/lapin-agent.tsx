"use client"

import { useEffect, useState } from "react"
import { BunnyChef } from "@/components/bunny-chef"

const LINES = [
  "Got carrots? I can work with that.",
  "I'm hopping up some ideas!",
  "Hmm… let me think… 🥕",
  "Leftovers are my specialty.",
  "Don't worry, I've got recipes!"
]

export function LaunchAnimation({ externalMessage }: { externalMessage?: string }) {
  const [message, setMessage] = useState("")
  const [isExternal, setIsExternal] = useState(false)
  const [offsetX, setOffsetX] = useState(-45)
  const [offsetY, setOffsetY] = useState(0)

  // Change message every few seconds when no external message is active
  useEffect(() => {
    const talk = setInterval(() => {
      if (!isExternal) {
        const randomLine = LINES[Math.floor(Math.random() * LINES.length)]
        setMessage(randomLine)
      }
    }, 4000)

    return () => clearInterval(talk)
  }, [isExternal])

  // Show external message from parent for a few seconds
  useEffect(() => {
    if (externalMessage) {
      setMessage(externalMessage)
      setIsExternal(true)
      const t = setTimeout(() => {
        setIsExternal(false)
      }, 6000)
      return () => clearTimeout(t)
    }
    return
  }, [externalMessage])

  // Reverted: lively single hop and shift across the screen
  useEffect(() => {
    let animationFrame: NodeJS.Timeout
    let direction = 1 // 1 for right, -1 for left
    let jumpPhase = 0

    const animate = () => {
      // Each complete hop cycle is 20 frames * 50ms = 1 second
      jumpPhase = (jumpPhase + 1) % 20

      // Single jump up and back down (sine wave)
      const jumpHeight = Math.sin((jumpPhase / 20) * Math.PI) * -20
      setOffsetY(jumpHeight)

      // When jump completes (at the end of the cycle), shift horizontally
      if (jumpPhase === 19) {
        setOffsetX((prev) => {
          let newX = prev + direction * 5 // Shift by 5vw per hop (livelier movement)

          // Reverse direction at edges (±45vw)
          if (newX >= 45) {
            direction = -1
          } else if (newX <= -45) {
            direction = 1
          }

          return prev + direction * 5
        })
      }

      animationFrame = setTimeout(animate, 50)
    }

    animate()

    return () => clearTimeout(animationFrame)
  }, [])

  return (
    <div className="mt-8 flex flex-col items-center">
      <div
        style={{
          transform: `translateX(${offsetX}vw) translateY(${offsetY}px)`,
          transition: "none",
        }}
      >
        <BunnyChef message={message} size="lg" />
      </div>
    </div>
  )
}