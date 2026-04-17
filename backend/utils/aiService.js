import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeMedicalText = async (scrubbedText) => {
  const prompt = `
You are a Senior Certified Professional Coder (CPC). 
Analyze the following de-identified medical clinical note.

TASKS:
1. Extract all relevant ICD-10-CM (Diagnosis) codes.
2. Extract all relevant CPT (Procedure) codes.
3. For each code, provide a brief description and a confidence score (0.0 to 1.0).
4. Assess "denialRisk" based on standard payer rules (e.g., missing modifiers or unbundled codes).

OUTPUT FORMAT (Strict JSON):
{
  "codes": [
    {
      "code": "string",
      "description": "string",
      "type": "ICD-10-CM" | "CPT",
      "confidence": number,
      "denialRisk": { "score": number, "reason": "string" }
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON
- No explanations
- No markdown

CLINICAL NOTE:
${scrubbedText}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Best free Groq model right now
      messages: [
        {
          role: "system",
          content: "You are a precise medical coding AI that always returns valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2, // low for accuracy
    });

    const text = completion.choices[0]?.message?.content || "";

    // Clean response (sometimes models wrap JSON)
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw new Error("AI Analysis Failed");
  }
};