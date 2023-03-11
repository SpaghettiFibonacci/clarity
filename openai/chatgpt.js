import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv'
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function chat(chatChain) {
    chatChain.push({"role": "system", "content": 'You are a good bot.'});
    chatChain.reverse();
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatChain,
        temperature: 0.3,
    });

    return completion.data.choices[0].message.content.trim();
}