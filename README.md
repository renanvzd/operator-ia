# DevRoast

**Brutally honest code reviews powered by AI.**

Paste your code, get roasted. DevRoast analyzes your code and delivers brutally honest feedback about what's wrong, why it's wrong, and how to make it better.

## Features

- **AI-Powered Code Analysis** — Submit your code and receive instant, detailed feedback
- **Leaderboard** — See how your code ranks against others
- **Roast Mode** — Get the full brutal truth about your code quality
- **Multiple Language Support** — Works with JavaScript, TypeScript, Python, and more

## Getting Started

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
pnpm install

# Start the database
docker compose up -d

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

The project uses PostgreSQL + Drizzle ORM.

```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

Local database connection lives in `.env.local`:

```bash
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

## How It Works

1. Paste your code into the editor
2. Toggle "roast mode" for extra honesty
3. Click "roast_my_code" to get your review
4. Check the leaderboard to see how you rank

## Tech Stack

- Next.js
- Tailwind CSS
- Drizzle ORM
- PostgreSQL
- Base UI
- Shiki (syntax highlighting)

## License

MIT
