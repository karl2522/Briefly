'use client'


interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle with gradient */}
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="url(#gradient)"
          stroke="url(#gradient)"
          strokeWidth="2"
        />
        
        {/* Note/document icon */}
        <path
          d="M12 8h8v2h-8V8zm0 4h6v2h-6v-2zm0 4h8v2h-8v-2z"
          fill="white"
          opacity="0.9"
        />
        
        {/* Community/users indicator - small dots */}
        <circle cx="22" cy="10" r="1.5" fill="white" opacity="0.8" />
        <circle cx="24.5" cy="10" r="1.5" fill="white" opacity="0.8" />
        <circle cx="23.25" cy="12.5" r="1.5" fill="white" opacity="0.8" />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Text logo component
export function LogoText({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size="md" />
      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Briefly
      </span>
    </div>
  )
}
