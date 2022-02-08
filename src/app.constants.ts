import Joi from "joi";

export enum Envs {
  // Webserver
  NodeEnv = "NODE_ENV",
  Port = "PORT",
  Version = "npm_package_version",
  LogLevel = "LOG_LEVEL",

  // DB
  DBHost = "DB_HOST",
  DBPort = "DB_PORT",
  DBName = "DB_NAME",
  DBUsername = "DB_USERNAME",
  DBPassword = "DB_PASSWORD",
  DBDebug = "DB_DEBUG",
  DBGCP = "DB_GCP", // Is Google Cloud SQL
}
const optionalBoolean = Joi.boolean();

export const EnvsSchema = Joi.object({
  [Envs.NodeEnv]: Joi.string()
    .valid("development", "staging", "production", "test")
    .default("development"),
  [Envs.Port]: Joi.number().default(5000),
  [Envs.LogLevel]: Joi.string().default("debug"),

  [Envs.DBHost]: Joi.string().default("localhost"),
  [Envs.DBPort]: Joi.number().min(1000).max(999999).default(5432),
  [Envs.DBName]: Joi.string().default("postgres"),
  [Envs.DBUsername]: Joi.string().default("postgres"),
  [Envs.DBPassword]: Joi.string().default("mylocaldbpassword"),
  [Envs.DBDebug]: optionalBoolean,
});
