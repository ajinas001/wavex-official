export interface Service {
  index: string;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    index: "01",
    title: "Brand & Art Direction",
    description:
      "Visual systems, typography and motion identity built to hold a studio's point of view across every surface.",
  },
  {
    index: "02",
    title: "Web Design & Development",
    description:
      "Handcrafted, high-performance sites — from first sketch to production code, tuned for feel as much as function.",
  },
  {
    index: "03",
    title: "Interactive & 3D",
    description:
      "WebGL, generative motion and spatial interfaces for moments that ask to be remembered, not just viewed.",
  },
  {
    index: "04",
    title: "Product Strategy",
    description:
      "Positioning and structure work that happens before a single pixel — so the design has something true to say.",
  },
];
