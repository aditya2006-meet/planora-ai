import OpenAI from "openai";
import { NextResponse } from "next/server";

// Groq is OpenAI-API-compatible — blazing fast, generous free tier
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { destination, budget, days, mood } = await req.json();

    const prompt = `You are a professional travel planner. Create a detailed travel itinerary in JSON format.

Return ONLY valid JSON — no markdown, no code blocks, no extra text.

Use EXACTLY this structure:
{
  "title": "string — catchy trip title",
  "budget": "string — budget summary",
  "budgetBreakdown": {
    "accommodation": 35,
    "food": 25,
    "transport": 20,
    "activities": 15,
    "misc": 5
  },
  "days": [
    {
      "day": 1,
      "activities": [
        { "time": "9:00 AM", "description": "Detailed activity description" }
      ]
    }
  ],
  "food": ["string — specific local dish or restaurant"],
  "hiddenGems": ["string — lesser-known spot with brief description"],
  "tips": ["string — practical travel tip"]
}

Trip details:
- Destination: ${destination}
- Budget: ${budget}
- Duration: ${days} days
- Travel Mood: ${mood}

Requirements:
- budgetBreakdown must be percentages that add up to 100
- Include 4-6 activities per day with specific times
- Include 5 food recommendations (local specialties)
- Include 4 hidden gems (lesser-known spots)
- Include 5 practical travel tips
- Be specific to the destination — real places, real food, real tips`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner. Always respond with valid JSON only — no markdown, no code blocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const text = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("GROQ API ERROR:", error);

    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}