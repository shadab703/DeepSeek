import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const PromptBox = ({ setIsLoading, isLoading }) => {

    const [prompt, setPrompt] = useState('');
    const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();
    const sendPrompt = async (e) => {
        const promptCopy = prompt;
        try {
            e.preventDefault();
            if (!user) return toast.error("Login to send message");
            if (isLoading) return toast.error("Wait for the previous prompt response");
            setIsLoading(true);
            setPrompt("");
            const userprompt = {
                role: "user",
                content: "prompt",
                timestamp: Date.now()
            }
            // Saving user prompt in chat Array
            setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat._id ? {
                ...chat,
                messages: [...chat.messages, userprompt]
            } : chat));
            // Saving User Prompt in Selected chat
            setSelectedChat((prev) => ({
                ...prev,
                messages: [...prev.messages, userprompt]
            }));
            const { data } = await axios.post("/api/chat/ai", {
                chatId: selectedChat._id,
                prompt
            });
            if (data.success) {
                setChats((prevChats) => prevChats.map((chat) => chat._id === selectedChat._id ?
                    { ...chat, messages: [...chat.messages, data.data] } : chat));

            } else {
                toast.error(data.message);
                setPrompt(promptCopy);
            }

        } catch (error) {
            toast.error(error.message);
            setPrompt(promptCopy);
        } finally {
            setIsLoading(false);
        }

    }
    return (
        <form className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
            <textarea
                className='w-full outline-none resize-none overflow-hidden breaks-words bg-transparent'
                rows={2} placeholder='Message DeepSeek' required
                onChange={(e) => setPrompt(e.target.value)} value={prompt}
            />

            <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-2'>
                    <p className='flex items-center gap-2 text-xs text-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                        <Image src={assets.deepthink_icon} alt='DeepThink Icon' className='h-5' />
                        DeepThink (R1)
                    </p>
                    <p className='flex items-center gap-2 text-xs text-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                        <Image src={assets.search_icon} alt='DeepThink Icon' className='h-5' />
                        Search
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Image src={assets.pin_icon} alt='DeepThink Icon' className='w-4 cursor-pointer' />
                    <button className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
                        <Image src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt='DeepThink Icon' className='w-3.5 aspect-square' />

                    </button>

                </div>
            </div>
        </form>
    )
}

export default PromptBox