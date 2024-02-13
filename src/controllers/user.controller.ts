import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";

interface User extends Prisma.UserCreateInput {}

export class UserController {
  public async index(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Array<Pick<User, "id" | "name" | "email">>> {
    const userIndexQueryParams = z.object({
      skip: z.string().regex(/^\d+$/).transform(Number).optional(),
      take: z.string().regex(/^\d+$/).transform(Number).optional(),
    });
    const { skip, take } = userIndexQueryParams.parse(request.query);

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      where: { deletedAt: null },
      orderBy: { createdAt: "asc" },
      skip,
      take,
    });

    return reply.status(200).send(users);
  }

  public async store(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Pick<User, "id">> {
    const userStoreBody = z.object({ name: z.string(), email: z.string() });
    const { name, email } = userStoreBody.parse(request.body);

    try {
      const { id } = await prisma.user.create({
        data: { name, email },
        select: { id: true },
      });

      return reply.status(201).send({ id });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return reply.status(500).send({ message: "User already exists" });
      }

      throw error;
    }
  }

  public async show(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Pick<User, "id" | "name" | "email"> | null> {
    const userShowParams = z.object({ userId: z.string().uuid() });
    const { userId } = userShowParams.parse(request.params);

    const user = await prisma.user.findUnique({
      select: { id: true, name: true, email: true },
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      return reply.status(400).send({ message: "User not found" });
    }

    return reply.status(200).send(user);
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Omit<User, "deletedAt" | "vote">> {
    const userUpdateParams = z.object({ userId: z.string() });
    const userUpdateBody = z.object({ name: z.string() });

    const { userId } = userUpdateParams.parse(request.params);
    const { name } = userUpdateBody.parse(request.body);

    try {
      const user = await prisma.user.update({
        data: { name, updatedAt: new Date() },
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return reply.status(200).send(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return reply.status(400).send({ message: "User not found" });
      }

      throw error;
    }
  }

  public async destroy(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Pick<User, "id">> {
    const userDestroyParams = z.object({ userId: z.string() });
    const { userId } = userDestroyParams.parse(request.params);

    try {
      await prisma.user.update({
        data: { deletedAt: new Date() },
        where: { id: userId, deletedAt: null },
        select: { id: true },
      });

      return reply.status(204).send();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return reply.status(400).send({ message: "User not found" });
      }

      throw error;
    }
  }
}
