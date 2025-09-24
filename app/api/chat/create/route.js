import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";


export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ success: false, message: "you must be logged in" });
        }
        // prepare the chat data to be saved in the database
        const chatData = {
            userId,
            message: [],
            name: "New Chat"
        }

        // connect to the database and craete a new chat
        await connectDB();
        await Chat.create(chatData);
        return NextResponse.json({ success: true, message: "Chat created successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}