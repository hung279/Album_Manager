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
});

export const configValidationSchema = Joi.object({
  PORT: Joi.number().required(),
});
