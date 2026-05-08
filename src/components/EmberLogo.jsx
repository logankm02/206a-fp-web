export default function EmberLogo({ size = 160 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main flame body */}
      <path
        d="M100 8
           C100 8, 168 55, 168 118
           C168 170, 145 210, 100 218
           C55 210, 32 170, 32 118
           C32 55, 100 8, 100 8 Z"
        fill="#FF6B2B"
      />
      {/* Flame top hook (right curl) */}
      <path
        d="M130 20
           C145 10, 162 25, 155 50
           C148 70, 132 75, 120 68
           C135 55, 138 35, 130 20 Z"
        fill="#FF6B2B"
      />
      {/* Left eye */}
      <ellipse cx="78" cy="168" rx="16" ry="22" fill="white" />
      {/* Right eye */}
      <ellipse cx="122" cy="168" rx="16" ry="22" fill="white" />
    </svg>
  )
}
