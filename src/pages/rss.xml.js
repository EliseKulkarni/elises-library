import rss from "@astrojs/rss";
import { getBooks } from "../lib/books";
import { SITE_NAME } from "../lib/site";

export async function GET(context) {
  const books = await getBooks();
  const base = import.meta.env.BASE_URL;

  return rss({
    title: SITE_NAME,
    description: "Short, honest book reviews, pulled automatically from Notion.",
    site: new URL(base, context.site).href,
    customData: "<language>en</language>",
    items: books.map((book) => {
      const { title, headline, author, rating, essensen, teaser, tags, dateAdded } = book.data;
      const byline = [author && `${title} by ${author}`, rating !== null && `★ ${rating}/10`].filter(Boolean).join(" · ");
      const summary = essensen ?? teaser ?? `Review of ${title}`;
      return {
        title: headline ?? title,
        description: byline ? `${byline}. ${summary}` : summary,
        pubDate: dateAdded,
        link: `${base}book/${book.id}/`,
        categories: tags,
      };
    }),
  });
}
