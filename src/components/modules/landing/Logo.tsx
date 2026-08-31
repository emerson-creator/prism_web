/**
 * Prism mark: a single stroke that splits into three colored
 * beams — refraction as the brand's symbol. Monochrome at rest,
 * reveals the spectrum on hover.
 */
export default function PrismMark() {
  return (
    <svg
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M9 12L1 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="text-foreground/70 transition-opacity duration-300 group-hover:opacity-40"
      />
      <path
        d="M9 3L16.5 12L9 21Z"
        className="fill-foreground transition-colors duration-300 group-hover:fill-none"
      />
      <g className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <path
          d="M16.5 12L25 6.5"
          stroke="#6366f1"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.5 12L25 12"
          stroke="#ec4899"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.5 12L25 17.5"
          stroke="#f59e0b"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
