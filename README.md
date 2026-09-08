# 🚀 GitHubStats

A production-grade, unified serverless API and card generator for your GitHub Profile README. Every GitHub stat tool is available as an independent, high-performance endpoint deployable on **Vercel** and backed by **Supabase PostgreSQL**.

---

## ✨ Features & Available Endpoints

Every tool is accessible as both an **interactive SVG card** (for direct embedding into GitHub markdown) and a **JSON API** (`format=json`).

| Endpoint | Tool Name | Description | Output Formats |
| :--- | :--- | :--- | :--- |
| `/api/stats` | **Overview Stats Card** | Stars, Commits, PRs, Issues, and calculated Dev Grade ring badge (S+, S, A, B, C) | SVG, JSON |
| `/api/streak` | **Streak & Contribution Habits** | Current active streak, longest streak record, annual total contributions, and animated flame | SVG, JSON |
| `/api/top-langs` | **Top Languages** | Multi-color segmented progress bar and percentage breakdown of most used languages | SVG, JSON |
| `/api/activity-graph` | **Activity Graph** | Smooth cubic Bezier spline curve of contributions over the last 30 days | SVG, JSON |
| `/api/trophies` | **Gamified Trophies** | Prestige ranks (SSS, SS, S, A, B, C) across 6 skill categories | SVG, JSON |
| `/api/summary` | **Developer Summary** | Consolidated card with bio, key stats, rank badge, and top languages | SVG, JSON |
| `/api/calendar-3d` | **3D Isometric Calendar** | 3D isometric perspective representation of the user's contribution grid | SVG, JSON |
| `/api/achievements` | **GitHub Achievements** | Official-style achievements (Pull Shark, Quickdraw, Starstruck, Galaxy Brain, YOLO) | SVG, JSON |
| `/api/prs` | **Pull Requests & Reviews** | PRs created, merged, closed, review turnaround, and merge acceptance rate | SVG, JSON |
| `/api/issues` | **Issues & Discussions** | Issues opened, closed, resolution rate, and community participation | SVG, JSON |
| `/api/wakatime` | **WakaTime Coding Time** | Time tracked in editors (VS Code, Neovim), active hours, and languages | SVG, JSON |
| `/api/counter` | **Profile View Counter** | Atomic visitor hit counter stored in Supabase PostgreSQL | SVG, JSON |
| `/api/health` | **Health & Diagnostics** | PostgreSQL latency, platform stats, and system status | JSON |

---

## 🎨 Themes & Customization

Customize any card using query parameters:

* `theme`: `default` (GitHub Dark), `radical`, `dracula`, `tokyonight`, `catppuccin`, `cyberpunk`, `nord`, `synthwave`, `vue`, `emerald`, `midnight`, `light`
* `hide_border`: `true` or `false`
* `border_radius`: custom corner radius in pixels (e.g. `border_radius=8`)
* `bg_color`, `border_color`, `title_color`, `text_color`, `icon_color`: hex colors without `#` (e.g. `bg_color=0d1117`)
* `format`: `svg` (default) or `json`

### Embed Examples

#### 1. Overview Stats Card
```markdown
![GitHub Stats](https://gitstats.dileepadari.dev/api/stats?username=torvalds&theme=radical)
```

#### 2. Streak Card
```markdown
![GitHub Streak](https://gitstats.dileepadari.dev/api/streak?username=torvalds&theme=tokyonight)
```

#### 3. Top Languages Card
```markdown
![Top Languages](https://gitstats.dileepadari.dev/api/top-langs?username=torvalds&theme=dracula)
```

#### 4. Activity Graph Curve
```markdown
![Activity Graph](https://gitstats.dileepadari.dev/api/activity-graph?username=torvalds&theme=cyberpunk)
```

#### 5. Profile View Counter
```markdown
![Profile Views](https://gitstats.dileepadari.dev/api/counter?username=torvalds&style=pill)
```

---

## 🗄️ PostgreSQL Database (Supabase)

This repository includes built-in integration with PostgreSQL (Supabase or self-hosted PostgreSQL) for:
1. **Atomic Profile View Counting**: Automatically increments view counts on hits and tracks unique timestamps and referrers.
2. **High-Performance Caching**: Caches GitHub GraphQL/REST responses with configurable TTL (1 hour default) to prevent rate-limit exhaustion and ensure response times under 50ms.

Tables managed automatically:
* `github_profile_views` (username, views, last_viewed_at)
* `github_view_logs` (username, ip_hash, user_agent, referrer, viewed_at)
* `github_stats_cache` (cache_key, data, updated_at, expires_at)

---

## 🚀 Deployment to Vercel

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the Environment Variables in the Vercel Project Settings:

| Key | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@your-host:5432/postgres` |
| `GITHUB_TOKEN` | GitHub Personal Access Token (for 5,000 req/hr rate limit) | `ghp_xxxxxxxxxxxxxxxxxxxx` |

4. Click **Deploy**. Vercel will build the Next.js app and deploy all serverless functions under `/api/*`.

---

## 💻 Local Development

```bash
# Clone the repository
git clone <repo-url>
cd GitHubStats

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# (Edit .env.local with your GITHUB_TOKEN and DATABASE_URL)

# Run development server
npm run dev

# Open http://localhost:3000 to access the interactive web playground
```

---

## 🧪 Build Verification

```bash
# Verify TypeScript and build production bundle
npm run build
```

---

## 📄 License
MIT License
