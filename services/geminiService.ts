import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check key existence
const hasKey = !!apiKey;

export const analyzeManifesto = async (manifestoText: string): Promise<string> => {
  if (!hasKey) return "API Key missing. Cannot analyze manifesto.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as an avant-garde philosopher and architectural critic. Analyze the following manifesto text. 
      Provide a cryptic, artistic, and profound summary of the author's soul and vision. 
      Keep it under 60 words. Make it sound like a museum plaque for a human spirit.
      
      Manifesto:
      ${manifestoText}`,
    });
    return response.text || "Analysis complete.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The void remains silent (Error connecting to AI).";
  }
};

export const generateVisionConcept = async (prompt: string): Promise<string> => {
  if (!hasKey) return "API Key missing.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a visionary architect. Based on this vague idea: "${prompt}", 
      describe a concrete, brutalist or organic architectural structure that embodies this feeling.
      Keep it poetic, visual, and concise (max 2 sentences).`,
    });
    return response.text || "Vision generated.";
  } catch (error) {
    console.error(error);
    return "Vision clouded.";
  }
};