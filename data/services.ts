export interface Service {
  index: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    index: "01",
    title: "Web Design & UI/UX",
    description:
      "Pixel-perfect interfaces engineered for clarity and conversion — every screen purpose-built to drive results for your brand.",
  },
  {
    index: "02",
    title: "Web Development",
    description:
      "Blazing-fast, SEO-optimised websites and web apps built with Next.js, React and modern tooling — ready to scale from day one.",
  },
  {
    index: "03",
    title: "E-Commerce Solutions",
    description:
      "Custom storefronts on Shopify, WooCommerce or headless platforms — designed to sell, built to perform under pressure.",
  },
  {
    index: "04",
    title: "Digital Strategy",
    description:
      "End-to-end product thinking — from user research and IA to go-to-market roadmaps that give every feature a reason to exist.",
  },
];
