import { Module, NotFoundException } from "@nestjs/common";
import { LoggerModule, Logger } from "nestjs-pino";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { IPrimaryKey } from "@mikro-orm/core";
import { inspect } from "util";
import { Envs, EnvsSchema } from "./app.constants";
import mikroOrmConfig from "./mikro-orm.config";
import { AppController } from "./app.controller";

// eslint-disable-next-line no-control-regex
const removeANSIRegex =
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvsSchema,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: { level: configService.get<string>(Envs.LogLevel) },
      }),
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService, Logger],
      useFactory: (configService: ConfigService, logger: Logger) => ({
        ...mikroOrmConfig,

        debug: configService.get(
          Envs.DBDebug,
          configService.get(Envs.NodeEnv) === "development"
        ),

        type: "postgresql",
        host: configService.get(Envs.DBHost, "localhost"),
        dbName: configService.get(Envs.DBName, "postgres"),
        user: configService.get(Envs.DBUsername, "postgres"),
        password: configService.get(Envs.DBPassword, "mylocaldbpassword"),

        logger: (msg) =>
          logger.debug(msg.replace(removeANSIRegex, ""), "Mikro-ORM"),

        findOneOrFailHandler: (
          entityName: string,
          where: Record<string, unknown> | IPrimaryKey
        ) =>
          new NotFoundException(
            `${entityName} not found with ${inspect(where)}`
          ),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
