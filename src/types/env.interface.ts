export interface IEnv {
  PORT: number;
  PREFIX: string;
  VERSION: string;
  PG_PORT: number;
  PG_USER: string;
  PG_DBNAME: string;
  PG_HOST: string;
  PG_PASSWORD: string;
  S3_ACCESS_KEY: string
  S3_SECRET_KEY: string
  S3_BUCKET: string
  S3_END_POINT: string
  ZARINPAL_MERCHANT_ID: string
  ZARINPAL_CALLBACK_URL: string
  IS_SANDBOX: true
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IEnv { }
  }
}
