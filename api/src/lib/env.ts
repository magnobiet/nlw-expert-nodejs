import z from "zod";

const envSchema = z.object({
  ENVIRONMENT: z.string(),
  APP_PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string(),
  COOKIES_SECRET_KEY: z.string(),
});

export const ENV = envSchema.parse(process.env);
