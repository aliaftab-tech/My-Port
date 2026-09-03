import type { CSSProperties } from 'react';

/**
 * The gradient spheres from the about section, drawn in CSS rather than
 * loaded as images so they cost nothing to download and stay crisp at any
 * size. Shared so the sub-pages carry the same motif as the home page.
 */
const ORB_STYLES = {
  chrome: {
    background:
      'radial-gradient(circle at 34% 30%, #8E9AA6 0%, #4C535C 40%, #23272C 70%, #101215 100%)',
    boxShadow: 'inset -14px -18px 40px rgba(0,0,0,0.7), 0 0 60px rgba(187,204,215,0.10)',
  },
  violet: {
    background:
      'radial-gradient(circle at 30% 26%, #C86BFF 0%, #7621B0 45%, #2A0A3C 78%, #120418 100%)',
    boxShadow: 'inset -16px -20px 46px rgba(0,0,0,0.65), 0 0 70px rgba(118,33,176,0.28)',
  },
  ember: {
    background:
      'radial-gradient(circle at 36% 30%, #FFB27A 0%, #BE4C00 38%, #4A1C00 72%, #150800 100%)',
    boxShadow: 'inset -18px -22px 50px rgba(0,0,0,0.7), 0 0 70px rgba(190,76,0,0.22)',
  },
  outline: {
    border: '1.5px solid rgba(215, 226, 234, 0.35)',
    background: 'radial-gradient(circle at 50% 50%, rgba(182,0,168,0.16) 0%, transparent 65%)',
  },
} satisfies Record<string, CSSProperties>;

export type OrbKind = keyof typeof ORB_STYLES;

export default function Orb({
  kind,
  className,
  style,
}: {
  kind: OrbKind;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full ${className ?? ''}`}
      style={{ ...ORB_STYLES[kind], ...style }}
    />
  );
}
