import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { destination, budget, days, mood } = await req.json();

    const prompt = `
Create a travel itinerary in JSON format.

Return ONLY valid JSON.

{
  "title": "",
  "budget": "",
  "days": [
    {
      "day": 1,
      "activities": []
    }
  ],
  "food": [],
  "hiddenGems": [],
  "tips": []
}

Destination: ${destination}
Budget: ${budget}
Days: ${days}
Mood: ${mood}

Include:
- Day-wise itinerary
- Food recommendations
- Hidden gems
- Travel tips

Format everything neatly.
`;
return NextResponse.json({
  result: JSON.stringify({
    title: `${destination} Adventure Trip`,
    budget: "₹10,000",
    days: [
      {
        day: 1,
        activities: [
          "Visit famous places",
          "Food exploration",
          "Photography"
        ]
      },
      {
        day: 2,
        activities: [
          "Explore hidden gems",
          "Local shopping",
          "Street food tour"
        ]
      }
    ],
    food: [
      "Local Food",
      "Street Food",
      "Traditional Thali"
    ],
    hiddenGems: [
      "Secret Spot",
      "Hidden Temple",
      "Scenic Viewpoint"
    ],
    tips: [
      "Carry water",
      "Use local transport",
      "Start early"
    ]
  })
});
} catch (error: any) {
  console.error("FULL GEMINI ERROR:");
  console.error(error);

  return NextResponse.json(
    {
      error: error?.message || String(error),
    },
    {
      status: 500,
    }
  );
}
}