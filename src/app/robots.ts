import type { MetadataRoute } from "next";

/**
 * Robots policy.
 *
 * Public surface: allow everything except API + internal paths.
 *
 * AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
 * get explicit allow rules. This is technically redundant — they'd be
 * covered by the wildcard — but stating them by name is the convention
 * search-engine + answer-engine teams look for, and it documents intent
 * to the LLM platforms that we WANT to be cited in AI answers.
 *
 * Companion: /llms.txt at site root carries a curated brand description
 * for ingestion (per the proposed llmstxt.org standard).
 */
export default function robots(): MetadataRoute.Robots {
  const SHARED_BLOCKED = ["/api/", "/_next/", "/agents/"];

  return {
    rules: [
      // Wildcard — covers search engines + any unknown crawler.
      {
        userAgent: "*",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      // OpenAI (GPT models).
      // https://platform.openai.com/docs/gptbot
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      // Anthropic (Claude).
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      // Perplexity.
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      // Google Gemini / AI Overviews — distinct from Googlebot. Opting
      // IN here so we surface in AI snapshots, not just web results.
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      // Apple Intelligence.
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: SHARED_BLOCKED,
      },
      // You.com / Bing Copilot / Meta AI all defer to the wildcard
      // rule above — no per-bot block needed for those.
    ],
    sitemap: "https://onyxcreative.asia/sitemap.xml",
    host: "https://onyxcreative.asia",
  };
}
