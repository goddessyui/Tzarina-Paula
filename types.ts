
export type MediaType = 'image' | 'video_youtube' | 'video_tiktok' | 'video_vimeo' | 'gallery_link' | 'video_file' | 'game_godot';

export type PortfolioCategory = 
  | 'illustration' 
  | 'motion_graphics_animation' 
  | 'graphic_design' 
  | 'video_editing' 
  | 'web_app_development';

export interface ReferenceItem {
  url: string;
  credit?: string;
}

export interface AssetCredit {
  name: string;
  author: string;
  url?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  mediaType: MediaType;
  url: string; 
  thumbnailUrl?: string; 
  category: PortfolioCategory;
  createdAt: string;
  width?: number; 
  height?: number;
  dateCreated?: string;
  references?: ReferenceItem[];
  assets?: AssetCredit[];
  tags?: string[];
  isFeatured?: boolean;
  featuredOrder?: number;
  metadata?: {
    tools?: string[];
    role?: string;
    client?: string;
  };
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export interface Voucher {
  id: string;
  code: string;
  is_used: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; 
  coverImage: string;
  tags: string[];
  geoTag?: string; 
  publishedAt: string;
}

export interface StoryConfig {
  title: string;
  synopsis: string;
  frontCoverUrl: string;
  backCoverUrl: string;
  animations: {
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
  }[];
}

export interface SiteConfig {
  general: {
    appName: string;
    logoUrl: string;
    tagline: string;
    availableForHire: boolean;
    availabilityStatus: 'open' | 'limited' | 'closed';
    availableSlots: number;
    totalSlots: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
    aiKnowledgeContext?: string; 
  };
  cloudinary: {
    cloudName: string;
    uploadPreset: string;
  };
  hero: {
    headlineWord1: string;
    headlineWord2: string;
    headlineWord3: string;
    backgroundImage: string; 
    backgroundType: 'image' | 'video';
    midgroundVideo?: string; 
    foregroundVideo?: string;
    mobileBackgroundImage?: string; 
    mobileBackgroundType?: 'image' | 'video';
  };
  bio: {
    headline: string;
    subHeadline: string;
    description: string;
    profileImage: string;
    skillsTitle1: string;
    skillsText1: string;
    skillsTitle2: string;
    skillsText2: string;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  story: StoryConfig;
  journal: {
    sectionTitle: string;
    headline: string;
  };
  theme: {
    fontHeading: string;
    fontBody: string;
    colorBackground: string;
    colorText: string;
    colorAccent: string;
  };
  contact: {
    email: string;
    formspreeId: string;
    location: string;
    footerText: string;
    signatureUrl?: string;
    socials: {
      facebook: string;
      instagram: string;
      tiktok: string;
      linkedin: string;
      youtube: string;
      deviantart: string;
      artstation: string;
      shutterstock: string;
    };
  };
}
