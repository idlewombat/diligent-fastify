import fastify from "fastify";

type PostPetsRoute = {
  Body: { name: string; kind: "cat" | "dog" };
};

const paramsSchema = {
  type: "object",
  properties: {
    drink: { enum: ["tea", "coffee", "chai"] },
  },
  required: ["drink"],
  additionalProperties: false,
};

const querySchema = {
  type: "object",
  properties: {
    milk: { enum: ["yes", "no"] },
    sugar: { enum: ["yes", "no"] },
  },
  additionalProperties: false,
};

const bodySchema = {
  type: "object",
  properties: {
    kind: { type: "string" },
  },
  required: ["kind"],
  additionalProperties: false,
};

type PostBeveragesRoute = {
  Params: {
    drink: "coffee" | "tea" | "chai";
  };
  Querystring: {
    milk?: "yes" | "no";
    sugar?: "yes" | "no";
  };
  Body: {
    kind: string;
  };
  Reply: {
    drink: string;
    with: string[];
  };
};

export default function createApp(options = {}) {
  const app = fastify(options);

  app.get("/api/hello", (request, reply) => {
    reply.send({ hello: "World!" });
  });

  app.get("/api/good-bye", (request, reply) => {
    reply.send({ message: "Good Bye Visitor!" });
  });

  app.post<PostPetsRoute>("/api/pets", (request, reply) => {
    const pet = request.body;
  });

  app.post<PostBeveragesRoute>(
    "/api/beverages/:drink",
    {
      schema: {
        params: paramsSchema,
        querystring: querySchema,
        body: bodySchema,
      },
    },
    (request, reply) => {
      const { drink } = request.params;
      const { milk, sugar } = request.query;
      const { kind } = request.body;
      let with_ = [];
      if (milk === "yes") {
        with_.push("milk");
      }
      if (sugar === "yes") {
        with_.push("sugar");
      }
      reply.status(201).send({ drink: `${kind} ${drink}`, with: with_ });
    }
  );

  return app;
}
