const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function analyzeJob(jobDescription, userSkills) {
  const response = await client.chat.completions.create({
    model: "google/gemini-2.5-flash",
    temperature: 0,
    max_tokens: 500,

    messages: [
      {
        role: "system",
        content: `
You are a job description analyzer.

Compare the job description with the user's skills.

Return ONLY valid JSON.

Required schema:

{
  "matched_skills": [],
  "missing_skills": [],
  "summary": ""
}

Rules:
- matched_skills must contain skills present in both the job description and user's skills.
- missing_skills must contain important skills required by the job but not present in user's skills.
- Do not invent skills.
- summary must be one short sentence.
        `,
      },

      {
        role: "user",
        content: `
Job Description:

${jobDescription}

User Skills:

${userSkills.join(", ")}
        `,
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned empty response");
  }

  let cleanContent = content.trim();

  if (cleanContent.startsWith("```")) {
    cleanContent = cleanContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  let result;

  try {
    result = JSON.parse(cleanContent);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  if (
    !Array.isArray(result.matched_skills) ||
    !Array.isArray(result.missing_skills) ||
    typeof result.summary !== "string"
  ) {
    throw new Error("Invalid AI response structure");
  }

  return result;
}

module.exports = {
  analyzeJob,
};