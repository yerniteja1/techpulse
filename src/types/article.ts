import { z } from "zod";

export const SourceSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
});

export const ArticleSchema = z.object({
  source: SourceSchema,
  author: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string().url(),
  urlToImage: z.string().url().nullable(),
  publishedAt: z.string(),
  content: z.string().nullable(),
});

export const NewsResponseSchema = z.object({
  status: z.enum(["ok", "error"]),
  totalResults: z.number(),
  articles: z.array(ArticleSchema),
});

export const ErrorResponseSchema = z.object({
  status: z.literal("error"),
  code: z.string(),
  message: z.string(),
});

export type Source = z.infer<typeof SourceSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type NewsResponse = z.infer<typeof NewsResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export type Category = "technology" | "artificial-intelligence" | "startups" | "cybersecurity";
