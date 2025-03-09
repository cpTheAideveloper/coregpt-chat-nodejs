import OpenAI from "openai";
import { config } from "dotenv";
config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


  export async function chatHelper(message, model = "gpt-4o-mini", systemConfiguration = "You are a helpful assistant.", messageHistory = []) {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemConfiguration },
        ...messageHistory,
        message,
      ],
    });
  
    // Return a simplified object.
    return { role: "assistant", content: completion.choices[0].message.content };
  }