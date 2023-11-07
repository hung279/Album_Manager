import * as Joi from 'joi';

export default () => ({
  port: process.env.PORT || 8000,
  database: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
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
});
