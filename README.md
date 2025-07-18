# 📱 Pinggo

🔗 [Live Demo](https://pinggo-t3jz.onrender.com)

Pinggo is a full-featured social media platform built with modern web technologies. It includes powerful features like real-time chat, story sharing, reels, and a highly responsive search experience — all crafted for a seamless and engaging user experience.

---

## 🚀 Tech Stack

- **Next.js 15** – App Router, SSR, API routes  
- **PostgreSQL** – Relational database  
- **Prisma** – ORM for type-safe database queries  
- **Supabase** – Storage and backend utilities  
- **Tailwind CSS** – Utility-first styling  
- **Framer Motion** – Smooth UI animations  
- **Socket.io** – Real-time chat  
- **ShadCN UI** – Accessible and customizable UI components  
- **Clerk** – Secure user authentication and user management

---

## 🔥 Features

- 📝 Create **Posts**, **Stories**, and **Reels**  
- 💬 **Real-time Chat** with online status  
- 🔎 **Advanced Search** for users and content  
- ❤️ Like, comment, and follow users  
- 🔄 **Live updates** on likes, followers, and new messages  
- 🧾 Clean, responsive UI with smooth animations  
- 🔐 Authentication and user profiles via Clerk

---

## 🧠 Why Pinggo?

Pinggo is designed to mimic the core features of popular social platforms while also providing a clean codebase to learn from or contribute to. It demonstrates integration of real-time systems, modern design systems, scalable data handling, and user-friendly UX patterns.

---

## 📦 Installation

```bash
git clone https://github.com/firaSE-16/pinggo.git
cd pinggo
npm install
npx prisma generate
npx prisma migrate dev
npm run dev


NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/registration
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/registration

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/home
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/registration


UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

DATABASE_URL=
