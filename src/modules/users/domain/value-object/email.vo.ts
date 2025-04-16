export class Email {
    constructor(public value: string) { }

    equal(other:string){
        return this.value === other
    }
}