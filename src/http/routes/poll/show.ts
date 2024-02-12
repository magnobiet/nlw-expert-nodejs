import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function showPoll(app: FastifyInstance) {
  app.get(
    "/polls/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const showPollParams = z.object({
        id: z.string().uuid(),
      });

      const { id } = showPollParams.parse(request.params);

      const poll = await prisma.poll.findUnique({
        where: { id },
        include: { options: { select: { id: true, title: true } } },
      });

      return reply.status(200).send(poll);
    }
  );
}
