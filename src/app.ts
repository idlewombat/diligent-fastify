import fastify from "fastify";

type PostPetsRoute = {
  Body: { name: string; kind: "cat" | "dog" };
};

// JSON SCHEMA DEFINITIONS:

const beverageParamsSchema = {
  type: "object",
  properties: {
    drink: { enum: ["tea", "coffee", "chai"] },
  },
  required: ["drink"],
  additionalProperties: false,
};
// This schema defines the expected shape of the parameters in the /api/beverages/:drink route.
// It specifies that the drink parameter must be one of the enum values: "tea", "coffee", or "chai".
// -------------------------------------------------------------------------------------------------

const beverageQuerySchema = {
  type: "object",
  properties: {
    milk: { enum: ["yes", "no"] },
    sugar: { enum: ["yes", "no"] },
  },
  additionalProperties: false,
};
// This schema defines the expected shape of the query parameters.
// the milk and sugar query parameters must be one of the enum values: "yes" or "no".
// ----------------------------------------------------------------------------------

const beverageBodySchema = {
  type: "object",
  properties: {
    kind: { type: "string" },
  },
  required: ["kind"],
  additionalProperties: false,
};
// the expected shape of the request body.
// It specifies that the kind property must be a string.
// -----------------------------------------------------
//
/*These JSON schema definitions are useful for:

Validation: The schemas can be used to validate the incoming request data (parameters, query parameters, and request body) to ensure it matches the expected shape and data types. This helps catch errors early and provide better error messages to the client.
Documentation: The schemas serve as a clear and concise documentation of the expected data structure for the /api/beverages/:drink route. This makes it easier for developers to understand the API's requirements and integrate with it.
Automatic code generation: Some tools can use the JSON schemas to automatically generate client-side code (e.g., TypeScript types, API clients) or server-side code (e.g., route handlers, input validation) – reducing boilerplate and ensuring consistency across the codebase.
Data transformation: The schemas can be used to transform the incoming data into the expected shape before processing it in the route handler.*/
//
//
// define the shape of the route for /api/beverages/:drink endpoint:

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
// -----------------------------------------------------

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
        params: beverageParamsSchema,
        querystring: beverageQuerySchema,
        body: beverageBodySchema,
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
