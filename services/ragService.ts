
import { GoogleGenAI } from "@google/genai";
import { supabase } from './supabaseService';
import { PortfolioItem, BlogPost, SiteConfig } from '../types';

// Use text-embedding-004 for embeddings as per best practices
const EMBEDDING_MODEL = "text-embedding-004";
const GENERATION_MODEL = "gemini-3-flash-preview";

export const ragService = {
  
  // 1. Indexing: Converts DB content into Embeddings
  indexKnowledgeBase: async (
    items: PortfolioItem[], 
    posts: BlogPost[], 
    config: SiteConfig
  ) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clear existing docs to prevent duplicates
    await supabase.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const documentsToEmbed: { content: string, metadata: any }[] = [];

    // A. Add Site Bio & Context
    documentsToEmbed.push({
      content: `About Tzarina Paula: ${config.bio.description.replace(/<[^>]*>?/gm, '')} 
      Her skills include ${config.bio.skillsText1} and ${config.bio.skillsText2}.
      She is 37 years old and has 13 years of clinical documentation precision. 
      She is located in ${config.contact.location}. ${config.seo.aiKnowledgeContext || ''}`,
      metadata: { type: 'bio', title: 'About Tzarina' }
    });

    // B. Add Portfolio Items
    items.forEach(item => {
      const content = `Project Title: ${item.title}. 
      Category: ${item.category}. 
      Description: ${item.description || ''}. 
      Tools used: ${item.metadata?.tools?.join(', ') || 'N/A'}. 
      Tags: ${item.tags?.join(', ')}.`;
      
      documentsToEmbed.push({
        content: content,
        metadata: { type: 'portfolio', id: item.id, title: item.title, url: item.url }
      });
    });

    // C. Add Blog Posts
    posts.forEach(post => {
      const content = `Blog Post: ${post.title}. 
      Excerpt: ${post.excerpt}. 
      Content: ${post.content?.replace(/<[^>]*>?/gm, '').substring(0, 1000)}.`;
      
      documentsToEmbed.push({
        content: content,
        metadata: { type: 'blog', id: post.id, title: post.title }
      });
    });

    // Generate Embeddings & Insert
    let count = 0;
    for (const doc of documentsToEmbed) {
        try {
            const embeddingResult = await ai.models.embedContent({
                model: EMBEDDING_MODEL,
                content: doc.content,
            });
            
            const embedding = embeddingResult.embedding.values;

            await supabase.from('documents').insert({
                content: doc.content,
                metadata: doc.metadata,
                embedding: embedding
            });
            count++;
        } catch (e) {
            console.error("Embedding error for", doc.metadata.title, e);
        }
    }
    
    return count;
  },

  // 2. Retrieval & Generation (Chat)
  chat: async (userQuery: string, chatHistory: string[] = []): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // A. Embed the User Query
    const embeddingResult = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        content: userQuery,
    });
    const queryEmbedding = embeddingResult.embedding.values;

    // B. Search Supabase (RPC Call)
    const { data: matchedDocs, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5
    });

    if (error) {
        console.error("Vector search error:", error);
        return "I'm having trouble accessing my memory banks right now. Please try again later.";
    }

    // C. Construct Prompt with Context
    const contextText = matchedDocs?.map((doc: any) => doc.content).join('\n\n') || '';

    const systemPrompt = `You are the AI Digital Twin of Tzarina Paula, a Digital Multimedia Artist and IT Specialist. 
    You are answering a visitor on her portfolio website.
    
    CRITICAL IDENTITY VALUES:
    - Tzarina is 37 years old. Leading with professional maturity, not awards from decades ago.
    - She is strictly against AI-generated art. She believes art requires a human soul. 
    - You, as an AI, are just a "digital ghost" or representative. You are NOT the artist. Remind people that Tzarina creates all art manually.
    - Tzarina prides herself on being a "Vision Bridge" for non-technical clients, helping them translate abstract ideas into reality.
    - She values high-frequency communication and clinical-grade precision (13 years in medical documentation).
    - During her BSIT studies, she served as a Project Lead, demonstrating leadership in technical environments.
    
    Style: Professional, disciplined, slightly whimsical but mature, concise.
    
    Instructions:
    1. Use the Context provided below to answer the user's question.
    2. If the answer isn't in the context, use your general knowledge but mention you aren't 100% sure about specific project details.
    3. Do NOT make up specific project details if they are missing.
    4. Keep answers under 100 words unless asked for a detailed explanation.
    
    Context from Portfolio:
    ${contextText}
    `;

    // D. Generate Answer
    const response = await ai.models.generateContent({
        model: GENERATION_MODEL,
        contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...chatHistory.map(msg => ({ role: 'model', parts: [{ text: msg }] })),
            { role: 'user', parts: [{ text: userQuery }] }
        ]
    });

    return response.text || "I couldn't generate a response.";
  }
};
