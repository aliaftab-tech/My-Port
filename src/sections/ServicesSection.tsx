import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { SERVICES } from '../data/services';

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24
        md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn
        as="h2"
        y={40}
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C]
          sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Services
      </FadeIn>

      <ul className="mx-auto max-w-5xl">
        {SERVICES.map((service, i) => (
          <FadeIn
            as="li"
            key={service.number}
            delay={i * 0.1}
            y={30}
            style={{
              borderTop: '1px solid rgba(12, 12, 12, 0.15)',
              ...(i === SERVICES.length - 1
                ? { borderBottom: '1px solid rgba(12, 12, 12, 0.15)' }
                : {}),
            }}
          >
            {/* The whole row is the link — each service has its own page now,
                and a row you can only half-click reads as broken. */}
            <Link
              to={`/services/${service.slug}`}
              className="group flex flex-col gap-3 py-8 transition-opacity duration-200
                hover:opacity-60 sm:flex-row sm:items-start sm:gap-8 sm:py-10 md:gap-12 md:py-12"
            >
              <span
                className="shrink-0 font-black leading-none text-[#0C0C0C]"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.number}
              </span>

              <div className="flex flex-col gap-2 pt-1 sm:pt-3">
                <h3
                  className="flex items-center gap-2 font-medium uppercase leading-tight text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                  <ArrowUpRight
                    className="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    size={22}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed text-[#0C0C0C] opacity-60"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
