export class Otp {
    constructor(public code: string, public exp: number) { }


    equal(code: string) {
        return this.code === code;
    }


    isValid() {
        return this.exp > Date.now()
    }
}