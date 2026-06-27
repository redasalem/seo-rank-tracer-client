# ✨ RankBoost - Frontend

The sleek, modern user interface for the RankBoost application. Built with React, Vite, and Tailwind CSS to provide a fast and responsive user experience for tracking search engine rankings and analyzing SEO metrics.

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<div align="center">
  <br/>
  <a href="https://seo-rank-tracer-client.vercel.app" target="_blank"><strong>🌐 Live Frontend Demo</strong></a>
</div>

## 🚀 Features

- **📊 Dashboard:** Comprehensive overview of your tracked keywords and their current search engine rankings.
- **⚡ Real-time Tracking:** Monitor keyword positions and see historical changes.
- **🔍 SEO Analysis:** Trigger deep SEO analysis for specific URLs and get actionable insights.
- **🔐 Secure Authentication:** Seamless login and registration flows.
- **📱 Responsive Design:** A beautiful, glassmorphic UI that works flawlessly on both desktop and mobile devices.

## 🛠 Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4.0
- **Routing:** React Router v7
- **State Management / Data Fetching:** Axios
- **UI Components & Icons:** Lucide React & Simple Icons
- **Notifications:** React Hot Toast

## 🏃‍♂️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/redasalem/seo-rank-tracer-frontend.git
   cd seo-rank-tracer-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the backend API URL:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be running at `http://localhost:5173`.

## 📦 Build for Production

To create an optimized production build:
```bash
npm run build
```

## 🚀 Deployment (Vercel)

This project is optimized for deployment on Vercel:
1. Connect your GitHub repository to Vercel.
2. Select the framework preset as **Vite**.
3. Add the `VITE_BACKEND_URL` environment variable pointing to your deployed backend.
4. Click **Deploy**.
