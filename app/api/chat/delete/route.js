import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";


export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const { chatId } = await req.json();
        if (!userId) {
            return NextResponse.json({ success: false, message: "you must be logged in" });
        }

        // connect to the database and delete the chat
        await connectDB();
        await Chat.deleteOne({ _id: chatId, userId });
        return NextResponse.json({ success: true, message: "Chat deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}