'use client';

// components/sections/Contact.tsx
// Phase 4 — Client Component. GSAP scroll reveal + Lenis parallax added.
// Background: bg-6.jpg (cool tone, alternates from Timeline warm).
// Form wrapped in GlassCard — glass input fields with consistent border treatment.
// Submit button → GlassButton primary (disabled state preserved per Phase 7 note).
// Social links → GlassButton secondary (small).

import { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { profile } from '@/data/profile';
import GlassCard from '@/components/ui/GlassCard';
import GlassButton from '@/components/ui/GlassButton';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import SectionHeading from '@/components/ui/SectionHeading';
import { useScrollAnimation, useReducedScrollReveal } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

/* Shared class string for glass input / textarea fields */
const INPUT_BASE = [
  'w-full',
  'font-body text-sm text-text-primary',
  /* Frosted input background — lighter than GlassCard */
  'bg-white/5 border border-white/15 rounded-xl',
  'px-4 py-2.5',
  'placeholder:text-text-muted',
  /* Focus ring */
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500/60',
  'transition-all duration-250',
].join(' ');

const LABEL_BASE =
  'font-mono text-xs text-text-muted uppercase tracking-widest mb-1.5 block';

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const motionPreference = useMotionPreference();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  useScrollAnimation(containerRef, (ctx, el) => {
    // Reveal section heading
    gsap.fromTo(
      '.contact-heading-reveal',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );

    // Stagger reveal contact methods
    gsap.fromTo(
      '.contact-card-reveal',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 85%',
        }
      }
    );

    // Fade in footer
    gsap.fromTo(
      '.footer-reveal',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer-reveal',
          start: 'top 95%',
        }
      }
    );

    // Parallax background (desktop only)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.to('[data-parallax-bg]', {
        y: '-15%',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        }
      });
    });
  });

  useReducedScrollReveal(containerRef);
  const fallbackRevealClass = motionPreference !== 'full' ? 'reveal-hidden' : '';

  return (
    <section
      ref={containerRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden"
    >
      {/* Background image — cool tone */}
      <Image
        src="/images/bg/bg-6.webp"
        alt=""
        aria-hidden="true"
        fill
        quality={75}
        className="object-cover object-center"
        sizes="100vw"
        data-parallax-bg
      />

      <div className="section-bg-overlay" aria-hidden="true" />

      <div className="section-content-layer section-py px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <div className={`contact-heading-reveal ${fallbackRevealClass}`}>
            <SectionHeading
              number="05"
              label="Contact"
              heading="Let's build something."
              subheading={profile.status}
              id="contact-heading"
            />
          </div>

          <div className="contact-grid grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact form — wrapped in GlassCard frosted panel */}
            <GlassCard as="div" className={`contact-card-reveal ${fallbackRevealClass}`}>
              <form
                aria-label="Contact form"
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
              >
                {/* Honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="bot-field">Don&apos;t fill this out if you&apos;re human:</label>
                  <input id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" />
                </div>
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="contact-name" className={LABEL_BASE}>
                    Name <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={INPUT_BASE}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="contact-email" className={LABEL_BASE}>
                    Email <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    className={INPUT_BASE}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label htmlFor="contact-message" className={LABEL_BASE}>
                    Message <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="What are you building?"
                    className={`${INPUT_BASE} resize-vertical min-h-[120px]`}
                  />
                </div>

                <div className="pt-1 flex flex-col gap-4">
                  <GlassButton
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={status === 'submitting' || status === 'success'}
                    aria-disabled={status === 'submitting' || status === 'success'}
                    className={status === 'submitting' || status === 'success' ? 'opacity-70 cursor-not-allowed' : ''}
                  >
                    {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
                  </GlassButton>

                  {/* Status Messages */}
                  {status === 'success' && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-body transition-all" role="status">
                      Message sent successfully! I&apos;ll get back to you soon.
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-body transition-all" role="alert">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </form>
            </GlassCard>

            {/* Socials / direct links column */}
            <div className={`contact-card-reveal flex flex-col gap-8 ${fallbackRevealClass}`}>
              {/* Email link — conditionally omitted if undefined */}
              {profile.email && (
                <div>
                  <p className={LABEL_BASE.replace('mb-1.5', 'mb-3')}>
                    Email directly
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-body text-sm text-accent-400 hover:text-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                    aria-label={`Send email to ${profile.email}`}
                  >
                    ✉ {profile.email}
                  </a>
                </div>
              )}

              {/* Social links */}
              <nav aria-label="Social media links">
                <p className={LABEL_BASE.replace('mb-1.5', 'mb-4')}>
                  Find me online
                </p>
                <ul className="flex flex-col gap-3 list-none m-0 p-0">
                  {profile.socials.map((social) => (
                    <li key={social.platform}>
                      <MagneticWrapper strength={10} className="w-full">
                        <GlassButton
                          href={social.url}
                          variant="secondary"
                          size="sm"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${profile.name} on ${social.platform} (opens in new tab)`}
                          className="w-full justify-between"
                        >
                          <span>{social.platform}</span>
                          <span aria-hidden="true" className="text-text-muted">↗</span>
                        </GlassButton>
                      </MagneticWrapper>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Availability note */}
              <GlassCard as="div" className="mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="block w-2 h-2 rounded-full bg-accent-400 animate-pulse shrink-0"
                    aria-hidden="true"
                  />
                  <p className="font-mono text-xs text-accent-400 uppercase tracking-widest">
                    Available for opportunities
                  </p>
                </div>
                <p className="font-body text-sm text-text-secondary leading-relaxed">
                  Open to full-time roles, internships, and interesting collaborations
                  in MLOps, AI Infra, and full-stack engineering.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — visually distinct but semantic part of the Contact section */}
      <footer className={`footer-reveal relative z-10 border-t border-white/10 mt-auto ${fallbackRevealClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-muted">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-text-muted">
            Crafted with precision. Built for speed.
          </p>
        </div>
      </footer>
    </section>
  );
}
