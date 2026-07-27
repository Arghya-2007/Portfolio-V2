'use client';

import { ElementType, useRef } from 'react';
import { gsap } from 'gsap';
import GlassCard from '@/components/ui/GlassCard';
import { useScrollAnimation } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  delay?: number;
}

export default function StatCard({ label, value, icon: Icon, delay = 0 }: StatCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const motionPreference = useMotionPreference();
  const isNumeric = typeof value === 'number';

  useScrollAnimation(containerRef, (ctx, el) => {
    if (motionPreference !== 'full') {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const localTl = gsap.timeline();

    // Fade + Rise-in + 3D flip entrance
    localTl.fromTo(
      el,
      { opacity: 0, y: 20, rotateX: -15, transformPerspective: 1000 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' }
    );

    // Icon scale/rotate entrance
    if (iconRef.current) {
      localTl.fromTo(
        iconRef.current,
        { scale: 0, rotation: -45, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
        '-=0.5'
      );
    }

    // Number count up
    if (isNumeric && numberRef.current) {
      localTl.fromTo(
        numberRef.current,
        { innerText: 0 },
        {
          innerText: value,
          duration: 1.5,
          ease: 'power3.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            if (numberRef.current) {
              numberRef.current.innerText = Math.ceil(Number(this.targets()[0].innerText)).toString();
            }
          }
        },
        '-=0.5'
      );
    }

    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
      delay: 0.6 + delay // tlOffset + delay
    }).add(localTl);
  });

  const handleMouseEnter = () => {
    if (motionPreference !== 'full') return;
    
    // Quick snappy lift & scale
    gsap.to(containerRef.current, { y: -4, scale: 1.03, duration: 0.25, ease: 'power2.out' });
    
    // Glowing border + shadow fade in
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      // Animate the gradient angle continuously while hovering
      // Note: animating CSS custom properties requires CSS.registerProperty, which isn't globally reliable yet,
      // so we use a proxy object to tween the variable.
      gsap.fromTo(
        glowRef.current, 
        { '--gradient-angle': '0deg' },
        { 
          '--gradient-angle': '360deg', 
          duration: 2, 
          repeat: -1, 
          ease: 'none',
          overwrite: 'auto'
        }
      );
    }

    // Icon micro-bounce
    if (iconRef.current) {
      const iconTl = gsap.timeline();
      iconTl.to(iconRef.current, { scale: 1.1, rotation: 15, duration: 0.15, ease: 'power2.out' })
            .to(iconRef.current, { scale: 1, rotation: 0, duration: 0.25, ease: 'back.out(2)' });
    }

    // Number pulse
    if (numberRef.current) {
      const numTl = gsap.timeline();
      numTl.to(numberRef.current, { scale: 1.08, duration: 0.15, ease: 'power2.out' })
           .to(numberRef.current, { scale: 1, duration: 0.2, ease: 'power2.inOut' });
    }
  };

  const handleMouseLeave = () => {
    if (motionPreference !== 'full') return;
    
    gsap.to(containerRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
    
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut', overwrite: 'auto' });
    }
  };

  return (
    <GlassCard 
      ref={containerRef}
      as="div" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col p-5 transition-colors duration-300 ${motionPreference !== 'full' ? 'hover:border-white/20 hover:shadow-glow-primary/10' : 'opacity-0 cursor-default'}`}
    >
      {/* Animated Glowing Border (CSS variables updated by GSAP) */}
      <div 
        ref={glowRef}
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0"
        style={{
          // @ts-expect-error: Custom CSS property for gradient animation
          '--gradient-angle': '0deg',
          padding: '1.5px',
          background: 'linear-gradient(var(--gradient-angle), var(--accent-400), var(--primary-500), var(--accent-400))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          boxShadow: 'inset 0 0 20px rgba(45, 212, 191, 0.1)'
        }}
      />

      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div ref={iconRef} className="text-primary-500 transform-gpu">
          <Icon size={18} aria-hidden="true" />
        </div>
        <dt className="font-mono text-xs text-text-muted uppercase tracking-widest">
          {label}
        </dt>
      </div>
      <dd className="font-body text-xl text-text-primary font-semibold tracking-tight mt-1 relative z-10">
        <span ref={numberRef} className="inline-block transform-gpu origin-left">{value}</span>
      </dd>
    </GlassCard>
  );
}
