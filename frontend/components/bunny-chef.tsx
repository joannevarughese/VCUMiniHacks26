"use client"

interface BunnyChefProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function BunnyChef({ message, size = "md" }: BunnyChefProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48"
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {message && (
        <div className="relative bg-foreground text-background px-4 py-2 rounded-lg text-sm max-w-[200px] text-center">
          {message}
          <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-foreground" />
        </div>
      )}
      <svg
        viewBox="0 0 200 200"
        className={sizeClasses[size]}
        aria-label="Chef Lapin bunny mascot"
      >
        {/* Chef Hat */}
        <ellipse cx="100" cy="45" rx="35" ry="20" fill="white" stroke="#e5e5e5" strokeWidth="1" />
        <rect x="70" y="45" width="60" height="25" fill="white" stroke="#e5e5e5" strokeWidth="1" />
        <ellipse cx="100" cy="35" rx="25" ry="15" fill="white" />
        <ellipse cx="85" cy="30" rx="12" ry="10" fill="white" />
        <ellipse cx="115" cy="30" rx="12" ry="10" fill="white" />
        
        {/* Left Ear */}
        <ellipse cx="70" cy="50" rx="12" ry="30" fill="white" stroke="#f5f5f5" strokeWidth="1" />
        <ellipse cx="70" cy="50" rx="6" ry="20" fill="#ffc0cb" opacity="0.5" />
        
        {/* Right Ear */}
        <ellipse cx="130" cy="50" rx="12" ry="30" fill="white" stroke="#f5f5f5" strokeWidth="1" />
        <ellipse cx="130" cy="50" rx="6" ry="20" fill="#ffc0cb" opacity="0.5" />
        
        {/* Head */}
        <ellipse cx="100" cy="95" rx="40" ry="35" fill="white" stroke="#f5f5f5" strokeWidth="1" />
        
        {/* Face */}
        {/* Eyes */}
        <ellipse cx="85" cy="90" rx="4" ry="5" fill="#333" />
        <ellipse cx="115" cy="90" rx="4" ry="5" fill="#333" />
        <circle cx="83" cy="88" r="1.5" fill="white" />
        <circle cx="113" cy="88" r="1.5" fill="white" />
        
        {/* Blush */}
        <ellipse cx="70" cy="100" rx="8" ry="5" fill="#ffc0cb" opacity="0.4" />
        <ellipse cx="130" cy="100" rx="8" ry="5" fill="#ffc0cb" opacity="0.4" />
        
        {/* Nose */}
        <ellipse cx="100" cy="100" rx="5" ry="4" fill="#ffc0cb" />
        
        {/* Mouth */}
        <path d="M 95 108 Q 100 115 105 108" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Body */}
        <ellipse cx="100" cy="155" rx="35" ry="30" fill="white" stroke="#f5f5f5" strokeWidth="1" />
        
        {/* Apron */}
        <path d="M 70 140 L 70 175 Q 100 185 130 175 L 130 140 Q 100 150 70 140" fill="#ffc0cb" opacity="0.6" />
        <rect x="90" y="145" width="20" height="15" fill="#ffc0cb" opacity="0.8" rx="2" />
        
        {/* Arms */}
        <ellipse cx="60" cy="155" rx="12" ry="15" fill="white" stroke="#f5f5f5" strokeWidth="1" />
        <ellipse cx="140" cy="155" rx="12" ry="15" fill="white" stroke="#f5f5f5" strokeWidth="1" />
        
        {/* Mixing Bowl */}
        <ellipse cx="100" cy="180" rx="30" ry="12" fill="#d8a9b0" />
        <path d="M 70 175 Q 70 195 100 195 Q 130 195 130 175" fill="#e8b9c0" stroke="#d8a9b0" strokeWidth="1" />
        <ellipse cx="100" cy="175" rx="25" ry="8" fill="#f5e0e3" />
        
        {/* Spoon */}
        <rect x="115" y="150" width="4" height="35" fill="#c9a86c" rx="2" transform="rotate(20 117 167)" />
        <ellipse cx="125" cy="148" rx="8" ry="6" fill="#d4b87a" transform="rotate(20 125 148)" />
      </svg>
    </div>
  )
}
