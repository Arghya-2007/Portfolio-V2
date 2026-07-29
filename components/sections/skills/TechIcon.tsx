// components/sections/skills/TechIcon.tsx
// Unified icon renderer for skill technologies.
//
// iconType: 'simple-icons' → pulls from the npm `simple-icons` package,
//   renders an inline SVG with fill="currentColor" so CSS controls color.
// iconType: 'lucide' → renders a lucide-react component for abstract concepts.
//
// All icons get aria-label + role="img" for accessibility.
// Falls back to a "?" glyph if the icon slug is not found.

import { type CSSProperties } from 'react';
// Import the simple-icons lookup function
import * as si from 'simple-icons';
import {
  Globe,
  Cloud,
  Network,
  Wifi,
  MessageSquare,
  Scale,
  Layers,
  BrainCircuit,
  HelpCircle,
  type LucideProps,
} from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// Lucide icon type — matches the actual exported component shape
type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;

const LUCIDE_MAP: Record<string, LucideIcon> = {
  Globe,
  Cloud,
  Network,
  Wifi,
  MessageSquare,
  Scale,
  Layers,
  BrainCircuit,
};

interface TechIconProps {
  /** Icon key: simple-icons slug OR lucide component name */
  iconKey: string;
  iconType: 'simple-icons' | 'lucide';
  /** Display name for aria-label */
  name: string;
  /** Icon size in px — defaults to 32 */
  size?: number;
  /** Optional extra className */
  className?: string;
  /** Optional override color (CSS color string). Defaults to currentColor for SI, text-secondary for Lucide */
  color?: string;
}

export default function TechIcon({
  iconKey,
  iconType,
  name,
  size = 32,
  className = '',
  color,
}: TechIconProps) {
  if (iconType === 'simple-icons') {
    // simple-icons exports as `si<PascalCase>` keys, e.g. siReact, siNextdotjs
    // We build the export key from the slug: "react" → "siReact", "nextdotjs" → "siNextdotjs"
    const exportKey = `si${iconKey.charAt(0).toUpperCase()}${iconKey.slice(1)}` as keyof typeof si;
    const icon = si[exportKey] as { svg: string; title: string } | undefined;

    if (!icon) {
      // Fallback: question mark
      return (
        <HelpCircle
          size={size}
          className={`text-text-muted ${className}`}
          aria-label={`${name} (icon not found)`}
        />
      );
    }

    // Inject currentColor fill into the SVG path so CSS/Tailwind controls color
    // Also clean any hardcoded fill attributes from the icon
    const svgContent = icon.svg
      .replace(/^<svg /, `<svg aria-label="${name}" role="img" focusable="false" fill="currentColor" `)
      .replace(/fill="[^"]*"/g, 'fill="currentColor"');

    const style: CSSProperties = {
      width: size,
      height: size,
      display: 'inline-block',
      flexShrink: 0,
      color: color ?? 'currentColor',
    };

    return (
      <span
        style={style}
        className={className}
        // dangerouslySetInnerHTML is safe here — source is the audited npm package
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svgContent }}
        aria-label={name}
        role="img"
      />
    );
  }

  // lucide icons
  const LucideIcon = LUCIDE_MAP[iconKey] ?? HelpCircle;
  return (
    <LucideIcon
      size={size}
      className={`${className}`}
      color={color ?? 'currentColor'}
      strokeWidth={1.5}
      aria-label={name}
    />
  );
}
