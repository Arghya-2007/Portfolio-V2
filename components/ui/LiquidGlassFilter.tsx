// components/ui/LiquidGlassFilter.tsx
// Shared SVG distortion filter for liquid glass refraction effect.
// Server Component — rendered once in layout.tsx, referenced by CSS
// filter: url(#liquid-distortion) on .glass-liquid::before.

export default function LiquidGlassFilter() {
  return (
    <svg
      width={0}
      height={0}
      style={{ position: 'absolute' }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="liquid-distortion"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={18}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
