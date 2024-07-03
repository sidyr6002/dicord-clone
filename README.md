# Discord Clone

## Overview

This project is a clone of the popular communication platform Discord. Built using Next.js and React, it incorporates a variety of technologies to deliver a seamless, real-time communication experience. The application features text, audio, and video chat capabilities, member management, and a beautiful, responsive UI.

## Features

- **Real-time messaging using Socket.io**
- **Send attachments as messages using UploadThing**
- **Delete & Edit messages in real-time for all users**
- **Create Text, Audio, and Video call Channels**
- **1:1 conversation between members**
- **1:1 video calls between members using LiveKit**
- **Member management (Kick, Role change Guest / Moderator)**
- **Unique invite link generation & full working invite system**
- **Infinite loading for messages in batches of 10 (using Tanstack/Query)**
- **Server creation and customization**
- **Beautiful UI using TailwindCSS and ShadcnUI**
- **Full responsivity and mobile UI**
- **Light / Dark mode**
- **WebSocket fallback: Polling with alerts**
- **ORM using Prisma**
- **MySQL database using Planetscale**
- **Authentication with Clerk**

## Technologies Used

Next.js, React, Socket.io, Prisma, TailwindCSS, ShadcnUI, PostgreSQL, LiveKit, Clerk, UploadThing, Tanstack/Query

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sidyr6002/dicord-clone.git
   cd discord-clone
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following environment variables:
   ```env
   NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
   CLERK_API_KEY=<your-clerk-api-key>

   DATABASE_URL=<your-database-url>

   UPLOADTHING_SECRET=<your-uploadthing-secret>
   UPLOADTHING_APP_ID=<yout-uploadthing-appid>

   LIVEKIT_API_KEY=<your-livekit-api-key>
   LIVEKIT_API_SECRET=<your-livekit-api-secret>
   NEXT_PUBLIC_LIVEKIT_URL=<your-livekit-public-url>
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Creating an Account**: Sign up using Clerk authentication.
- **Server Creation**: Create and customize your servers.
- **Channel Creation** : Create and manage your channels. Add any channel of type text, audio and video
- **Messaging**: Send and receive real-time messages. Over a channel and also one-on-one
- **Voice and Video Calls**: Initiate and participate in audio and video calls.
- **Manage Members**: Add, kick, or change member roles.
- **Invite System**: Generate unique invite links for your server.
- **Edit/Delete Messages**: Edit or delete messages in real-time.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Socket.io](https://socket.io/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadcnUI](https://shadcn.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [LiveKit](https://livekit.io/)
- [Clerk](https://clerk.dev/)
- [UploadThing](https://uploadthing.com/)
- [Tanstack/Query](https://tanstack.com/query)
