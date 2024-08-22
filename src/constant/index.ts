import * as dotenv from 'dotenv';

dotenv.config();
console.log(process.env.DB_USERNAME, " pass");
export const DATABASE_URL = process.env.DATABASE_URL;

export const DATABASE_CONFIG = {
  TYPE: process.env.TYPE,
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  DATABASE: process.env.DB_DATABASE,
};


export const PORT = process.env.PORT || 3000;

export const JWT_CONST = {
    ACCESS_SECRET: process.env.SECRET_ACCESS_TOKEN_KEY,
    REFRESH_SECRET: process.env.SECRET_REFRESH_TOKEN_KEY,
    ACCESS_EXPIRED: () => {
      return 60 * 60 * 24 * 1000 + new Date().getTime();
    }, // mini seconds one hour from now (integer)
    REFRESH_EXPIRED: () => {
      return 60 * 60 * 24 * 30 * 1000 + new Date().getTime();
    }, // mini seconds one month from now
    ACCESS_EXPIRED_GENERATION: 60 * 60,
    REFRESH_EXPIRED_GENERATION: 60 * 60 * 24 * 30,
  };