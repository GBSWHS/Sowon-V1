import OpenAI from "openai";

const openai = new OpenAI({
   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
   dangerouslyAllowBrowser: true,
});

export async function getFineTunedResponse(prompt: string) {
   try {
      const response = await openai.chat.completions.create({
         model: "ft:gpt-3.5-turbo-0125:personal::9jHsgCW2",
         messages: [
            { role: "user", content: prompt },
         ],
         max_tokens: 100,
      });
      if (response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) {
         return(response.choices[0].message.content.trim());
      } else {
         return("Response is null or undefined");
      }
   } catch (error) {
      console.error(error);
   }
}