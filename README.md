# Elise's Library

A static book blog that pulls reviews from Notion and rebuilds itself on a schedule.

Live: https://elisekulkarni.github.io/elises-library/

## Stack

- [Astro](https://astro.build) + TypeScript: static site generator
- Notion as the CMS (`@notionhq/client` + `notion-to-md`): no database, no backend
- Open Library API: looks up author and genre from the book title
- GitHub Actions (scheduled builds) + GitHub Pages (hosting)

## How it fits together

1. Write a review in Notion and mark the book `Ja` (finished) or `80%` (almost finished, summary written)
2. GitHub Actions runs every day (`.github/workflows/build-and-deploy.yml`). It fetches all books with those statuses from Notion, looks up author and genre, converts the review to Markdown, builds the Astro site and publishes it to GitHub Pages
3. The Action commits `data/books-cache.json` and `data/openlibrary-cache.json` back to the repo, so the next run only reprocesses books that actually changed (based on Notion's `last_edited_time`)

## Running locally

Requires [Node.js](https://nodejs.org) (LTS or newer).

```bash
npm install
```

Create a `.env` file (copy `.env.example`) with your own Notion integration token:

```
NOTION_TOKEN=ntn_...
NOTION_DATA_SOURCE_ID=29c9ef86-0d22-80e5-ab67-000b2fa83c62
```

Fetch books from Notion and generate the content:

```bash
npm run fetch:books
```

Start the local dev server:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
npm run preview
```

## Secrets in GitHub Actions

```bash
gh secret set NOTION_TOKEN
gh variable set NOTION_DATA_SOURCE_ID --body 29c9ef86-0d22-80e5-ab67-000b2fa83c62
```

GitHub Pages must use **GitHub Actions** as its source (not "Deploy from a branch").

## Adding more books

Nothing to do here: write the review in Notion and set the status to `Ja` or `80%`. The site updates within 24 hours, or right away if you run `gh workflow run build-and-deploy.yml`.

New reviews are treated as English. An older Norwegian review has `"language": "no"` in `data/overrides.json`, which labels it on the page and lets browsers offer translation.

## Fixing a title, cover, author or tags

Open Library sometimes guesses wrong (the wrong edition's cover, messy tags and so on). Fix it in `data/overrides.json`, using the Notion page ID as the key:

```json
"3e19ef86-0d22-8056-87d1-db101376a8fa": {
  "title": "The Most Important Thing",
  "author": "Howard Marks",
  "headline": "One good idea, said ten times",
  "coverUrl": "https://covers.openlibrary.org/b/id/10001222-M.jpg",
  "tags": ["Investing", "Risk"],
  "language": "no"
}
```

All fields are optional, and only the ones you fill in override anything. `title` only changes what is displayed; the page address (the slug) is still built from the Notion title, so existing links keep working.

Try to reuse existing tags (see `/tag/` on the site) so books on the same topic are grouped together.
