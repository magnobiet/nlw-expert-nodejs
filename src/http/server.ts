import fastify from "fastify";
import { index } from "./routes";
import { createPoll } from "./routes/poll/create";

const app = fastify();

app.register(index);
app.register(createPoll);

app.listen({ port: 3333 }).then(() => {
  console.info("HTTP server running!");
});
