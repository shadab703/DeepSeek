export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});


export async function POST(req) {
    try {
        const { userId } = getAuth();
        // Extract ChatId and Prompt from req body
        const { chatId, prompt } = await req.json();
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not Authenticated" });
        }

        // find the chat document in the database based on UserId and ChatId
        await connectDB();
        const data = await Chat.findOne({ userId, _id: chatId });

        // Create a User message Object
        const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now()
        }
        data.message.push(userPrompt);

        // Call the deepseek api to get a chat complition
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
            store: true
        });
        const message = completion.choices[0].message;
        message.timestamp = Date.now();
        data.message.push(message);
        data.save();
        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
