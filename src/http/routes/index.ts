import { FastifyInstance } from "fastify";

export async function index(app: FastifyInstance) {
  app.get("/", () => {
    return { response: "Polls API" };
  });
}
