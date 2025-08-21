"use client";
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex flex-col flex-1 items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180"
              src={assets.menu_icon}
              alt="Menu Icon"
            />
            <Image
              className="opacity-70"
              src={assets.chat_icon}
              alt="Chat Icon"
            />
          </div>
          {messages.length === 0 ? (
            <>
              <div className="flex gap-3 items-center">
                <Image src={assets.logo_icon} alt="Logo Icon" className="h-16" />
                <p className="text-2xl font-medium">Welcome to the DeepSeek!</p>
              </div>
              <p className="text-sm mt-2">How can I assist you today?</p>
            </>
          ) :
            (
              <div>
                <Message role='user' content='what is next js?' />
              </div>
            )}
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className="text-xs absolute bottom-1 text-gray-500">AI Generated, for reference Only</p>
        </div>
      </div>
    </div>
  );
}
