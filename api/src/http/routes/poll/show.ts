import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";
import { redis } from "../../../lib/redis";

function mapRedisResult(result: Array<string>): Record<string, number> {
  const votes = result.reduce((items, item, index) => {
    if (index % 2 === 0) {
      const votes = result[index + 1];

      Object.assign(items, { [item]: Number(votes) });
    }

    return items;
  }, {} as Record<string, number>);

  return votes;
}

export async function showPoll(app: FastifyInstance) {
  app.get(
    "/polls/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const showPollParams = z.object({ id: z.string().uuid() });

      const { id } = showPollParams.parse(request.params);

      const poll = await prisma.poll.findUnique({
        where: { id },
        include: { options: { select: { id: true, title: true } } },
      });

      if (!poll) {
        return reply.status(400).send({ message: "Poll not found" });
      }

      const result = await redis.zrange(poll.id, 0, -1, "WITHSCORES");
      const votes = mapRedisResult(result);

      return reply.status(200).send({
        ...poll,
        options: poll.options.map((option) => {
          return {
            ...option,
            votes: option.id in votes ? votes[option.id] : 0,
          };
        }),
      });
    }
  );
}
