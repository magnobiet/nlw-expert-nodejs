import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function destroyPoll(app: FastifyInstance) {
  app.delete(
    "/polls/:pollId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const pollsIndexQueryParams = z.object({
        pollId: z.string(),
      });

      const { pollId } = pollsIndexQueryParams.parse(request.params);

      const polls = await prisma.poll.delete({ where: { id: pollId } });

      return reply.status(204).send(polls);
    }
  );
}
