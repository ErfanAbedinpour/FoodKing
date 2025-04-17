export class UserId {
    constructor(private readonly value: string | number) { }
    toString() {
        return this.value;
    }
}
