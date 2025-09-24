export const maxDuration = 60;

import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI Client with DeepSeek API Key and base url
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req) {
    try {
        const { userId } = getAuth(req);

        // Extract ChatId and prompt from the request body
        const { chatId, prompt } = await req.json();
        if (!userId) {
            return NextResponse.json({ success: false, message: "you must be logged in" })
        }
        // Find the chat document in the database based on userId and ChatId
        await connectDB();
        const data = await Chat.find({ userId, _id: chatId });

        // Create a User Message Object
        const userPrompt = {
            role: "user",
            content: prompt,
            timeStamp: Date.now()
        }
        data.message.push(userPrompt);

        // Call the DeepSeek API to get a chat completion
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            store: true
        });

        const message = completion.choices[0].message;
        message.timeStamp = Date.now();
        data.messages.push(message)
        data.save();
        return NextResponse.json({ success: true, data: message })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }

}