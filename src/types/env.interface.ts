export interface IEnv {
    PORT: number;
    PREFIX: string;
    VERSION: string
    PG_PORT: number;
    PG_USER: string;
    PG_DBNAME: string;
    PG_HOST: string;
    PG_PASSWORD: string;
}


declare global {
    namespace NodeJS {
        interface ProcessEnv extends IEnv {}
    }
}

