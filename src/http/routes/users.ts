import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UserController } from "../../controllers/user.controller";

export async function usersRoute(app: FastifyInstance) {
  const service = new UserController();

  app.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
    return await service.index(request, reply);
  });

  app.post("/users", async (request: FastifyRequest, reply: FastifyReply) => {
    return await service.store(request, reply);
  });

  app.get(
    "/users/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return await service.show(request, reply);
    }
  );

  app.patch(
    "/users/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return await service.update(request, reply);
    }
  );

  app.delete(
    "/users/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return await service.destroy(request, reply);
    }
  );
}
