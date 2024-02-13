import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../../lib/prisma";
import { redis } from "../../../lib/redis";
import { voting } from "../../../utils/voting-pub-sub";

function publishVote(
  pollId: string,
  pollOptionId: string,
  votes: number
): void {
  voting.publish(pollId, { pollOptionId, votes });
}

export async function voteOnPoll(app: FastifyInstance) {
  app.post(
    "/polls/:pollId/votes",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const voteOnPollParams = z.object({ pollId: z.string().uuid() });
      const voteOnPollBody = z.object({ pollOptionId: z.string().uuid() });
      const voteOnPollHeaders = z.object({ authorization: z.string().uuid() });

      const { authorization } = voteOnPollHeaders.parse(request.headers);
      const { pollId } = voteOnPollParams.parse(request.params);
      const { pollOptionId } = voteOnPollBody.parse(request.body);

      const user = await prisma.user.findUnique({
        where: { id: authorization, deletedAt: null },
        select: { id: true },
      });

      if (!authorization || authorization !== user?.id) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const previousUserVoteOnPoll = await prisma.vote.findUnique({
        where: { userId_pollId: { userId: authorization, pollId } },
      });

      if (
        previousUserVoteOnPoll &&
        previousUserVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        await prisma.vote.delete({ where: { id: previousUserVoteOnPoll.id } });

        const votes = await redis.zincrby(
          pollId,
          -1,
          previousUserVoteOnPoll.pollOptionId
        );

        publishVote(pollId, previousUserVoteOnPoll.pollOptionId, Number(votes));
      } else if (previousUserVoteOnPoll) {
        return reply
          .status(400)
          .send({ message: "You already voted on this poll" });
      }

      await prisma.vote.create({
        data: { userId: authorization, pollId, pollOptionId },
      });

      const votes = await redis.zincrby(pollId, 1, pollOptionId);

      publishVote(pollId, pollOptionId, Number(votes));

      return reply.status(201).send();
    }
  );
}
