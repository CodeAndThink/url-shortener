# URL Shortener

A simple web application that helps shorten long URLs into concise, easy-to-remember, and easily shareable links.

## 🚀 Key Features

- **URL Shortening:** Enter any long URL and instantly get a shortened link.
- **History Management:** Save a list of shortened URLs directly in the browser using IndexedDB.
- **Modern Design:** Utilizes a minimalist and elegant interface that works smoothly on all devices.

## 🛠️ Technologies Used

The project is built with modern technologies and libraries:

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - A powerful React framework.
- **Language:** [TypeScript](https://www.typescriptlang.org/) - For type-safe code.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
- **Form & Validation:**
  - [React Hook Form](https://react-hook-form.com/) - Efficient form state management.
  - [Zod](https://zod.dev/) - Safe schema and data validation.
- **Database & Backend:** [Supabase](https://supabase.com/) - Used to manage and process the short URL creation API.
- **Icons:** [Lucide React](https://lucide.dev/) - Beautiful and flexible icon set.

## 📂 Project Structure

Here is the main structure of the project:

```text
url-shortener/
├── app/                  # Contains pages, layouts, and global CSS (Next.js App Router)
│   ├── page.tsx          # Main application page (core logic)
│   ├── layout.tsx        # Main layout structure
│   └── globals.css       # CSS variables, resets, and global styles
├── components/           # Contains reusable UI components
│   ├── ui/               # Directory for basic UI components
│   └── Footer.tsx        # Footer component
├── hooks/                # Contains Custom React Hooks (e.g., useHistoryDB for IndexedDB)
├── public/               # Contains static assets like images, icons, fonts, etc.
├── styles/               # Other style files (if any)
└── package.json          # Project dependencies and scripts configuration
```

## ⚙️ Setup and Installation

### 1. Clone the repository

```bash
git clone <repository_url>
cd url-shortener
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env` or `.env.local` file in the root directory and provide your Supabase connection configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SHORTEN_URL=your_shorten_domain_url
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## 🌐 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
