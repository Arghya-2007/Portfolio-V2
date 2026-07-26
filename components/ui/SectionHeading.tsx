// components/ui/SectionHeading.tsx
// Phase 3 — Server Component (no interactivity needed).
// Shared section-number + display heading pattern per Design.md §6.
// Used in every section to replace repeated inline markup.
// Mono label (JetBrains Mono) + Display heading (Bricolage Grotesque).

interface SectionHeadingProps {
  /** Two-digit section number, e.g. "01" */
  number: string;
  /** Short mono label after the slash, e.g. "About" */
  label: string;
  /** The main display heading text */
  heading: string;
  /** Optional supporting subtext below the heading */
  subheading?: string;
  /** id applied to the <h2> — use for aria-labelledby on the parent <section> */
  id?: string;
  /** Optional extra className on the wrapper */
  className?: string;
}

export default function SectionHeading({
  number,
  label,
  heading,
  subheading,
  id,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${className}`}>
      {/* Mono section-number convention: "01 / About" */}
      <p
        className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3 select-none"
        aria-hidden="true"
      >
        <span className="text-primary-500">{number}</span>
        <span className="mx-1.5 text-text-muted opacity-50">/</span>
        {label}
      </p>

      {/* Display heading — fluid size, display-type letter-spacing */}
      <h2
        id={id}
        className="font-display text-fluid-h2 font-bold text-text-primary display-type"
      >
        {heading}
      </h2>

      {/* Optional subheading — body copy beneath the heading */}
      {subheading && (
        <p className="font-body text-text-secondary mt-3 max-w-xl leading-body text-fluid-body">
          {subheading}
        </p>
      )}
    </div>
  );
}
