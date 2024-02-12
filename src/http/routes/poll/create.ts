import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request: FastifyRequest, reply: FastifyReply) => {
    const createPollBody = z.object({ title: z.string() });

    const { title } = createPollBody.parse(request.body);
    const { id } = await prisma.pool.create({ data: { title } });

    return reply.status(201).send({ id });
  });
}
