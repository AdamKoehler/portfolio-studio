# Portfolio Studio
# https://www.3dportfol.io/
A modern, interactive portfolio platform that allows users to create and showcase their work with customizable 3D themes. Built with Next.js, Three.js, Typescript, and MongoDB.


## Features

- 🎨 Choose from a selection of 3D scenes (Space, Ocean, Forest)
- 👤 User authentication with email verification
- 🔑 OAuth verification via Google or GitHub
- 📊 View analytics and tracking
- 🖼️ Project management with image uploads
- 🔗 Custom URL creation for user portfolios
- 📱 Responsive design
- 📧 Contact form integration

## Tech Stack

- **Frontend:**
  - Next.js 15
  - React 19
  - Three.js
  - TailwindCSS
  - ShadcnUI
  - React Three Fiber

- **Backend:**
  - Next.js API Routes
  - Prisma
  - MongoDB
  - NextAuth.js

- **Other Tools:**
  - Cloudinary (Image hosting)
  - Resend (Email service)
  - Vercel Analytics
    

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AdamKoehler/portfolio-studio.git
   cd portfolio-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your_mongodb_url"
   NEXTAUTH_SECRET="your_secret"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
   RESEND_API_KEY="your_resend_api_key"
   ```

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
portfolio-studio/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── themes/            # 3D portfolio themes
│   └── [username]/        # Dynamic portfolio pages
├── components/            # Reusable components
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── public/                # Static assets
```

## Database Schema

The application uses MongoDB with the following main models:
- **User**: Stores user information and authentication details
- **Portfolio**: Contains user details, projects, and view analytics
- **Project**: Manages individual projects within portfolios
- **VerificationToken**: Handles email verification
