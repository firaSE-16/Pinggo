export const users = [
  {
    id: "u1",
    username: "johndoe",
    fullName: "John Doe",
    avatar: "/developerimage/person1.jpg",
    status: "online",
    lastSeen: "2025-07-11T08:30:00Z"
  },
  {
    id: "u2",
    username: "sara92",
    fullName: "Sara Michael",
    avatar: "/developerimage/person2.jpg",
    status: "offline",
    lastSeen: "2025-07-11T06:10:00Z"
  },
  {
    id: "u3",
    username: "dev_mike",   
    fullName: "Mike Benson",
    avatar: "/developerimage/person3.jpg",
    status: "online",
    lastSeen: "2025-07-11T08:42:00Z"
  }
];


export const chats = [
  {
    chatId: "chat1",
    participants: ["u1", "u2"],
    messages: [
      {
        id: "m1",
        senderId: "u1",
        text: "Hey Sara, how's your day?",
        type: "text",
        timestamp: "2025-07-11T08:01:00Z"
      },
      {
        id: "m2",
        senderId: "u2",
        text: "Not bad, working on a new project. You?",
        type: "text",
        timestamp: "2025-07-11T08:02:30Z"
      },
      {
        id: "m3",
        senderId: "u1",
        text: "Not bad, working on a new project. You?",
        type: "audio",
        timestamp: "2025-07-11T08:03:12Z"
      }
    ]
  },
  {
    chatId: "chat2",
    participants: ["u1", "u3"],
    messages: [
      {
        id: "m4",
        senderId: "u3",
        text: "Can we meet at 3 PM?",
        type: "text",
        timestamp: "2025-07-11T08:20:00Z"
      },
      {
        id: "m5",
        senderId: "u1",
        text: "Sure, see you then.",
        type: "text",
        timestamp: "2025-07-11T08:21:10Z"
      }
    ]
  }
];

