/** Ilustración de marca: un perrito y un gatito asomándose. Decorativa. */
export default function HeroPets({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="flex items-end justify-center">
        <svg viewBox="0 0 150 150" className="h-auto w-[58%] max-w-[220px]">
          <ellipse cx="40" cy="70" rx="20" ry="34" fill="#B07A52" transform="rotate(18 40 70)" />
          <ellipse cx="110" cy="70" rx="20" ry="34" fill="#B07A52" transform="rotate(-18 110 70)" />
          <circle cx="75" cy="88" r="50" fill="#E8B98A" />
          <ellipse cx="75" cy="112" rx="26" ry="20" fill="#F6E1C8" />
          <circle cx="58" cy="82" r="6" fill="#24342D" />
          <circle cx="92" cy="82" r="6" fill="#24342D" />
          <circle cx="60" cy="80" r="2" fill="#FFFFFF" />
          <circle cx="94" cy="80" r="2" fill="#FFFFFF" />
          <ellipse cx="75" cy="100" rx="9" ry="6.5" fill="#24342D" />
          <path d="M66 110q9 8 18 0" stroke="#24342D" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="46" cy="98" r="7" fill="#F4A79A" opacity="0.7" />
          <circle cx="104" cy="98" r="7" fill="#F4A79A" opacity="0.7" />
        </svg>
        <svg viewBox="0 0 120 120" className="-ml-[6%] h-auto w-[46%] max-w-[176px]">
          <path d="M22 50 L30 10 L52 36 Z" fill="#8E8E9A" />
          <path d="M98 50 L90 10 L68 36 Z" fill="#8E8E9A" />
          <path d="M30 40 L33 22 L44 36 Z" fill="#F4A79A" />
          <path d="M90 40 L87 22 L76 36 Z" fill="#F4A79A" />
          <circle cx="60" cy="72" r="42" fill="#A9A9B5" />
          <ellipse cx="46" cy="68" rx="5" ry="7" fill="#24342D" />
          <ellipse cx="74" cy="68" rx="5" ry="7" fill="#24342D" />
          <path d="M56 82 L64 82 L60 87 Z" fill="#F4A79A" />
          <path d="M60 87 q-5 6 -10 3 M60 87 q5 6 10 3" stroke="#24342D" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="36" cy="84" r="6" fill="#F4A79A" opacity="0.6" />
          <circle cx="84" cy="84" r="6" fill="#F4A79A" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
