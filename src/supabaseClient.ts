import { createClient } from '@supabase/supabase-js';
import { Project } from './types';

// Read Supabase credentials from client-side environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase has been configured by the user
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 0 &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Initialize Supabase client (only if credentials are correct, or fallback gracefully)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Maps a single row from the Supabase 'artworks' table back into a high-fidelity Project.
 * Gracefully handles both stringified JSON data (for bilingual support) and raw text fallbacks.
 */
export function mapRowToProject(row: any): Project {
  let titleKo = '';
  let titleEn = '';
  let artworkNameKo = '';
  let artworkNameEn = '';

  try {
    // Attempt to parse stringified JSON first
    const parsedTitle = JSON.parse(row.title);
    if (parsedTitle && typeof parsedTitle === 'object') {
      titleKo = parsedTitle.titleKo || '';
      titleEn = parsedTitle.titleEn || '';
      artworkNameKo = parsedTitle.artworkNameKo || '';
      artworkNameEn = parsedTitle.artworkNameEn || '';
    } else {
      titleKo = row.title || '';
      titleEn = row.title || '';
    }
  } catch (e) {
    // If it's a plain string, use it for both Korean and English
    titleKo = row.title || '';
    titleEn = row.title || '';
  }

  let materialKo = '';
  let materialEn = '';
  let editionKo = '';
  let editionEn = '';

  try {
    const parsedMedium = JSON.parse(row.medium);
    if (parsedMedium && typeof parsedMedium === 'object') {
      materialKo = parsedMedium.materialKo || '';
      materialEn = parsedMedium.materialEn || '';
      editionKo = parsedMedium.editionKo || '';
      editionEn = parsedMedium.editionEn || '';
    } else {
      materialKo = row.medium || '';
      materialEn = row.medium || '';
    }
  } catch (e) {
    materialKo = row.medium || '';
    materialEn = row.medium || '';
  }

  let descriptionKo = '';
  let descriptionEn = '';
  let locationKo = '';
  let locationEn = '';
  let detailImages: string[] = [];
  let isFeatured = false;
  let salesStatus: 'available' | 'sold' | 'private' | 'inquire' = 'available';
  let videoUrl = '';
  let hideProjectTitle = false;
  let hideArtworkName = false;

  try {
    const parsedDesc = JSON.parse(row.description);
    if (parsedDesc && typeof parsedDesc === 'object') {
      descriptionKo = parsedDesc.descriptionKo || '';
      descriptionEn = parsedDesc.descriptionEn || '';
      locationKo = parsedDesc.locationKo || '';
      locationEn = parsedDesc.locationEn || '';
      detailImages = Array.isArray(parsedDesc.detailImages) ? parsedDesc.detailImages : [];
      isFeatured = !!parsedDesc.isFeatured;
      salesStatus = parsedDesc.salesStatus || 'available';
      videoUrl = parsedDesc.videoUrl || '';
      hideProjectTitle = !!parsedDesc.hideProjectTitle;
      hideArtworkName = !!parsedDesc.hideArtworkName;
    } else {
      descriptionKo = row.description || '';
      descriptionEn = row.description || '';
    }
  } catch (e) {
    descriptionKo = row.description || '';
    descriptionEn = row.description || '';
  }

  // Ensure cover image is also part of detailImages list if it's empty
  if (detailImages.length === 0 && row.image_url) {
    detailImages = [row.image_url];
  }

  return {
    id: row.id,
    category: row.category || 'Projects',
    titleKo,
    titleEn,
    artworkNameKo,
    artworkNameEn,
    year: row.year || '',
    materialKo,
    materialEn,
    size: row.size || '',
    descriptionKo,
    descriptionEn,
    coverImage: row.image_url || '',
    detailImages,
    locationKo,
    locationEn,
    editionKo,
    editionEn,
    isPublished: row.is_published !== undefined ? row.is_published : true,
    isFeatured,
    salesStatus,
    videoUrl,
    hideProjectTitle,
    hideArtworkName,
  };
}

/**
 * Maps a high-fidelity Project from the UI into a flat row matching the requested artworks table.
 */
export function mapProjectToRow(project: Project, orderIndex: number) {
  return {
    id: project.id,
    title: JSON.stringify({
      titleKo: project.titleKo,
      titleEn: project.titleEn,
      artworkNameKo: project.artworkNameKo,
      artworkNameEn: project.artworkNameEn,
    }),
    year: project.year,
    medium: JSON.stringify({
      materialKo: project.materialKo,
      materialEn: project.materialEn,
      editionKo: project.editionKo,
      editionEn: project.editionEn,
    }),
    size: project.size || '',
    category: project.category,
    description: JSON.stringify({
      descriptionKo: project.descriptionKo,
      descriptionEn: project.descriptionEn,
      locationKo: project.locationKo,
      locationEn: project.locationEn,
      detailImages: project.detailImages,
      isFeatured: project.isFeatured,
      salesStatus: project.salesStatus,
      videoUrl: project.videoUrl || '',
      hideProjectTitle: project.hideProjectTitle || false,
      hideArtworkName: project.hideArtworkName || false,
    }),
    image_url: project.coverImage,
    order_index: orderIndex,
    is_published: project.isPublished,
  };
}

/**
 * Fetches all artworks from Supabase, ordered by order_index.
 */
export async function fetchArtworks(): Promise<Project[]> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(mapRowToProject);
}

/**
 * Saves (inserts or updates) a single artwork in the Supabase database.
 */
export async function saveArtworkInSupabase(project: Project, orderIndex: number): Promise<any> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized.');
  }

  const row = mapProjectToRow(project, orderIndex);

  const { data, error } = await supabase
    .from('artworks')
    .upsert(row);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Re-saves all artworks to update their ordering in Supabase.
 */
export async function updateArtworksOrderInSupabase(projects: Project[]): Promise<void> {
  if (!supabase) return;

  const rows = projects.map((p, idx) => mapProjectToRow(p, idx));

  const { error } = await supabase
    .from('artworks')
    .upsert(rows);

  if (error) {
    throw error;
  }
}

/**
 * Deletes a single artwork from the Supabase database.
 */
export async function deleteArtworkFromSupabase(id: string): Promise<any> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized.');
  }

  const { data, error } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Uploads an artwork image to Supabase Storage ('artworks' bucket) and returns its public URL.
 */
export async function uploadArtworkImage(file: File): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized.');
  }

  // Standardize file name to prevent collision
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `artwork-images/${fileName}`;

  // Upload to public 'artworks' bucket
  const { data, error } = await supabase.storage
    .from('artworks')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    // If the bucket doesn't exist, provide a detailed message
    if (error.message && error.message.includes('Bucket not found')) {
      throw new Error("Supabase Storage bucket 'artworks' was not found. Please create a public bucket named 'artworks' in your Supabase Console -> Storage tab.");
    }
    throw error;
  }

  // Retrieve public URL
  const { data: { publicUrl } } = supabase.storage
    .from('artworks')
    .getPublicUrl(filePath);

  return publicUrl;
}
