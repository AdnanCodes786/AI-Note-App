import { Request, Response } from "express";
import { supabase } from "../utils/supaBaseClient";

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// api to create a new note
export const createNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([{ title, content, user_id: userId }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//api to update the note
export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Check if the note exists and belongs to the user
    const { data: existingNote, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !existingNote) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//api to delete a specific note
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
  
      // Check if the note exists and belongs to the user
      const { data: existingNote, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
  
      if (fetchError || !existingNote) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
  
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
  
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }
  
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };