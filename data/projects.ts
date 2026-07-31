export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: "aeon",
    index: "01",
    title: "Aeon Capital",
    category: "Brand & Web Platform",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "ferra",
    index: "02",
    title: "Ferra Studio",
    category: "E-Commerce Experience",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "nomen",
    index: "03",
    title: "Nomen Atelier",
    category: "Editorial Site",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "vault",
    index: "04",
    title: "The Vault",
    category: "Interactive Showcase",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "arclight",
    index: "05",
    title: "Arclight",
    category: "Product Launch",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2000&auto=format&fit=crop",
  },
];
