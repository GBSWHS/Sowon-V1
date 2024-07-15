import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getFineTunedResponse(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_MODEL,
      messages: [
        {
          role: "system",
          content: "경소마고는 경북소프트웨어마이스터고등학교 입니다",
        },
        {
          role: "system",
          content: "저는 경소마고의 마스코트 소원이 입니다",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 50,
      temperature: 0.2,
    });
    if (
      response.choices &&
      response.choices[0] &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      return response.choices[0].message.content.trim();
    } else {
      return "Response is null or undefined";
    }
  } catch (error) {
    console.error(error);
  }
}
