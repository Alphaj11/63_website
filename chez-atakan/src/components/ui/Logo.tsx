/** Logotype Chez Atakan : flamme + nom en capitales condensées. */
export function FlameMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fm" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FF6A00" />
          <stop offset="1" stopColor="#FFB45E" />
        </linearGradient>
      </defs>
      <path
        d="M16 2c2.4 4.8 8 7.6 8 15.2A8 8 0 0 1 8 17.2c0-3.8 1.8-6 3.2-7.6.1 3.1 1.3 4.6 2.7 5.3C13.2 9.8 14.6 6 16 2Z"
        fill="url(#fm)"
      />
      <path d="M16 15c1.2 2 3 3.2 3 5.6a3 3 0 0 1-6 0c0-1.6 1.6-3 3-5.6Z" fill="#080808" opacity=".55" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <FlameMark className={compact ? 'h-6 w-6' : 'h-8 w-8'} />
      <span className="flex flex-col leading-none">
        <span className="text-[9px] font-semibold uppercase tracking-[0.45em] text-ember-light">Chez</span>
        <span className={`display ${compact ? 'text-xl' : 'text-2xl'} tracking-[0.04em]`}>Atakan</span>
      </span>
    </span>
  );
}
