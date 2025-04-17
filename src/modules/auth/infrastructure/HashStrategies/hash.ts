export abstract class Hashing {
    abstract hash(password: string): Promise<string>
    abstract verify(hash: string, password: string): Promise<boolean>
}