import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://elisekulkarni.github.io",
  base: "/elises-library/",
  integrations: [sitemap()],
});