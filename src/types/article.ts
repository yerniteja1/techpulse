import { z } from "zod";

export const SourceSchema = z.object({
  name: z.string(),
});

export const ArticleSchema = z.object({
  source: SourceSchema,
  title: z.string(),
  description: z.string().nullable(),
  content: z.string().nullable(),
  url: z.string().url(),
  image: z.string().url().nullable(),
  publishedAt: z.string(),
  author: z.string().nullable().optional(),
});

export const GNewsResponseSchema = z.object({
  totalArticles: z.number(),
  articles: z.array(ArticleSchema),
});

export type Source = z.infer<typeof SourceSchema>;
export type Article = z.infer<typeof ArticleSchema>;

export type NewsResponse = {
  totalResults: number;
  articles: Article[];
};

export type Category = "technology" | "artificial-intelligence" | "startups" | "cybersecurity";
