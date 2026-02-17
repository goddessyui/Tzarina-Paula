
import { PortfolioItem } from '../types';

// Visual Ordering Strategy (via Dates):
// 1. Tech/Branding (Clean, White, Blue) -> Most Recent
// 2. Warm/Food (Orange, Yellow)
// 3. Character/Pop (Pink, Red, Mixed)
// 4. Nature/Scenery (Green, Blue, White)
// 5. Magical/Dark (Purple, Dark Blue) -> Oldest

export const SEED_PORTFOLIO_ITEMS: PortfolioItem[] = [
  // --- TECH / BRANDING ---
  {
    id: 'seed-iso-city',
    title: 'Isometric Metropolis',
    description: 'A motion study in isometric perspective and bustling city life.',
    mediaType: 'video_file',
    url: 'https://res.cloudinary.com/df40kvhb7/video/upload/v1771257881/isometriccity_wmbgxa.mp4',
    category: 'motion_graphics_animation',
    createdAt: '2024-02-05T00:00:00Z',
    dateCreated: '2024-02-05',
    tags: ['3D', 'Isometric', 'Loop'],
    isFeatured: true,
    featuredOrder: 1
  },
  {
    id: 'seed-logo-white',
    title: 'Tzarina Identity',
    description: 'Personal branding exploration on clean whitespace.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257634/tzarinalogowhitebackground_snvejc.png',
    category: 'graphic_design',
    createdAt: '2024-02-04T00:00:00Z',
    dateCreated: '2024-02-04',
    tags: ['Branding', 'Logo', 'Minimalist']
  },
  {
    id: 'seed-silva',
    title: 'Silva Vector',
    description: 'Scalable vector illustration with sharp linework.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257634/Silva_Vector_Image_PNG_kmjtxy.png',
    category: 'graphic_design',
    createdAt: '2024-02-03T00:00:00Z',
    dateCreated: '2024-02-03',
    tags: ['Vector', 'Character Design']
  },

  // --- WARM / COZY / FOOD ---
  {
    id: 'seed-orange-juice',
    title: 'Morning Squeeze',
    description: 'Liquid simulation and motion graphics test for beverage advertising.',
    mediaType: 'video_file',
    url: 'https://res.cloudinary.com/df40kvhb7/video/upload/v1771257881/Orangejuice_qh5s8o.mp4',
    category: 'motion_graphics_animation',
    createdAt: '2024-02-02T00:00:00Z',
    dateCreated: '2024-02-02',
    tags: ['Simulation', 'Advertising', 'Liquid']
  },
  {
    id: 'seed-siomai',
    title: 'The Final Siomai',
    description: 'A dramatic 3D render of a beloved snack.',
    mediaType: 'video_file',
    url: 'https://res.cloudinary.com/df40kvhb7/video/upload/v1771257881/Finalsiomai_zqkoor.mp4',
    category: 'motion_graphics_animation',
    createdAt: '2024-02-01T00:00:00Z',
    dateCreated: '2024-02-01',
    tags: ['3D', 'Food', 'Humor']
  },
  {
    id: 'seed-fan-fort',
    title: 'Electric Fan Fort',
    description: 'Digital painting capturing the whimsy of indoor childhood forts.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257632/electricfanfort_aaicus.png',
    category: 'illustration',
    createdAt: '2024-01-30T00:00:00Z',
    dateCreated: '2024-01-30',
    tags: ['Environment', 'Cozy', 'Digital Painting']
  },

  // --- CHARACTER / POP ---
  {
    id: 'seed-wink',
    title: 'Character Expression: Wink',
    description: 'Frame-by-frame facial animation study.',
    mediaType: 'video_file',
    url: 'https://res.cloudinary.com/df40kvhb7/video/upload/v1771257882/Wink_lvtih5.mp4',
    category: 'motion_graphics_animation',
    createdAt: '2024-01-28T00:00:00Z',
    dateCreated: '2024-01-28',
    tags: ['2D Animation', 'Character', 'Expression']
  },
  {
    id: 'seed-hutao',
    title: 'Hu Tao (Genshin Impact)',
    description: 'Fan illustration focusing on lighting and character personality.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257632/hutao07252023_v2_bzpktx.png',
    category: 'illustration',
    createdAt: '2024-01-27T00:00:00Z',
    dateCreated: '2024-01-27',
    tags: ['Fan Art', 'Character', 'Anime Style']
  },
  {
    id: 'seed-cats',
    title: 'Feline Friends',
    description: 'Stylized character sheet of various cats.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257632/cats_neuxlh.png',
    category: 'illustration',
    createdAt: '2024-01-26T00:00:00Z',
    dateCreated: '2024-01-26',
    tags: ['Animals', 'Sketch', 'Cute']
  },
  {
    id: 'seed-cat-gentleman',
    title: 'The Cat Gentleman',
    description: 'A distinguished portrait of a sophisticated feline.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257633/catgentleman_emnftu.png',
    category: 'illustration',
    createdAt: '2024-01-25T00:00:00Z',
    dateCreated: '2024-01-25',
    tags: ['Character Design', 'Animals', 'Suit']
  },
  {
    id: 'seed-jan10',
    title: 'Ethereal Study',
    description: 'Soft lighting and color study.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257634/jan10_ewlaa4.png',
    category: 'illustration',
    createdAt: '2024-01-24T00:00:00Z',
    dateCreated: '2024-01-24',
    tags: ['Study', 'Color', 'Portrait']
  },
  {
    id: 'seed-0204',
    title: 'Character Draft',
    description: 'Concept art and line work exploration.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257632/0204_bxv65e.png',
    category: 'illustration',
    createdAt: '2024-01-23T00:00:00Z',
    dateCreated: '2024-01-23',
    tags: ['Sketch', 'Concept']
  },

  // --- NATURE / SCENERY ---
  {
    id: 'seed-walking-girl',
    title: 'The Journey',
    description: 'Atmospheric loop of a character traversing a landscape.',
    mediaType: 'video_file',
    url: 'https://res.cloudinary.com/df40kvhb7/video/upload/v1771257881/Scenerywithwalkinggirl_kp5ao0.mp4',
    category: 'motion_graphics_animation',
    createdAt: '2024-01-20T00:00:00Z',
    dateCreated: '2024-01-20',
    tags: ['Loop', 'Atmosphere', 'Scenery']
  },
  {
    id: 'seed-forest',
    title: 'My Cool Forest',
    description: 'Environmental design focusing on foliage and depth.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257633/mycoolforest_kbomhw.jpg',
    category: 'illustration',
    createdAt: '2024-01-18T00:00:00Z',
    dateCreated: '2024-01-18',
    tags: ['Environment', 'Nature', 'Forest']
  },
  {
    id: 'seed-lake',
    title: 'Serene Lake',
    description: 'Water reflection and landscape study.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257633/lake_zyp9zi.png',
    category: 'illustration',
    createdAt: '2024-01-17T00:00:00Z',
    dateCreated: '2024-01-17',
    tags: ['Landscape', 'Water', 'Peaceful']
  },
  {
    id: 'seed-snowy-hill',
    title: 'Winter Refuge',
    description: 'A solitary house on a snowy hill, exploring white balance and cold tones.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257632/house_in_a_snowy_hill_i7jwqh.png',
    category: 'illustration',
    createdAt: '2024-01-15T00:00:00Z',
    dateCreated: '2024-01-15',
    tags: ['Winter', 'Environment', 'Snow']
  },

  // --- MAGICAL / DARK ---
  {
    id: 'seed-magical-night',
    title: 'Magical Night',
    description: 'Particle effects and lighting animation for a fantasy setting.',
    mediaType: 'video_file',
    url: 'https://res.cloudinary.com/df40kvhb7/video/upload/v1771257881/Magicalnight_onl2m4.mp4',
    category: 'motion_graphics_animation',
    createdAt: '2024-01-10T00:00:00Z',
    dateCreated: '2024-01-10',
    tags: ['Fantasy', 'Particles', 'Night']
  },
  {
    id: 'seed-floating-island',
    title: 'Floating Sanctuary',
    description: 'Concept art for a magical island suspended in the sky.',
    mediaType: 'image',
    url: 'https://res.cloudinary.com/df40kvhb7/image/upload/v1771257633/magic_floating_island_fcxici.png',
    category: 'illustration',
    createdAt: '2024-01-08T00:00:00Z',
    dateCreated: '2024-01-08',
    tags: ['Fantasy', 'Concept Art', 'Magic']
  },
  {
    id: 'seed-practice-anim',
    title: 'Motion Sketch 0820',
    description: 'Rough animation practice focusing on timing and spacing.',
    mediaType: 'video_file',
    url: 'https://res.cloudinary.com/df40kvhb7/video/upload/v1771257882/practiceanimation08202023_hwm59l.mp4',
    category: 'motion_graphics_animation',
    createdAt: '2024-01-05T00:00:00Z',
    dateCreated: '2024-01-05',
    tags: ['Practice', 'Sketch', 'Rough']
  }
];
