import { useEffect, useState } from "react";

const LINES = [
  "Got carrots? I can work with that.",
  "I’m hopping up some ideas!",
  "Hmm… let me think… 🥕",
  "Leftovers are my specialty.",
  "Don’t worry, I’ve got recipes!"
];

export default function RabbitAgent() {
  const [message, setMessage] = useState("");
  const [pos, setPos] = useState({ x: 20, y: 20 });

  // Change message every few seconds
  useEffect(() => {
    const talk = setInterval(() => {
      const randomLine = LINES[Math.floor(Math.random() * LINES.length)];
      setMessage(randomLine);
    }, 4000);

    return () => clearInterval(talk);
  }, []);

  // Make rabbit hop around
  useEffect(() => {
    const hop = setInterval(() => {
      setPos({
        x: Math.random() * 80,
        y: Math.random() * 80
      });
    }, 3000);

    return () => clearInterval(hop);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        transition: "all 0.8s ease"
      }}
    >
      🐰
      {message && (
        <div className="speech-bubble">
          {message}
        </div>
      )}
    </div>
  );
}
