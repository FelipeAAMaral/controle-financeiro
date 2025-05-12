
import { supabase } from '@/lib/supabase';

// Generic service for Supabase operations
export class SupabaseService<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  // Get all records associated with the current user
  async getAll(userId: string): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error(`Error fetching data from ${this.tableName}:`, error);
      throw error;
    }

    return data as T[];
  }

  // Get a single record by ID, ensuring it belongs to the user
  async getById(id: string | number, userId: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error(`Error fetching ${this.tableName} by id:`, error);
      throw error;
    }

    return data as T;
  }

  // Create a new record, associating it with the user
  async create(item: Partial<T>, userId: string): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({ ...item, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }

    return data as T;
  }

  // Update a record, ensuring it belongs to the user
  async update(id: string | number, item: Partial<T>, userId: string): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(item)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }

    return data as T;
  }

  // Delete a record, ensuring it belongs to the user
  async delete(id: string | number, userId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }
}
