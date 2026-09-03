import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';
import { PROJECTS, type Project, type ProjectImage } from '../data/projects';
import { SIZES, srcSetFor } from '../lib/images';

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-24 pt-20 sm:-mt-12
        sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight
          sm:mb-20 md:mb-24"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Projects
      </FadeIn>

      <div ref={containerRef}>
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={i}
            total={PROJECTS.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Cards deeper in the stack end up scaled down the furthest, so the ones
  // already parked behind stay visible as a stepped edge.
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    /* The container is the scroll distance one card gets before the next
       climbs over it. Once the card itself shrank on phones, 88vh left a
       third of the screen empty under it — so the phone value comes down with
       the card and the next one arrives sooner. Tablet and up are unchanged. */
    <div className="sticky top-20 flex h-[70vh] items-start justify-center sm:h-[80vh] md:top-24 md:h-[88vh]">
      <motion.article
        // `willChange` keeps the card on its own compositor layer. Without it
        // the browser re-rasterises the whole card — border, three
        // screenshots and all — at every step of the scale.
        style={{ scale, top: `${index * 28}px`, transformOrigin: 'top', willChange: 'transform' }}
        className="relative w-full max-w-6xl rounded-[32px] border-2 border-[#D7E2EA] bg-[#0C0C0C]
          p-3 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="mb-3 flex flex-col gap-3 md:mb-5 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            <span
              className="hero-heading shrink-0 font-black leading-none"
              style={{ fontSize: 'clamp(1.9rem, 6vw, 88px)' }}
            >
              {project.number}
            </span>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50 sm:text-sm">
                {project.category}
              </span>
              <h3
                className="font-medium uppercase leading-tight tracking-tight text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1.15rem, 2.6vw, 2.25rem)' }}
              >
                <Link to={`/work/${project.slug}`} className="hover:opacity-70">
                  {project.name}
                </Link>
              </h3>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to={`/work/${project.slug}`}
              className="whitespace-nowrap rounded-full border border-[#D7E2EA]/40 px-4 py-2 text-xs
                font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200
                hover:bg-[#D7E2EA]/10 sm:px-5 sm:text-sm"
            >
              Case study
            </Link>
            <LiveProjectButton href={project.href} />
          </div>
        </div>

        <p
          className="mb-2.5 max-w-3xl font-light leading-relaxed text-[#D7E2EA] opacity-60 md:mb-4"
          style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)' }}
        >
          {project.blurb}
        </p>

        <ul className="mb-3 flex flex-wrap gap-1.5 md:mb-5 md:gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[#D7E2EA]/25 px-3 py-1 text-[0.65rem]
                font-light uppercase tracking-widest text-[#D7E2EA]/70 sm:text-xs"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Three things, in the order someone asks about a project: whose it
            is, what it looks like on a desktop, what it looks like on a phone.
            The mark goes on a landscape plate because most of these logos are
            wordmarks — dropped into a square they shrink to fit the width and
            float in a field of white. */}
        {/* The clamp floors are what a phone actually gets: 32vw and 16vw only
            start applying around the 700px mark. They move together so the
            narrow column keeps its proportion against the desktop tile. */}
        <div className="flex gap-2 md:gap-3" style={{ height: 'clamp(172px, 32vw, 430px)' }}>
          <div
            className="flex shrink-0 flex-col gap-2 md:gap-3"
            style={{ width: 'clamp(88px, 16vw, 228px)' }}
          >
            <LogoPlate image={project.images.logo} name={project.name} />
            <PhoneFrame
              image={project.images.phone}
              alt={`${project.name} on mobile`}
              className="min-h-0 flex-1"
            />
          </div>

          <BrowserFrame
            image={project.images.wide}
            alt={`${project.name} homepage on desktop`}
            href={project.href}
            className="min-h-0 flex-1"
          />
        </div>
      </motion.article>
    </div>
  );
}

/**
 * The client's mark on a white plate.
 *
 * White rather than the page's own #0C0C0C for the same reason the marquee
 * tiles are: several of these marks are dark navy or dark-on-light, and on the
 * page ground they'd disappear. `contain` because a logo is fitted, never
 * cropped — the plate is 2:1 and the source is square, so there is always
 * margin left over.
 */
function LogoPlate({ image, name }: { image?: ProjectImage; name: string }) {
  return (
    <div
      className="flex aspect-[2/1] w-full shrink-0 items-center justify-center overflow-hidden
        rounded-[14px] bg-white sm:rounded-[20px] md:rounded-[24px]"
    >
      {image ? (
        // No padding here: make-logos.mjs already bakes a 12% margin into every
        // tile, and the plate is white for the same reason the tile is — so the
        // two grounds meet without a seam.
        <img
          src={image.src}
          srcSet={srcSetFor(image.src)}
          sizes={SIZES.cardLogo}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
          style={{ objectPosition: image.objectPosition }}
        />
      ) : (
        // No mark supplied yet — set the name instead, so the plate still reads
        // as a brand rather than as a tile that failed to load.
        <span className="truncate px-2 text-center text-[0.6rem] font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:text-sm md:text-base">
          {name}
        </span>
      )}
    </div>
  );
}

/** The phone capture, in a bezel so it reads as a device rather than a crop. */
function PhoneFrame({
  image,
  alt,
  className = '',
}: {
  image: ProjectImage;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[16px] bg-[#D7E2EA]/10 p-[3px] ring-1 ring-inset ring-[#D7E2EA]/25
        sm:rounded-[24px] sm:p-1 md:rounded-[30px] ${className}`}
    >
      <div className="h-full w-full overflow-hidden rounded-[13px] bg-white/5 sm:rounded-[20px] md:rounded-[26px]">
        <img
          src={image.src}
          srcSet={srcSetFor(image.src)}
          sizes={SIZES.cardPhone}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: image.objectPosition }}
        />
      </div>
    </div>
  );
}

/**
 * The desktop capture, under a browser bar.
 *
 * Every one of these shots is a homepage cropped somewhere down its length,
 * and a bare crop looks like a mistake. Put a window around it and the same
 * crop reads as a browser scrolled part-way down a page, which is what it is.
 */
function BrowserFrame({
  image,
  alt,
  href,
  className = '',
}: {
  image: ProjectImage;
  alt: string;
  /** Shown in the address pill. Omitted for work that isn't publicly live. */
  href?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[16px] bg-[#D7E2EA]/10 ring-1 ring-inset
        ring-[#D7E2EA]/25 sm:rounded-[24px] md:rounded-[30px] ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2 px-2.5 py-1.5 sm:gap-3 sm:px-4 sm:py-2.5">
        <span className="flex shrink-0 gap-1 sm:gap-1.5" aria-hidden="true">
          <Dot />
          <Dot />
          <Dot />
        </span>
        {href && (
          <span
            className="min-w-0 truncate rounded-full bg-[#0C0C0C]/40 px-2 py-0.5 text-[0.5rem]
              font-light lowercase tracking-wide text-[#D7E2EA]/60 sm:px-3 sm:text-[0.7rem]"
          >
            {hostOf(href)}
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <img
          src={image.src}
          srcSet={srcSetFor(image.src)}
          sizes={SIZES.cardWide}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: image.objectPosition }}
        />
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-[#D7E2EA]/30 sm:h-1.5 sm:w-1.5" />;
}

/** `https://www.speaklabbyshayan.com/` → `speaklabbyshayan.com`. */
function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}
