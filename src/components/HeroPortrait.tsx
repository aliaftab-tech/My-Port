import { useState } from 'react';
import Magnet from './Magnet';
import FadeIn from './FadeIn';
import { PROFILE } from '../data/profile';

const SPHERE_GRADIENT =
  'radial-gradient(circle at 32% 28%, #C86BFF 0%, #B600A8 26%, #7621B0 52%, #3A0B52 74%, #14031C 100%)';

const GLOW_GRADIENT =
  'radial-gradient(circle, rgba(182,0,168,0.32) 0%, rgba(118,33,176,0.16) 45%, transparent 70%)';

/**
 * The hero centrepiece. Renders the avatar at PROFILE.avatar if that file
 * exists, and falls back to a gradient sphere if it doesn't — so the page
 * looks finished before the avatar is dropped in, and switches over the
 * moment it lands in /public with no code change.
 */
export default function HeroPortrait() {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showAvatar = Boolean(PROFILE.avatar) && !avatarFailed;

  return (
    // Positioning lives on this wrapper, not on Magnet: Magnet writes an inline
    // `transform` for the cursor follow, which would overwrite any Tailwind
    // translate utility set on the same element.
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[250px] -translate-x-1/2
        -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[330px] sm:translate-y-0 md:w-[410px]
        lg:w-[470px]"
    >
      <Magnet
        padding={150}
        strength={3}
        activeTransition="transform 0.3s ease-out"
        inactiveTransition="transform 0.6s ease-in-out"
      >
        <FadeIn delay={0.6} y={30} duration={1.1}>
          <div className="relative">
            {/* Sits behind the head so the figure reads as lit by the page
                rather than cut out and dropped onto it. */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[32%] h-[80%] w-[85%] -translate-x-1/2
                -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: GLOW_GRADIENT }}
            />

            {showAvatar ? (
              <img
                src={PROFILE.avatar}
                alt={`${PROFILE.firstName}, ${PROFILE.role}`}
                width={441}
                height={446}
                className="relative h-auto w-full select-none"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <div
                aria-hidden="true"
                className="relative aspect-square w-full rounded-full blur-[6px]"
                style={{
                  background: SPHERE_GRADIENT,
                  boxShadow:
                    'inset -30px -40px 90px rgba(0,0,0,0.65), inset 20px 20px 60px rgba(255,255,255,0.10)',
                }}
              />
            )}
          </div>
        </FadeIn>
      </Magnet>
    </div>
  );
}
