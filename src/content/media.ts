/**
 * Everything shown on the Media page. Add, remove or reorder entries here and
 * the page updates; nothing else needs to change.
 */
import type { StaticImageData } from "next/image";
import heroStill from "@/assets/hero-poster.jpg";
import skyline from "@/assets/hero.webp";
import salesLeasing from "@/assets/services/sales-leasing.webp";
import offPlan from "@/assets/services/off-plan.webp";
import investment from "@/assets/services/investment.webp";
import representation from "@/assets/services/representation.webp";

export type Interview = {
  /** The id from the YouTube link: youtube.com/watch?v=THIS_PART */
  youtubeId?: string;
  title: string;
  outlet: string;
  date?: string;
};

export type Reel = {
  /** A portrait (9:16) MP4 placed in public/media/reels/ */
  src?: string;
  /** Optional still shown before the reel plays */
  poster?: string;
  title: string;
};

export type Photo = {
  /** Import the image at the top of this file */
  src: StaticImageData;
  alt: string;
  caption?: string;
  /** How much room the photo takes in the grid */
  span?: "tall" | "wide" | "large";
};

// Interviews: add a youtubeId from the link (youtu.be/THIS_PART). Entries
// without one show as "Coming soon".
export const interviews: Interview[] = [
  {
    youtubeId: "gQOnugPXi-Y",
    title: "Mangalore to Dubai: From Metro Rides to Multiple Ventures ft. Godwin D’Souza",
    outlet: "MacToc Podcast · EP 07",
    date: "Oct 2026",
  },
  {
    youtubeId: "2jtHzbV3yps",
    title: "Why Dubai Is Creating a New Generation of Millionaires ft. Godwin",
    outlet: "The SunKissed Pod",
    date: "Oct 2026",
  },
];

// Entries without a src show as "Coming soon".
export const reels: Reel[] = [
  {
    src: "/media/reels/dubai-meets-mangalore.mp4",
    poster: "/media/reels/dubai-meets-mangalore.jpg",
    title: "Dubai meets Mangalore",
  },
  {
    src: "/media/reels/sea-view-31-lakhs.mp4",
    poster: "/media/reels/sea-view-31-lakhs.jpg",
    title: "₹31 Lakhs with a sea view",
  },
  {
    src: "/media/reels/sheikh-zayed-road.mp4",
    poster: "/media/reels/sheikh-zayed-road.jpg",
    title: "Stay on Sheikh Zayed Road",
  },
  {
    src: "/media/reels/top-5-reasons.mp4",
    poster: "/media/reels/top-5-reasons.jpg",
    title: "Top 5 reasons to invest in Dubai",
  },
  {
    src: "/media/reels/luxury-3br-aed-8k.mp4",
    poster: "/media/reels/luxury-3br-aed-8k.jpg",
    title: "A luxury 3BR for AED 8K a month",
  },
  {
    src: "/media/reels/broker-can-relate.mp4",
    poster: "/media/reels/broker-can-relate.jpg",
    title: "Every Dubai broker can relate",
  },
];

// TODO: replace with your own event and project photos.
export const photos: Photo[] = [
  { src: heroStill, alt: "Dubai skyline at sunset", caption: "Dubai at golden hour", span: "large" },
  { src: salesLeasing, alt: "Contemporary villa with pool", caption: "Signature residences", span: "tall" },
  { src: offPlan, alt: "Dubai Marina towers", caption: "Dubai Marina" },
  { src: investment, alt: "Market data on a tablet", caption: "Market insight" },
  { src: representation, alt: "Client meeting", caption: "Client advisory", span: "wide" },
  { src: skyline, alt: "Dubai skyline in the evening", caption: "Sheikh Zayed Road", span: "wide" },
];
