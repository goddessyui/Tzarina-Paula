
import { PortfolioItem, PortfolioCategory } from '../types';

export type SmartSortOption = 
  | 'relevance' 
  | 'dateCreated' 
  | 'dateUploaded' 
  | 'featured' 
  | 'alphabetical'
  | 'illustration' 
  | 'motion_graphics_animation' 
  | 'graphic_design' 
  | 'video_editing' 
  | 'web_app_development';

interface SearchResult {
  item: PortfolioItem;
  score: number;
}

export interface SearchSuggestion {
  type: 'project' | 'tag' | 'category';
  text: string;
  id?: string;
}

// Map natural language keywords to internal categories
const CATEGORY_INTENT_MAP: Record<string, PortfolioCategory> = {
  'drawing': 'illustration',
  'sketch': 'illustration',
  'painting': 'illustration',
  'illustration': 'illustration',
  'art': 'illustration',
  'video': 'video_editing',
  'movie': 'video_editing',
  'edit': 'video_editing',
  'film': 'video_editing',
  'animation': 'motion_graphics_animation',
  'motion': 'motion_graphics_animation',
  '3d': 'motion_graphics_animation',
  'graphic': 'graphic_design',
  'design': 'graphic_design',
  'logo': 'graphic_design',
  'branding': 'graphic_design',
  'web': 'web_app_development',
  'app': 'web_app_development',
  'site': 'web_app_development',
  'code': 'web_app_development',
  'development': 'web_app_development',
  'react': 'web_app_development',
};

// Levenshtein Distance for Typo Tolerance
const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const isFuzzyMatch = (source: string, target: string, tolerance: number = 2): boolean => {
  if (source.includes(target)) return true;
  if (target.length < 4) return source.includes(target); // Too short for fuzzy
  return getLevenshteinDistance(source, target) <= tolerance;
};

export const getAutocompleteSuggestions = (items: PortfolioItem[], query: string): SearchSuggestion[] => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const suggestions: SearchSuggestion[] = [];
  const seen = new Set<string>();

  // 1. Check Categories
  Object.keys(CATEGORY_INTENT_MAP).forEach(keyword => {
    if (keyword.startsWith(normalizedQuery) && !seen.has(keyword)) {
      suggestions.push({ type: 'category', text: keyword });
      seen.add(keyword);
    }
  });

  // 2. Check Tags
  const allTags = Array.from(new Set(items.flatMap(i => i.tags || [])));
  allTags.forEach(tag => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes(normalizedQuery) && !seen.has(lowerTag)) {
      suggestions.push({ type: 'tag', text: tag });
      seen.add(lowerTag);
    }
  });

  // 3. Check Titles (Instant Results)
  items.forEach(item => {
    const lowerTitle = item.title.toLowerCase();
    if (lowerTitle.includes(normalizedQuery) && !seen.has(item.id)) {
      suggestions.push({ type: 'project', text: item.title, id: item.id });
      seen.add(item.id);
    }
  });

  // Limit suggestions
  return suggestions.slice(0, 8);
};

export const performSmartSearch = (
  items: PortfolioItem[], 
  query: string, 
  sortOption: SmartSortOption = 'featured'
): PortfolioItem[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // 1. If no query, just return sorted items
  if (!normalizedQuery) {
    return sortItems(items, sortOption);
  }

  // 2. Intent Detection (Category Filtering)
  let activeCategoryFilter: PortfolioCategory | null = null;
  const queryWords = normalizedQuery.split(' ');
  
  for (const word of queryWords) {
    if (CATEGORY_INTENT_MAP[word]) {
      activeCategoryFilter = CATEGORY_INTENT_MAP[word];
      break;
    }
  }

  // 3. Scoring & Filtering
  let results: SearchResult[] = items.map(item => {
    let score = 0;

    // A. Category Intent Match (Heavy Filter)
    if (activeCategoryFilter && item.category !== activeCategoryFilter) {
      return { item, score: -1 }; // Exclude
    }

    // B. Text Matching & Fuzzy Logic
    const title = item.title.toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const tags = (item.tags || []).map(t => t.toLowerCase());

    // Exact Title Match
    if (title === normalizedQuery) score += 100;
    // Partial Title Match
    else if (title.includes(normalizedQuery)) score += 50;
    // Fuzzy Title Match
    else if (isFuzzyMatch(title, normalizedQuery)) score += 40;
    
    // Tag Match
    if (tags.some(t => t.includes(normalizedQuery))) score += 30;
    else if (tags.some(t => isFuzzyMatch(t, normalizedQuery))) score += 20;

    // Description Match
    if (desc.includes(normalizedQuery)) score += 10;

    // Word Match (for multi-word queries)
    queryWords.forEach(word => {
      if (title.includes(word)) score += 5;
      if (tags.some(t => t.includes(word))) score += 5;
    });

    return { item, score };
  });

  // Filter out non-matches
  results = results.filter(r => r.score > 0);

  // 4. Sort Results
  // If sort is 'relevance' (default for search), use score. Otherwise use the specific sort.
  if (sortOption === 'relevance') {
    results.sort((a, b) => b.score - a.score);
  } else {
    // If sorting by category or other method, apply it to the filtered search results
    const matchedItems = results.map(r => r.item);
    return sortItems(matchedItems, sortOption);
  }

  return results.map(r => r.item);
};

const sortItems = (items: PortfolioItem[], option: SmartSortOption): PortfolioItem[] => {
  const sorted = [...items];

  // Check if option is a category (acts as a filter + sort)
  const isCategory = (opt: string): boolean => {
      return ['illustration', 'motion_graphics_animation', 'graphic_design', 'video_editing', 'web_app_development'].includes(opt);
  };

  if (isCategory(option)) {
      // Filter by category
      const filtered = sorted.filter(item => item.category === option);
      // Sort by Date Created (Newest First) within that category
      return filtered.sort((a, b) => new Date(b.dateCreated || b.createdAt).getTime() - new Date(a.dateCreated || a.createdAt).getTime());
  }

  switch (option) {
    case 'featured':
      return sorted.sort((a, b) => {
        // Featured items first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // Then by order
        if (a.isFeatured && b.isFeatured) {
            return (a.featuredOrder || 99) - (b.featuredOrder || 99);
        }
        // Then by creation date (newest first)
        return new Date(b.dateCreated || b.createdAt).getTime() - new Date(a.dateCreated || a.createdAt).getTime();
      });
    
    case 'dateCreated': // Artwork Date
      return sorted.sort((a, b) => new Date(b.dateCreated || b.createdAt).getTime() - new Date(a.dateCreated || a.createdAt).getTime());

    case 'dateUploaded': // Database ID/System Date
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return sorted;
  }
};
