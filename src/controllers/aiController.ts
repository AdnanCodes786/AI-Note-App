import { Request, Response } from "express";
import axios from "axios";
import { supabase } from "../utils/supaBaseClient";

//api to generate summary of any existing note in
export const generateSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { noteId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!noteId) {
      res.status(400).json({ error: "Note ID is required" });
      return;
    }

    // Get the note content
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .eq("user_id", userId)
      .single();

    if (noteError || !note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    // Check if summary already exists
    const { data: existingSummary } = await supabase
      .from("summaries")
      .select("*")
      .eq("note_id", noteId)
      .maybeSingle();

    if (existingSummary) {
      res.status(200).json(existingSummary);
      return;
    }

    // Call Grok API for summarization
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Grok API key not configured" });
      return;
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions", // Grok API endpoint
      {
        model: "llama3-8b-8192", // Update with the correct Grok model
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that creates concise summaries.",
          },
          {
            role: "user",
            content: `Please provide a brief summary of the following note. Keep it concise and capture the main points: ${note.content}`,
          },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const summaryText = response.data.choices[0].message.content;

    // Store the summary in the database
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .insert([{ note_id: noteId, summary: summaryText }])
      .select()
      .single();

    if (summaryError) {
      res.status(400).json({ error: summaryError.message });
      return;
    }

    res.status(201).json(summary);
  } catch (error: any) {
    console.error("Error generating summary:", error);
    res.status(500).json({
      error: "Failed to generate summary",
      details: error.response?.data || error.message,
    });
  }
};

// api to fetch the summary if it already exists for a note
export const getSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { noteId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .eq("user_id", userId)
      .single();

    if (noteError || !note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    // Get the summary
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .select("*")
      .eq("note_id", noteId)
      .maybeSingle();

    if (summaryError) {
      res.status(400).json({ error: summaryError.message });
      return;
    }

    if (!summary) {
      res
        .status(200)
        .json({
          error: "Summary not found for this note. Generate a summary first.",
        });
      return;
    }

    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
