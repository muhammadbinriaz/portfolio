// Central GSAP / ScrollTrigger / Lenis / Locomotive setup.
// Bundled (instead of CDN globals) so behaviour is identical and there is no
// network/Tracking-Prevention fragility.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger, Lenis, LocomotiveScroll };
