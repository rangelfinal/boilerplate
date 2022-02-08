import { Options } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Envs } from "./app.constants";

const isGCP =
  process.env[Envs.DBGCP] === "true" ||
  (process.env[Envs.DBGCP] as string | boolean) === true;

const mikroOrmConfig: Options = {
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  metadataProvider: TsMorphMetadataProvider,

  migrations: {
    path: "src/migrations",
    safe: true,
    disableForeignKeys: !isGCP, // Should be false on Google Cloud SQL
  },

  type: "postgresql",
  host: process.env[Envs.DBHost] ?? "localhost",
  port: process.env[Envs.DBPort] ? Number(process.env[Envs.DBPort]) : 5432,
  dbName: process.env[Envs.DBName] ?? "postgres",
  user: process.env[Envs.DBUsername] ?? "postgres",
  password: process.env[Envs.DBPassword] ?? "mylocaldbpassword",
};

export default mikroOrmConfig;
