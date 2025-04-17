import { hash, verify } from "argon2";
import { Hashing } from "./hash";

export class ArgonHash implements Hashing {
    hash(password: string): Promise<string> {
        return hash(password)
    }

    async verify(hash: string, password: string): Promise<boolean> {
        return verify(hash, password);
    }
}