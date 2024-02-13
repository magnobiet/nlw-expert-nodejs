import { FastifyInstance } from "fastify";

export async function root(app: FastifyInstance) {
  app.get("/", () => {
    return { message: "Polls API" };
  });
}
