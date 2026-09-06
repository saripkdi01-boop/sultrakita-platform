'use server';

import { getServerSupabase } from '@/lib/supabase/server';
import { createProperty as createPropertyRecord } from '@/lib/actions/property';

export interface Property {
  id: string; seller_id: string; category: string; title: string; description?: string; price: number; price_type: string;
  land_area_sqm?: number; building_area_sqm?: number; bedrooms: number; bathrooms: number; district: string; city: string;
  status: string; images: string[]; is_featured: boolean; views_count: number; created_at: string;
}

export async function getProperties(filters: { category?: string; district?: string; minPrice?: number; maxPrice?: number } = {}) {
  const supabase = getServerSupabase();
  let query = supabase.from('properties').select('id,seller_id,category,title,description,price,price_type,land_area_sqm,building_area_sqm,bedrooms,bathrooms,district,city,status,images,is_featured,views_count,created_at').eq('status', 'available');
  if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
  if (filters.district?.trim()) query = query.ilike('district', `%${filters.district.trim()}%`);
  if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
  const { data, error } = await query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Property[];
}

export async function getPropertyById(id: string) {
  const { data, error } = await getServerSupabase().from('properties').select('*, seller:profiles!seller_id(full_name,avatar_url,phone)').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProperty(propertyData: Record<string, unknown>) {
  return createPropertyRecord(propertyData);
}

export async function updatePropertyViews(id: string) {
  const supabase = getServerSupabase();
  const { data: current, error: readError } = await supabase.from('properties').select('views_count').eq('id', id).single();
  if (readError) throw readError;
  const { error } = await supabase.from('properties').update({ views_count: Number(current?.views_count || 0) + 1 }).eq('id', id);
  if (error) throw error;
}
