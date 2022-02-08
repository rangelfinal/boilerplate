import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { fastifyHelmet } from "fastify-helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Envs } from "./app.constants";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      bufferLogs: true,
      cors: {
        exposedHeaders: ["Content-Range"],
        origin: "*",
      },
    }
  );

  // Register fastify helmet
  // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-argument
  app.register(fastifyHelmet as any, { contentSecurityPolicy: false });

  const config = new DocumentBuilder()
    .setTitle("HomeNurse API")
    .setVersion(process.env[Envs.Version] ?? "0.0.1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.HOME_NURSE_BACKEND_PORT ?? process.env.PORT ?? 5000;
  const portNumber = Number(port);

  await app.listen(portNumber, "0.0.0.0");
}

bootstrap(); // eslint-disable-line @typescript-eslint/no-floating-promises
