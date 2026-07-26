import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

let registered = false;

export function registerGSAP() {
  if (typeof window === 'undefined') return;
  if (registered) return;
  
  console.log("Registering GSAP Plugins. ScrollTrigger exists:", !!ScrollTrigger);
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}
