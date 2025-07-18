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

## 📸 Screenshots

> _Coming Soon..._

---

## 📁 Project Structure
pinggo/
├── 📁 .git/                          # Git version control
├── 📁 .next/                         # Next.js build output
├── 📁 node_modules/                  # Dependencies
├── 📁 prisma/                        # Database schema and migrations
│   ├── 📁 migrations/
│   │   ├── �� 20250706110642_/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── 📁 public/                        # Static assets
│   ├── default-avatar.png
│   ├── 📁 developerimage/            # Developer profile images
│   │   ├── person.jpg
│   │   ├── person1.jpg
│   │   ├── person2.jpg
│   │   ├── person3.jpg
│   │   ├── person4.jpg
│   │   ├── story1.jpg
│   │   ├── story10.jpg
│   │   ├── story2.jpg
│   │   ├── story4.jpg
│   │   ├── story5.jpg
│   │   ├── story6.jpg
│   │   ├── story7.jpg
│   │   ├── story8.jpg
│   │   └── story9.jpg
│   ├── 📁 devvideo/                  # Video content
│   │   ├── pin1.mp4
│   │   ├── pin2.mp4
│   │   ├── pin3.mp4
│   │   ├── pin4.mp4
│   │   ├── pin5.mp4
│   │   ├── pin6.mp4
│   │   ├── pin7.mp4
│   │   └── pin8.mp4
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── 📁 src/                           # Source code
│   ├── 📁 app/                       # Next.js App Router
│   │   ├── 📁 (auth)/                # Authentication routes
│   │   │   ├── 📁 registration/
│   │   │   │   └── page.tsx
│   │   │   ├── �� sign-in/
│   │   │   │   └── page.tsx
│   │   │   └── �� sign-up/
│   │   │       └── page.tsx
│   │   ├── 📁 (landing-page)/        # Landing page
│   │   │   └── page.tsx
│   │   ├── 📁 (main)/                # Main application routes
│   │   │   ├── �� bookmarks/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 channels/
│   │   │   │   └── page.tsx
│   │   │   ├── �� chat/              # Chat functionality
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── �� chats/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 dasboard/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 events/
│   │   │   │   └── page.tsx
│   │   │   ├── �� explore/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 home/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── �� liverooms/
│   │   │   │   └── page.tsx
│   │   │   ├── �� other-details/
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── �� profile/           # User profile management
│   │   │   │   ├── 📁 activity/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── 📁 edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── �� new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── 📁 settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── �� story/
│   │   │   └── 📁 reels/
│   │   │       └── page.tsx
│   │   ├── 📁 api/                   # API routes
│   │   │   ├── �� event/
│   │   │   │   └── route.ts
│   │   │   ├── �� explore/
│   │   │   │   └── route.ts
│   │   │   ├── 📁 follow/
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── route.ts
│   │   │   ├── �� message/
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── 📁 partners/
│   │   │   │       └── route.ts
│   │   │   ├── �� notifications/
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── 📁 settings/
│   │   │   ├── 📁 other-detail/
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── route.ts
│   │   │   ├── �� post/              # Post management
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   ├── �� comment/
│   │   │   │   │   │   └── �� [commenterId]/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── 📁 like/
│   │   │   │   │       └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── �� profile/           # Profile API
│   │   │   │   ├── �� story/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── �� user-detail/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── 📁 user-event/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── �� user-post/
│   │   │   │   │   └── route.ts
│   │   │   │   └── �� user-reel/
│   │   │   │       └── route.ts
│   │   │   ├── �� reels/
│   │   │   │   └── route.ts
│   │   │   ├── 📁 registration/
│   │   │   │   └── route.ts
│   │   │   ├── �� story/
│   │   │   │   └── route.ts
│   │   │   ├── �� uploadthing/       # File upload service
│   │   │   │   ├── core.ts
│   │   │   │   └── route.ts
│   │   │   ├── 📁 user/
│   │   │   │   └── �� check-registration/
│   │   │   └── �� user-detail/
│   │   ├── 📁 auth-check/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── 📁 components/                # Reusable components
│   │   ├── chat.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── ChatList.tsx
│   │   ├── ExploreGrid.tsx
│   │   ├── FloatingActionBar.tsx
│   │   ├── 📁 Global/
│   │   │   └── mode-toggle.tsx
│   │   ├── icons.tsx
│   │   ├── loading.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── mediaUploadForm.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── OpenStory.tsx
│   │   ├── particle.tsx
│   │   ├── PerformanceMonitor.tsx
│   │   ├── post.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── reels.tsx
│   │   ├── sidebar.tsx
│   │   ├── 📁 skeletons/             # Loading skeletons
│   │   │   ├── HomeSkeleton.tsx
│   │   │   └── UniversalSkeleton.tsx
│   │   ├── 📁 store/                 # State management
│   │   │   └── story.ts
│   │   ├── story.tsx
│   │   ├── suggestion.tsx
│   │   ├── theme-provider.tsx
│   │   ├── 📁 ui/                    # UI components (shadcn/ui)
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── command.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   ├── user-post.tsx
│   │   └── userList.tsx
│   ├── �� constants/
│   │   └── constant.ts
│   ├── 📁 generated/                 # Generated files
│   ├── 📁 hooks/                     # Custom React hooks
│   │   ├── useChat.ts
│   │   ├── useChatList.ts
│   │   ├── useNotifications.ts
│   │   ├── useOptimizedQueries.ts
│   │   ├── useOtherProfile.ts
│   │   ├── usePost.ts
│   │   ├── useProfile.ts
│   │   ├── userReel.ts
│   │   ├── useSearch.ts
│   │   └── useStroy.ts
│   ├── 📁 lib/                       # Utility libraries
│   │   ├── api.ts
│   │   ├── db.ts
│   │   ├── socket.ts
│   │   └── utils.ts
│   ├── middleware.ts                 # Next.js middleware
│   ├── server.ts                     # Server configuration
│   ├── 📁 services/                  # Business logic services
│   │   ├── activityService.ts
│   │   ├── chatService.ts
│   │   ├── eventService.ts
│   │   ├── geolocaltionService.ts
│   │   ├── notificationService.ts
│   │   ├── postService.ts
│   │   ├── profileService.ts
│   │   ├── reelService.ts
│   │   ├── registrationService.ts
│   │   ├── storyService.ts
│   │   └── useOtherService.ts
│   ├── 📁 store/                     # State management
│   │   └── chatStore.ts
│   ├── tailwind.config.ts            # Tailwind CSS configuration
│   └── 📁 utils/                     # Utility functions
│       └── uploadthing.ts
├── 📄 .gitignore                     # Git ignore rules
├── 📄 components.json                # shadcn/ui configuration
├── 📄 eslint.config.mjs              # ESLint configuration
├── 📄 next-env.d.ts                  # Next.js TypeScript definitions
├── 📄 next.config.ts                 # Next.js configuration
├── 📄 package-lock.json              # Dependency lock file
├── 📄 package.json                   # Project dependencies and scripts
├── �� postcss.config.mjs             # PostCSS configuration
├── 📄 README.md                      # Project documentation
├── 📄 seed-users.js                  # Database seeding script
├── 📄 tsconfig.json                  # TypeScript configuration
└── 📄 UPLOADTHING_SETUP.md           # UploadThing setup documentation




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
