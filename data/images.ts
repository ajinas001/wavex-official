/**
 * Central Image Registry for WaveX
 * 
 * All assets in this file use local high-performance static images 
 * located in the /public directory.
 * 
 * Usage breakdown by component:
 * -----------------------------------------------------------------------------
 * SECTION / COMPONENT   | KEYS USED                   | PURPOSE
 * -----------------------------------------------------------------------------
 * Welcome               | welcomeBg, stone, hovers    | Main hero veil & stone texture
 * Places (PlacesGrid)   | PLACES (place1..place7)     | 3D stack & grid cards
 * PlacesAfter           | map, ship, stone2           | Interactive map & details
 * Objects               | welcomeBg, map, object2, object4 | Service showcase cards
 * Connection            | connection, guy1            | Contact & team window
 * Updates               | updates[0..4]               | Journal / news stream
 * People                | peopleWall, guy1, guy2      | Team gallery grid
 * Admission             | admission1, 2, 3            | Membership / request modal
 * Footer                | footerStone                 | Bottom stone watermark
 * -----------------------------------------------------------------------------
 */

export const IMG = {
  // --- Welcome / Hero Section ---
  /** Main arched background veil image (w-bg.jpg) */
  welcomeBg: "/images/home/w-bg.jpg",
  /** Primary central stone texture */
  stone: "/images/home/stone.webp",
  /** Primary hover overlay texture 1 */
  stoneHover1: "/images/home/hover-1.webp",
  /** Primary hover overlay texture 2 */
  stoneHover2: "/images/home/hover-2.webp",

  // --- Places Section (Architecture & Spaces Showcase) ---
  /** Cover title card graphic */
  placesTitle: "/hero.webp",
  /** Place 1: Silent Room */
  place1: "/images/home/figure-map.webp",
  /** Place 2: The Underscore */
  place2: "/images/offices/6.webp",
  /** Place 3: Halcyon Hall */
  place3: "/images/offices/7.webp",
  /** Place 4: North Window */
  place4: "/images/home/stone-wall.webp",
  /** Place 5: Foundry */
  place5: "/images/home/w-bg.jpg",
  /** Place 6: Slow House */
  place6: "/images/home/stone.webp",
  /** Place 7: The Long Gallery */
  place7: "/images/home/stone-2.webp",

  // --- Places Details & Maps ---
  /** Topographic map illustration */
  map: "/images/home/figure-map.webp",
  /** Decorative vessel icon */
  ship: "/images/home/ship.webp",
  /** Secondary stone texture */
  stone2: "/images/home/stone-2.webp",

  // --- Objects / Services Section ---
  /** Background wall texture for objects */
  objectsBg: "/images/home/stone-wall.webp",
  /** Object 1: Brand & Art Direction */
  object1: "/images/home/stone.webp",
  /** Object 2: Web Design & Development */
  object2: "/images/home/stone-2.webp",
  /** Object 3: Interactive & 3D */
  object3: "/images/offices/6.webp",
  /** Object 4: Product Strategy */
  object4: "/images/offices/7.webp",

  // --- Connection / Contact Section ---
  /** Background architectural view */
  connection: "/images/home/w-bg.jpg",
  /** Maker portrait 1 */
  guy1: "/images/offices/6.webp",
  /** Maker portrait 2 */
  guy2: "/images/offices/7.webp",

  // --- Updates / Journal Feed ---
  updates: [
    "/images/home/stone.webp",
    "/images/home/stone-2.webp",
    "/images/offices/6.webp",
    "/images/offices/7.webp",
    "/images/home/stone-wall.webp",
  ],

  // --- People / Assembly Gallery ---
  /** Textured stone wall background */
  peopleWall: "/images/home/stone-wall.webp",
  /** Silhouette detail overlay */
  peopleSilhouette: "/images/home/stone.webp",

  // --- Admission Modal & Cards ---
  admission1: "/images/offices/6.webp",
  admission2: "/images/offices/7.webp",
  admission3: "/images/home/stone-2.webp",

  // --- Footer Section ---
  /** Footer watermark stone texture */
  footerStone: "/images/home/stone.webp",
} as const;

/** Array of 7 place images passed to Places, PlacesBento, and PlacesGrid components */
export const PLACES: string[] = [
  IMG.place1,
  IMG.place2,
  IMG.place3,
  IMG.place4,
  IMG.place5,
  IMG.place6,
  IMG.place7,
];

/** Corresponding names for each place item in PLACES */
export const PLACE_NAMES: string[] = [
  "Silent Room",
  "The Underscore",
  "Halcyon Hall",
  "North Window",
  "Foundry",
  "Slow House",
  "The Long Gallery",
];
