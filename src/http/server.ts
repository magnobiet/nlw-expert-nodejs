import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import "dotenv/config";
import fastify from "fastify";
import { ENV } from "../lib/env";
import { index } from "./routes";
import { createPoll } from "./routes/poll/create";
import { showPoll } from "./routes/poll/show";
import { voteOnPoll } from "./routes/poll/vote";

const app = fastify();

app.register(cookie, {
  secret: ENV.COOKIES_SECRET_KEY,
  hook: "onRequest",
} as FastifyCookieOptions);

app.register(index);

app.register(createPoll);
app.register(showPoll);
app.register(voteOnPoll);

app.listen({ port: ENV.APP_PORT || 3333 }).then(() => {
  console.info("🚀 HTTP server running!");
});
