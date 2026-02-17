
import { createClient } from '@supabase/supabase-js';
import { PortfolioItem, BlogPost, SiteConfig, Testimonial, Voucher } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { SEED_PORTFOLIO_ITEMS } from '../constants/portfolioData';

const SUPABASE_URL = "https://orqalcygmcyriqfvvkcv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycWFsY3lnbWN5cmlxZnZ2a2N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyOTQ4NDQsImV4cCI6MjA4NDg3MDg0NH0.F42KvOgjZJjVE7q1i4G7kuEM0hl6aeC7smNg9_h7Cy0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ... (previous mappers remain the same)

export const testimonialService = {
  getAll: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase.from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false });
    return error ? [] : data;
  },
  getAdminAll: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    return error ? [] : data;
  },
  approve: async (id: string, isApproved: boolean) => {
    const { error } = await supabase.from('testimonials').update({ is_approved: isApproved }).eq('id', id);
    if (error) throw error;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },
  submitWithVoucher: async (code: string, testimonial: Partial<Testimonial>) => {
    // 1. Verify and Burn Voucher
    const { data: voucher, error: vError } = await supabase.from('testimonial_vouchers').select('*').eq('code', code).eq('is_used', false).single();
    if (vError || !voucher) throw new Error("Invalid or already used security code.");

    // 2. Mark voucher as used
    await supabase.from('testimonial_vouchers').update({ is_used: true }).eq('id', voucher.id);

    // 3. Insert Testimonial
    const { error: tError } = await supabase.from('testimonials').insert({
        client_name: testimonial.client_name,
        client_role: testimonial.client_role,
        content: testimonial.content,
        rating: testimonial.rating,
        voucher_used: code,
        is_approved: false // Admin must approve
    });
    if (tError) throw tError;
  }
};

export const voucherService = {
  getAll: async (): Promise<Voucher[]> => {
    const { data, error } = await supabase.from('testimonial_vouchers').select('*').order('created_at', { ascending: false });
    return error ? [] : data;
  },
  create: async (): Promise<string> => {
    const code = 'TZ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { error } = await supabase.from('testimonial_vouchers').insert({ code });
    if (error) throw error;
    return code;
  },
  delete: async (id: string) => {
    await supabase.from('testimonial_vouchers').delete().eq('id', id);
  }
};

// ... (rest of configService, portfolioService, blogService, authService remain the same)

const mapItemFromDB = (item: any): PortfolioItem => ({
  ...item,
  mediaType: item.media_type,
  thumbnailUrl: item.thumbnail_url,
  createdAt: item.created_at,
  dateCreated: item.date_created,
  references: item.references_data || [],
  assets: item.assets_data || [],
  tags: item.tags || [],
  isFeatured: item.is_featured || false,
  featuredOrder: item.featured_order || 99
});

const mapItemToDB = (item: Partial<PortfolioItem>) => {
  const { mediaType, thumbnailUrl, createdAt, dateCreated, references, assets, tags, isFeatured, featuredOrder, ...rest } = item;
  return {
    ...rest,
    ...(mediaType && { media_type: mediaType }),
    ...(thumbnailUrl && { thumbnail_url: thumbnailUrl }),
    ...(dateCreated && { date_created: dateCreated }),
    references_data: references || [],
    assets_data: assets || [],
    tags: tags || [],
    is_featured: isFeatured,
    featured_order: featuredOrder
  };
};

const mapBlogFromDB = (post: any): BlogPost => ({
  ...post,
  coverImage: post.cover_image,
  geoTag: post.geo_tag,
  publishedAt: post.published_at
});

const mapBlogToDB = (post: Partial<BlogPost>) => {
  const { coverImage, geoTag, publishedAt, ...rest } = post;
  return {
    ...rest,
    ...(coverImage && { cover_image: coverImage }),
    ...(geoTag && { geo_tag: geoTag }),
    ...(publishedAt && { published_at: publishedAt }),
  };
};

const mergeConfig = (defaultConfig: SiteConfig, remoteConfig: any): SiteConfig => {
  if (!remoteConfig) return defaultConfig;
  return {
    general: { ...defaultConfig.general, ...(remoteConfig.general || {}) },
    seo: { ...defaultConfig.seo, ...(remoteConfig.seo || {}) },
    cloudinary: { ...defaultConfig.cloudinary, ...(remoteConfig.cloudinary || {}) },
    hero: { ...defaultConfig.hero, ...(remoteConfig.hero || {}) },
    bio: { ...defaultConfig.bio, ...(remoteConfig.bio || {}) },
    testimonial: { ...defaultConfig.testimonial, ...(remoteConfig.testimonial || {}) },
    story: { ...defaultConfig.story, ...(remoteConfig.story || {}) },
    journal: { ...defaultConfig.journal, ...(remoteConfig.journal || {}) },
    theme: { ...defaultConfig.theme, ...(remoteConfig.theme || {}) },
    contact: { 
        ...defaultConfig.contact, 
        ...(remoteConfig.contact || {}),
        socials: { ...defaultConfig.contact.socials, ...(remoteConfig.contact?.socials || {}) }
    }
  };
};

export const configService = {
  get: async (): Promise<SiteConfig> => {
    try {
      const { data, error } = await supabase.from('site_config').select('config').eq('id', 1).single();
      if (data?.config) return mergeConfig(DEFAULT_CONFIG, data.config);
      const { error: insertError } = await supabase.from('site_config').insert({ id: 1, config: DEFAULT_CONFIG });
      return DEFAULT_CONFIG;
    } catch (e) {
      console.error("Config load error:", e);
      return DEFAULT_CONFIG;
    }
  },
  update: async (config: SiteConfig): Promise<SiteConfig> => {
    try {
      await supabase.from('site_config').upsert({ id: 1, config: config, updated_at: new Date().toISOString() });
      return config;
    } catch (e) {
      console.error("Config update error:", e);
      return config;
    }
  },
  reset: async (): Promise<SiteConfig> => configService.update(DEFAULT_CONFIG)
};

export const portfolioService = {
  getAll: async (): Promise<PortfolioItem[]> => {
    const { data, error } = await supabase.from('portfolio_items').select('*').order('created_at', { ascending: false });
    const dbItems = error ? [] : data.map(mapItemFromDB);
    
    // Merge DB items with Seed items
    // If an item exists in DB (by logic of user adding it), we prioritize DB, but here we just combine them.
    // In a real app, you might only want seed data if DB is empty, or you'd script the import.
    // For this portfolio showcase, we combine them so the user sees all assets immediately.
    
    // Create a map to deduplicate by ID if necessary, though seed IDs are distinct 'seed-'
    const allItems = [...dbItems, ...SEED_PORTFOLIO_ITEMS];
    return allItems;
  },
  create: async (item: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<PortfolioItem> => {
    const { data, error } = await supabase.from('portfolio_items').insert(mapItemToDB(item)).select().single();
    if (error) throw error;
    return mapItemFromDB(data);
  },
  update: async (item: PortfolioItem): Promise<PortfolioItem> => {
    const { data, error } = await supabase.from('portfolio_items').update(mapItemToDB(item)).eq('id', item.id).select().single();
    if (error) throw error;
    return mapItemFromDB(data);
  },
  updateBatch: async (items: PortfolioItem[]): Promise<void> => {
    const dbItems = items.map(mapItemToDB);
    const { error } = await supabase.from('portfolio_items').upsert(dbItems);
    if (error) throw error;
  },
  delete: async (id: string): Promise<void> => {
    // If it's a seed item, we can't delete it from DB, but we could filter it out in local state if we implemented that logic.
    // For now, only DB items can be deleted via this service.
    if (id.startsWith('seed-')) {
       console.warn("Cannot delete seed data from database.");
       return;
    }
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (error) throw error;
  }
};

export const blogService = {
  getAll: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
    return error ? [] : data.map(mapBlogFromDB);
  },
  create: async (post: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost> => {
    const { data, error } = await supabase.from('blog_posts').insert(mapBlogToDB(post)).select().single();
    if (error) throw error;
    return mapBlogFromDB(data);
  },
  update: async (post: BlogPost): Promise<BlogPost> => {
    const { data, error } = await supabase.from('blog_posts').update(mapBlogToDB(post)).eq('id', post.id).select().single();
    if (error) throw error;
    return mapBlogFromDB(data);
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  }
};

export const authService = {
  login: async (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
  logout: async () => supabase.auth.signOut(),
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user || null;
  }
};
