import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { TextPlugin } from 'gsap/dist/TextPlugin';

let registered = false;

export function registerGSAP() {
  if (typeof window === 'undefined') return;
  if (registered) return;
  
  console.log("Registering GSAP Plugins. ScrollTrigger exists:", !!ScrollTrigger);
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
  registered = true;
}
