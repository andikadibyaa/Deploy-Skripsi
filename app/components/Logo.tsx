export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield background */}
      <path
        d="M20 2L32 8V18C32 26.5 26.5 34 20 38C13.5 34 8 26.5 8 18V8L20 2Z"
        fill="#3B82F6"
        stroke="#1E40AF"
        strokeWidth="1"
      />

      {/* Eye shape */}
      <ellipse cx="20" cy="18" rx="8" ry="5" fill="white" />

      {/* Pupil */}
      <circle cx="20" cy="18" r="3" fill="#1E40AF" />

      {/* Eye highlight */}
      <circle cx="21" cy="17" r="1" fill="white" />

      {/* Eyelashes/protection lines */}
      <path d="M12 15L10 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 15L30 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 21L10 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 21L30 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

      {/* Guard symbol - small checkmark */}
      <path d="M16 25L18 27L24 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
