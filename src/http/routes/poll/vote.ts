import { randomUUID } from "crypto";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";

export async function voteOnPoll(app: FastifyInstance) {
  app.post(
    "/polls/:pollId/votes",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const voteOnPollParams = z.object({ pollId: z.string().uuid() });
      const voteOnPollBody = z.object({ pollOptionId: z.string().uuid() });

      const { pollId } = voteOnPollParams.parse(request.params);
      const { pollOptionId } = voteOnPollBody.parse(request.body);

      let { sessionId } = request.cookies;

      if (sessionId) {
        const previousUserVoteOnPoll = await prisma.vote.findUnique({
          where: { sessionId_pollId: { sessionId, pollId } },
        });

        if (
          previousUserVoteOnPoll &&
          previousUserVoteOnPoll.pollOptionId !== pollOptionId
        ) {
          await prisma.vote.delete({
            where: { id: previousUserVoteOnPoll.id },
          });
        } else if (previousUserVoteOnPoll) {
          return reply
            .status(400)
            .send({ message: "You already voted on this poll" });
        }
      }

      if (!sessionId) {
        sessionId = randomUUID();

        reply.setCookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          signed: true,
          httpOnly: true,
        });
      }

      await prisma.vote.create({ data: { sessionId, pollId, pollOptionId } });

      return reply.status(201).send();
    }
  );
}