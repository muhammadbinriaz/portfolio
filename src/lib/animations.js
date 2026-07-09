// Central GSAP / ScrollTrigger / Lenis setup.
// Bundled (instead of CDN globals) so behaviour is identical and there is no
// network/Tracking-Prevention fragility.
// NOTE: LocomotiveScroll was removed — every page now shares one lightweight
// Lenis instance (see useSmoothScroll) which is smoother and drops the throttly
// custom scrollbar.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger, Lenis };
