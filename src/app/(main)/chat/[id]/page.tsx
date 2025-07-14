'use client'
import { FiArrowLeft, FiPaperclip, FiMic, FiSend } from "react-icons/fi";
import { BsCheck2All, BsThreeDotsVertical } from "react-icons/bs";
import { users, chats } from "@/constants/constant";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react"; // Import useRef
import UserList from "@/components/userList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  senderId: string;
  text: string;
  type: string;
  timestamp: string;
};

type Chat = {
  chatId: string;
  participants: string[];
  messages: Message[];
};

type User = {
  id: string;
  fullName: string;
  avatar: string;
  status: string;
  lastSeen: string;
};

const UserChat = () => {
  const { id } = useParams();
  const router = useRouter();
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  useEffect(() => {
    if (id) {
      const userId = Array.isArray(id) ? id[0] : id;
      const foundChat = chats.find(chat =>
        chat.participants.includes("u1") &&
        chat.participants.includes(userId)
      );

      setCurrentChat(foundChat || {
        chatId: `chat-new-${userId}`,
        participants: ["u1", userId],
        messages: []
      });

      const foundUser = users.find(user => user.id === userId);
      setOtherUser(foundUser || null);
    }
  }, [id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]); 
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "u1",
      text: newMessage,
      type: "text",
      timestamp: new Date().toISOString()
    };

    setCurrentChat(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMsg]
      };
    });

    setNewMessage("");
  };

  const formatTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-background">
      <div className="w-[350px] hidden md:flex border-r border-border">
        <UserList />
      </div>

      <div className="flex-1 flex flex-col h-screen"> {/* Set h-screen here */}
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card flex-shrink-0"> {/* flex-shrink-0 to prevent shrinking */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="w-14 h-14 border-2 border-blue-400">
              <AvatarImage
                className="w-16 h-16"
                src={otherUser.avatar}
                alt={otherUser.fullName}
              />
              <AvatarFallback className="text-3xl">
                {otherUser.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h4 className="font-semibold">{otherUser.fullName}</h4>
              <p className="text-xs text-muted-foreground">
                {otherUser.status === "online" ? (
                  <span className="flex items-center text-sm text-[#ffffffa8]">
                    <span className="w-2 h-2 text-sm rounded-full bg-[#1ff05085] mr-1"></span>
                    Online
                  </span>
                ) : (
                  `Last seen ${new Date(otherUser.lastSeen).toLocaleTimeString()}`
                )}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <BsThreeDotsVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat Messages - Make this scrollable and take remaining space */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto"> {/* flex-1 to take available space */}
          {currentChat?.messages && currentChat.messages.length > 0 ? (
            <div className="space-y-3">
              {currentChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-[3px] flex ${message.senderId === "u1" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-2xl max-w-xs  md:max-w-md p-3 ${message.senderId === "u1"
                        ? "bg-[#5688f383] text-primary-foreground  rounded-ee-xl" 
                        : "bg-[#ffffff0d] text-foreground  rounded-es-xl" 
                      }`}
                  >
                    {message.type === "text" ? (
                      <p>{message.text}</p>
                    ) : (
                      <div className="w-40 h-10 bg-muted rounded flex items-center justify-center">
                        <span className="text-sm">Audio message</span>
                      </div>
                    )}
                    <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${message.senderId === "u1" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.senderId === "u1" && (
                        <BsCheck2All className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Dummy div for scrolling */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
              <Image
                src="/path/to/telegram-like-icon.svg" // Replace with an actual Telegram-like icon if you have one
                alt="No messages"
                width={80}
                height={80}
                className="mb-4 opacity-70"
              />
              <p className="text-lg font-medium mb-1">Start a conversation!</p>
              <p className="text-sm text-center">
                Send a message to {otherUser.fullName} and say hello.
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Message Input - Fixed at the bottom */}
        <div className="p-4 border-t border-border bg-card flex-shrink-0"> {/* flex-shrink-0 to prevent shrinking */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon">
              <FiPaperclip className="w-5 h-5" />
            </Button>
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full px-4 py-2 bg-input border-transparent focus-visible:ring-0 focus-visible:ring-offset-0" // More rounded input
            />
            {newMessage.trim() ? (
              <Button type="submit" size="icon" className="rounded-full"> {/* Rounded send button */}
                <FiSend className="w-5 h-5" />
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="icon" className="rounded-full"> {/* Rounded mic button */}
                <FiMic className="w-5 h-5" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserChat;