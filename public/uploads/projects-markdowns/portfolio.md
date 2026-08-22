## Project Overview

This project is the site you're currently on — a modern portfolio and blog platform built from scratch to showcase my work, write technical articles, and manage everything through a custom admin dashboard rather than a third-party CMS.

🌐 [Live Demo](https://www.ayoubomari.com) · 💻 [Source on GitHub](https://github.com/ayoubomari/portfolio)

## Why Build a Custom Portfolio

Off-the-shelf portfolio templates are quick to set up but rarely fit exactly how I want to present projects, write long-form technical posts, or manage content day to day. Building it myself meant full control over the data model, the editing workflow, and the performance of the public-facing pages.

## Features

- 📝 **Blog system** — write and publish posts with Markdown support
- 🎨 **Project showcase** — detailed case studies for each project, with tags, technologies, and image galleries
- 📬 **Contact form** — with email notifications on new submissions
- 📊 **Admin dashboard** — full CRUD for blog posts, projects, tags, and technologies
- 📱 **Responsive design** — usable across desktop, tablet, and mobile
- 🌙 **Dark mode** — light/dark theme toggle
- 📨 **Newsletter system** — email subscription capture

## Technical Implementation

### Backend

- **Framework**: Next.js 14 (App Router, API routes)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Lucia Auth, session-based
- **Email**: Nodemailer for contact form and admin notifications

### Frontend

- **Styling**: Tailwind CSS
- **UI components**: Shadcn UI
- **Charts**: Recharts (dashboard analytics)
- **Markdown rendering**: React Markdown

## Architecture Highlights

- Server-rendered project and blog pages for SEO, with structured data (JSON-LD) for rich search results
- A relational schema (projects, blog posts, tags, technologies, images) with many-to-many join tables so content can be tagged and cross-referenced flexibly
- A dashboard that lets me manage every table without touching the database directly

## Conclusion

The portfolio is a living project — it evolves alongside the rest of my work, and doubles as a testbed for patterns (auth, dashboards, content modeling) I reuse in client projects like Ruxaby and Lahagni.
