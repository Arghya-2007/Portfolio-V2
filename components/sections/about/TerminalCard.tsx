'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { profile } from '@/data/profile';
import GlassCard from '@/components/ui/GlassCard';
import { useScrollAnimation } from '@/lib/gsap/useScrollAnimation';
import { useMotionPreference } from '@/lib/hooks/useReducedMotion';
import { splitText, revertSplit } from '@/lib/gsap/splitText';

export default function TerminalCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const motionPreference = useMotionPreference();

  useScrollAnimation(containerRef, (ctx, el) => {
    if (motionPreference !== 'full') {
      gsap.set(el, { opacity: 1, scale: 1 });
      return;
    }
    
    if (!textRef.current) return;

    const localTl = gsap.timeline();

    // Boot-up Entrance
    localTl.fromTo(
      el,
      { scale: 0.95, opacity: 0, boxShadow: '0 0 0px rgba(45, 212, 191, 0)' },
      { 
        scale: 1, 
        opacity: 1, 
        boxShadow: '0 0 30px rgba(45, 212, 191, 0.15)', 
        duration: 0.8, 
        ease: 'power3.out' 
      }
    );
    // Dim the glow after boot-up
    localTl.to(el, {
      boxShadow: '0 0 0px rgba(45, 212, 191, 0)',
      duration: 1,
      ease: 'power2.inOut',
    }, '-=0.2');

    // Split text into characters
    const { chars } = splitText(textRef.current, { type: 'character' });
    
    // Hide chars initially
    gsap.set(chars, { opacity: 0 });
    
    // Optional hook for sound: localTl.call(() => playBootSound(), [], 0)

    const typingTl = gsap.timeline();
    let currentTime = 0;

    chars.forEach((char) => {
      // Variable typing speed with random jitter
      const delay = 0.015 + Math.random() * 0.025;
      
      typingTl.to(char, { opacity: 1, duration: 0.01, ease: 'none' }, currentTime);
      currentTime += delay;

      // Check if this character is the last one in a line-commit block
      const commitBlock = char.closest('.line-commit');
      if (commitBlock) {
        const blockChars = commitBlock.querySelectorAll('.char-split');
        if (blockChars[blockChars.length - 1] === char) {
          // Add Line Commit Flash effect
          typingTl.fromTo(
            commitBlock,
            { color: 'var(--accent-400)', textShadow: '0 0 10px var(--accent-500)' },
            { color: '#A1A1AA', textShadow: '0 0 0px var(--accent-500)', duration: 0.4, ease: 'power2.out' },
            currentTime
          );
        }
      }
    });

    // Add typing animation to local timeline
    localTl.add(typingTl, '-=0.5'); // Start typing while booting up

    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
      delay: 0.3 // equivalent to tlOffset
    }).add(localTl);

    // Cleanup DOM modifications on revert
    ctx.add(() => {
      if (textRef.current) revertSplit(textRef.current);
    });
  });

  return (
    <GlassCard 
      ref={containerRef}
      as="div" 
      className={`relative flex flex-col h-full hover:shadow-glow-accent/10 transition-shadow duration-500 overflow-hidden group ${motionPreference !== 'full' ? '' : 'opacity-0 scale-95'}`}
    >
      {/* Subtle cyan inner glow/scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-500/[0.03] to-transparent pointer-events-none" />
      
      {/* Terminal Chrome */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 bg-black/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#E5502F]/60" />
          <div className="w-3 h-3 rounded-full bg-[#D4A373]/60" />
          <div className="w-3 h-3 rounded-full bg-[#4CAF50]/60" />
        </div>
        <div className="ml-auto flex items-center">
          <span className="font-mono text-xs text-text-muted">about.sh</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 sm:p-6 lg:p-8 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre">
        <div ref={textRef} className="text-text-secondary inline">
          <span className="text-accent-400 font-semibold">$</span> <span className="text-text-primary">cat whoami.json</span>
{`
{
  "role": [
`}
          {profile.whoAmI.role.map((r, i) => (
            <span key={i}>{`    "`}<span className="line-commit text-[#A1A1AA] transition-colors">{r}</span>{`"${i < profile.whoAmI.role.length - 1 ? ',' : ''}\n`}</span>
          ))}
{`  ],
  "building": [
`}
          {profile.whoAmI.building.map((b, i) => (
            <span key={i}>{`    "`}<span className="line-commit text-[#A1A1AA] transition-colors">{b}</span>{`"${i < profile.whoAmI.building.length - 1 ? ',' : ''}\n`}</span>
          ))}
{`  ],
  "learning": [
`}
          {profile.whoAmI.learning.map((l, i) => (
            <span key={i}>{`    "`}<span className="line-commit text-[#A1A1AA] transition-colors">{l}</span>{`"${i < profile.whoAmI.learning.length - 1 ? ',' : ''}\n`}</span>
          ))}
{`  ],
  "goalBy2027": "`}<span className="line-commit text-[#A1A1AA] transition-colors">{profile.whoAmI.goalBy2027}</span>{`"
}`}
        </div>
        {/* Blinking Cursor */}
        <span 
          ref={cursorRef} 
          className={`inline-block w-2.5 h-4 bg-accent-500 translate-y-1 ml-1 ${motionPreference === 'full' ? 'animate-[pulse_1s_ease-in-out_infinite]' : 'opacity-50'}`} 
        />
      </div>
    </GlassCard>
  );
}
