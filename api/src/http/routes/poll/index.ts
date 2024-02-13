import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function pollsIndex(app: FastifyInstance) {
  app.get("/polls", async (request: FastifyRequest, reply: FastifyReply) => {
    const pollsIndexQueryParams = z.object({
      skip: z.string().regex(/^\d+$/).transform(Number).optional(),
      take: z.string().regex(/^\d+$/).transform(Number).optional(),
    });

    const { skip, take } = pollsIndexQueryParams.parse(request.query);

    const polls = await prisma.poll.findMany({
      skip,
      take,
      select: { id: true, title: true },
      orderBy: { createdAt: "asc" },
    });

    return reply.status(200).send(polls);
  });
}
