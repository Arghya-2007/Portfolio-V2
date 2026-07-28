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
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative h-full rounded-[20px] group ${motionPreference !== 'full' ? 'hover:shadow-glow-primary/10' : 'opacity-0 cursor-default'}`}
    >
      {/* Google Brand Conic Gradient Hover Shadow */}
      <div 
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none"
        style={{ 
          padding: '10px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          filter: 'blur(20px)' 
        }}
      >
        <div 
          className="absolute inset-[-100%] motion-safe:animate-spin"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #4285F4 0deg, #EA4335 90deg, #FBBC05 180deg, #34A853 270deg, #4285F4 360deg)',
            animationDuration: '4s'
          }}
        />
      </div>

      <GlassCard 
        as="div" 
        className="relative flex flex-col h-full overflow-hidden transition-shadow duration-500 z-10 p-5"
      >
        {/* Google Brand Conic Gradient Hover Border Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-20 rounded-[20px]" 
          style={{
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        >
          <div 
            className="absolute inset-[-100%] motion-safe:animate-spin"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, #4285F4 0deg, #EA4335 90deg, #FBBC05 180deg, #34A853 270deg, #4285F4 360deg)',
              animationDuration: '4s'
            }}
          />
        </div>

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
    </div>
  );
}
