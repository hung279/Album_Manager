import * as Joi from 'joi';

export default () => ({
  port: process.env.PORT || 8000,
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  reset_pass: {
    expiresIn: process.env.RESET_PASSWORD_EXPIRES,
  },
});

export const configValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  RESET_PASSWORD_EXPIRES: Joi.number().required(),
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
});
