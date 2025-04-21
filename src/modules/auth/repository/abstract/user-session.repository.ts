export abstract class UserSessionRepository {

    abstract create(user: number, token: string, tokenId: string): Promise<void>

    abstract destroy(tokenId: string): Promise<void>

    abstract isValidate(tokenId: string): Promise<boolean>
}