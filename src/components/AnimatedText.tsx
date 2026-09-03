import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Reveals a paragraph character by character as it scrolls through the
 * viewport. Each character fades from 0.2 to full opacity when the scroll
 * progress reaches its slice of the string.
 */
export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  if (reducedMotion) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    );
  }

  // One animated element per word rather than per character. Per-character
  // meant ~380 motion values recalculating on every scroll frame for this
  // paragraph, which was enough to drop frames on the way past; per-word is
  // six times fewer and the wave still reads as continuous, because a word is
  // narrow enough that the eye can't pick out the step.
  const words = text.split(' ');

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, w) => (
        <Word
          key={w}
          word={w < words.length - 1 ? `${word} ` : word}
          range={[w / words.length, (w + 1) / words.length]}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span className="inline-block whitespace-pre" aria-hidden="true" style={{ opacity }}>
      {word}
    </motion.span>
  );
}
