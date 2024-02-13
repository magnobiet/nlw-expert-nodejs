import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import "dotenv/config";
import fastify from "fastify";
import { ENV } from "../lib/env";
import { root } from "./routes";
import { pollsIndex } from "./routes/poll";
import { createPoll } from "./routes/poll/create";
import { destroyPoll } from "./routes/poll/destroy";
import { showPoll } from "./routes/poll/show";
import { voteOnPoll } from "./routes/poll/vote";
import { pollResults } from "./ws/poll-results";

const app = fastify();

app.register(cookie, {
  secret: ENV.COOKIES_SECRET_KEY,
  hook: "onRequest",
} as FastifyCookieOptions);

app.register(websocket);

app.register(cors, { origin: true });

// Routes
app.register(root);

app.register(pollsIndex);
app.register(createPoll);
app.register(showPoll);
app.register(destroyPoll);
app.register(voteOnPoll);
app.register(pollResults);

app.listen({ port: ENV.APP_PORT || 3333 }).then(() => {
  console.info("🚀 HTTP server running!");
});
